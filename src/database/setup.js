const { Pool } = require('pg');
require('dotenv').config();
const logger = require('../utils/logger');

// SQL script to create tables
const createTablesQuery = `
-- Create problem_categories table
CREATE TABLE IF NOT EXISTS problem_categories (
  id SERIAL PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  ra VARCHAR(20) NOT NULL,
  predio VARCHAR(50) NOT NULL,
  andar VARCHAR(10) NOT NULL,
  tipo_banheiro VARCHAR(20) CHECK (tipo_banheiro IN ('masculino', 'feminino')),
  problemas TEXT[] NOT NULL,
  outro_problema TEXT,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'resolvido')),
  prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Create status_history table
CREATE TABLE IF NOT EXISTS status_history (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  status_anterior VARCHAR(20),
  status_novo VARCHAR(20) NOT NULL,
  responsavel VARCHAR(100),
  observacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'limpeza', 'manutencao')),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_ra ON reports(ra);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_predio ON reports(predio);
CREATE INDEX IF NOT EXISTS idx_reports_tipo_banheiro ON reports(tipo_banheiro);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_status_history_report_id ON status_history(report_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
`;

async function setupDatabase() {
  // Create a new pool for setup
  const setupPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senai_bathroom_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    logger.info('Setting up database tables...');
    
    // Execute the create tables query
    await setupPool.query(createTablesQuery);
    
    logger.info('Database tables created successfully');
    logger.info('Lembre-se de configurar as variáveis de ambiente no arquivo .env com suas credenciais seguras');
    await setupPool.end();
    process.exit(0);
  } catch (error) {
    logger.error('Error setting up database:', error);
    await setupPool.end();
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;