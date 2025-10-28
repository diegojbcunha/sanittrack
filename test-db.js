const { pool } = require('./config/database');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão OK:', res.rows[0]);
    pool.end();
  } catch (err) {
    console.error('Erro de conexão:', err);
  }
})();
