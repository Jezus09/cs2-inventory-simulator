import { Pool } from 'pg';

const pool = new Pool({
  user: 'cs2user',
  host: 'localhost',
  database: 'cs2_inventory',
  password: 'Bekapodafaszt',
  port: 5432,
});

export default pool;