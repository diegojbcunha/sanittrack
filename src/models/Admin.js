const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class Admin {
  // Create a new admin with hashed password
  static async create(adminData) {
    const { email, password, nome, role } = adminData;
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO admins (email, password_hash, nome, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, nome, role, created_at
    `;
    
    try {
      const result = await pool.query(query, [email, passwordHash, nome, role]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating admin:', error);
      throw error;
    }
  }
  
  // Find admin by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM admins WHERE email = $1 AND ativo = true';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding admin by email:', error);
      throw error;
    }
  }
  
  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error('Error verifying password:', error);
      throw error;
    }
  }
  
  // Find admin by ID
  static async findById(id) {
    const query = 'SELECT id, email, nome, role, created_at FROM admins WHERE id = $1 AND ativo = true';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding admin by ID:', error);
      throw error;
    }
  }
}

module.exports = Admin;