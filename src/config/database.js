// config/database.js
const { Pool } = require('pg');
const logger = require('../utils/logger');

// Configuração do Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'senai_bathroom_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Eventos do Pool
pool.on('connect', () => {
  logger.info('Nova conexão estabelecida com o PostgreSQL');
});

pool.on('acquire', () => {
  logger.debug('Conexão adquirida do pool');
});

pool.on('error', (err) => {
  logger.error('Erro inesperado no pool do PostgreSQL:', err.stack);
  process.exit(-1);
});

// Função para testar conexão (opcional, mas útil)
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time, version() AS pg_version');
    client.release();

    logger.info('Conexão com PostgreSQL estabelecida com sucesso');
    logger.info(`Horário do banco: ${result.rows[0].current_time}`);
    logger.info(`Versão do PostgreSQL: ${result.rows[0].pg_version.split(',')[0]}`);
  } catch (err) {
    logger.error('Falha ao conectar ao PostgreSQL:', err.message);
    logger.error('Verifique: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection
};