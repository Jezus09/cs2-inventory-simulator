import express from 'express';
import pool from './db';
import { Item } from './models/item';
import { User } from './models/user';

const app = express();
app.use(express.json());

// List items for sale
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items WHERE buyer_id IS NULL');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Purchase an item
app.post('/items/:id/purchase', async (req, res) => {
  const itemId = req.params.id;
  const buyerId = req.body.buyerId;

  try {
    const client = await pool.connect();

    const itemResult = await client.query('SELECT * FROM items WHERE id = $1', [itemId]);
    const item = itemResult.rows[0];

    if (!item) {
      client.release();
      return res.status(404).send('Item not found');
    }

    const buyerResult = await client.query('SELECT * FROM users WHERE id = $1', [buyerId]);
    const buyer = buyerResult.rows[0];

    if (!buyer) {
      client.release();
      return res.status(404).send('Buyer not found');
    }

    if (buyer.balance < item.price) {
      client.release();
      return res.status(400).send('Insufficient balance');
    }

    await client.query('BEGIN');
    await client.query('UPDATE items SET buyer_id = $1 WHERE id = $2', [buyerId, itemId]);
    await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [item.price, buyerId]);
    await client.query('COMMIT');

    client.release();
    res.send('Purchase successful');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Deposit money to user balance
app.post('/users/:id/deposit', async (req, res) => {
  const userId = req.params.id;
  const amount = req.body.amount;

  try {
    const result = await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *', [amount, userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send('Deposit successful');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});