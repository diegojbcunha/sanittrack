const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection with these credentials:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Port:', process.env.DB_PORT || 5432);
console.log('Database:', process.env.DB_NAME || 'senai_bathroom_db');
console.log('User:', process.env.DB_USER || 'postgres');
console.log('Password length:', (process.env.DB_PASSWORD || '').length);

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'senai_bathroom_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
    console.error('Error code:', err.code);
    console.error('Error detail:', err.detail);
  } else {
    console.log('Database connected successfully');
    console.log('Current time:', res.rows[0].now);
  }
  pool.end();
});