const { pool } = require('../config/database');
const logger = require('../utils/logger');

class ProblemCategory {
  // Get all categories grouped by type
  static async getAllGrouped() {
    const query = `
      SELECT categoria, 
             json_agg(
               json_build_object(
                 'id', id,
                 'descricao', descricao,
                 'ativo', ativo,
                 'created_at', created_at
               ) ORDER BY id
             ) as items
      FROM problem_categories 
      WHERE ativo = true
      GROUP BY categoria
      ORDER BY categoria
    `;
    
    try {
      const result = await pool.query(query);
      // Convert to object with category names as keys
      const grouped = {};
      result.rows.forEach(row => {
        grouped[row.categoria] = row.items;
      });
      return grouped;
    } catch (error) {
      logger.error('Error getting categories:', error);
      throw error;
    }
  }
  
  // Get all active categories as flat array
  static async getAll() {
    const query = 'SELECT * FROM problem_categories WHERE ativo = true ORDER BY categoria, id';
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      logger.error('Error getting all categories:', error);
      throw error;
    }
  }
}

module.exports = ProblemCategory;