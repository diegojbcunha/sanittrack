const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Create a new pool for seeding
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'senai_bathroom_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Initial data
const categories = [
  { categoria: 'higiene', descricao: 'Falta de papel higiênico' },
  { categoria: 'higiene', descricao: 'Falta de sabonete' },
  { categoria: 'higiene', descricao: 'Falta de papel toalha' },
  { categoria: 'higiene', descricao: 'Lixeira cheia' },
  { categoria: 'higiene', descricao: 'Banheiro sujo' },
  { categoria: 'hidraulica', descricao: 'Descarga não funciona' },
  { categoria: 'hidraulica', descricao: 'Torneira pingando' },
  { categoria: 'hidraulica', descricao: 'Vaso entupido' },
  { categoria: 'hidraulica', descricao: 'Pia entupida' },
  { categoria: 'estrutura', descricao: 'Porta com defeito' },
  { categoria: 'estrutura', descricao: 'Luz queimada' },
  { categoria: 'estrutura', descricao: 'Trava da porta quebrada' },
  { categoria: 'acessibilidade', descricao: 'Barra de apoio solta' },
  { categoria: 'acessibilidade', descricao: 'Rampa com problema' }
];

const admins = [
  {
    email: 'admin@senai.com',
    password: 'admin123',
    nome: 'Administrador',
    role: 'admin'
  },
  {
    email: 'limpeza@senai.com',
    password: 'limpeza123',
    nome: 'Equipe de Limpeza',
    role: 'limpeza'
  }
];

async function seedDatabase() {
  try {
    logger.info('Seeding database with initial data...');
    
    // Insert categories
    for (const category of categories) {
      await pool.query(
        'INSERT INTO problem_categories (categoria, descricao) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [category.categoria, category.descricao]
      );
    }
    logger.info('Categories inserted successfully');
    
    // Insert admins with hashed passwords
    for (const admin of admins) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
      
      await pool.query(
        'INSERT INTO admins (email, password_hash, nome, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        [admin.email, hashedPassword, admin.nome, admin.role]
      );
    }
    logger.info('Admins inserted successfully');
    
    await pool.end();
    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;