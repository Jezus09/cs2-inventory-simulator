import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
}

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    axios.get('/items')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  const purchaseItem = (itemId: string, buyerId: string) => {
    axios.post(`/items/${itemId}/purchase`, { buyerId })
      .then(response => {
        alert('Purchase successful');
        setItems(items.filter(item => item.id !== itemId));
      })
      .catch(error => {
        alert('Purchase failed: ' + error.response.data);
      });
  };

  return (
    <div>
      <h1>Marketplace</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => purchaseItem(item.id, 'buyer-id')}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Marketplace;