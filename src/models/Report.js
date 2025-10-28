const { pool } = require('../config/database');
const logger = require('../utils/logger');

class Report {
  // Create a new report
  static async create(reportData) {
    const { ra, predio, andar, tipo_banheiro, problemas, outro_problema } = reportData;
    
    const query = `
      INSERT INTO reports (ra, predio, andar, tipo_banheiro, problemas, outro_problema)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at
    `;
    
    try {
      const result = await pool.query(query, [
        ra, predio, andar, tipo_banheiro, problemas, outro_problema
      ]);
      
      // Insert initial status history
      const reportId = result.rows[0].id;
      await pool.query(
        'INSERT INTO status_history (report_id, status_novo) VALUES ($1, $2)',
        [reportId, 'pendente']
      );
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating report:', error);
      throw error;
    }
  }
  
  // Find all reports with optional filters
  static async findAll(filters = {}) {
    let query = `
      SELECT r.*, 
             json_agg(
               json_build_object(
                 'id', sh.id,
                 'status_anterior', sh.status_anterior,
                 'status_novo', sh.status_novo,
                 'responsavel', sh.responsavel,
                 'observacao', sh.observacao,
                 'created_at', sh.created_at
               ) ORDER BY sh.created_at
             ) FILTER (WHERE sh.id IS NOT NULL) as status_history
      FROM reports r
      LEFT JOIN status_history sh ON r.id = sh.report_id
    `;
    
    const values = [];
    const whereClauses = [];
    
    // Add filters
    if (filters.status) {
      values.push(filters.status);
      whereClauses.push(`r.status = $${values.length}`);
    }
    
    if (filters.predio) {
      values.push(filters.predio);
      whereClauses.push(`r.predio = $${values.length}`);
    }
    
    if (filters.tipo_banheiro) {
      values.push(filters.tipo_banheiro);
      whereClauses.push(`r.tipo_banheiro = $${values.length}`);
    }
    
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    query += ` GROUP BY r.id ORDER BY r.created_at DESC`;
    
    // Add pagination
    if (filters.limit) {
      values.push(filters.limit);
      query += ` LIMIT $${values.length}`;
    }
    
    if (filters.offset) {
      values.push(filters.offset);
      query += ` OFFSET $${values.length}`;
    }
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error('Error finding reports:', error);
      throw error;
    }
  }
  
  // Find report by ID
  static async findById(id) {
    const query = `
      SELECT r.*, 
             json_agg(
               json_build_object(
                 'id', sh.id,
                 'status_anterior', sh.status_anterior,
                 'status_novo', sh.status_novo,
                 'responsavel', sh.responsavel,
                 'observacao', sh.observacao,
                 'created_at', sh.created_at
               ) ORDER BY sh.created_at
             ) FILTER (WHERE sh.id IS NOT NULL) as status_history
      FROM reports r
      LEFT JOIN status_history sh ON r.id = sh.report_id
      WHERE r.id = $1
      GROUP BY r.id
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding report by ID:', error);
      throw error;
    }
  }
  
  // Update report status
  static async updateStatus(id, status, responsavel, observacao = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get current status
      const currentReport = await client.query('SELECT status FROM reports WHERE id = $1', [id]);
      if (currentReport.rows.length === 0) {
        throw new Error('Reporte não encontrado');
      }
      
      const currentStatus = currentReport.rows[0].status;
      
      // Update report status
      const updateQuery = `
        UPDATE reports 
        SET status = $1, 
            updated_at = NOW(),
            resolved_at = CASE WHEN $1 = 'resolvido' THEN NOW() ELSE resolved_at END
        WHERE id = $2
        RETURNING *
      `;
      
      const updateResult = await client.query(updateQuery, [status, id]);
      
      // Insert status history
      const historyQuery = `
        INSERT INTO status_history (report_id, status_anterior, status_novo, responsavel, observacao)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      await client.query(historyQuery, [id, currentStatus, status, responsavel, observacao]);
      
      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error updating report status:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Get statistics
  static async getStatistics() {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM reports',
      porStatus: 'SELECT status, COUNT(*) as count FROM reports GROUP BY status',
      porPredio: 'SELECT predio, COUNT(*) as count FROM reports GROUP BY predio',
      tempoMedioResolucao: `
        SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_hours 
        FROM reports 
        WHERE status = 'resolvido' AND resolved_at IS NOT NULL
      `,
      ultimos7Dias: `
        SELECT DATE(created_at) as data, COUNT(*) as count 
        FROM reports 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY data
      `
    };
    
    try {
      const results = {};
      
      for (const [key, query] of Object.entries(queries)) {
        const result = await pool.query(query);
        results[key] = result.rows;
      }
      
      return results;
    } catch (error) {
      logger.error('Error getting statistics:', error);
      throw error;
    }
  }
  
  // Count reports by RA in the last hour (for rate limiting)
  static async countByRaInLastHour(ra) {
    const query = `
      SELECT COUNT(*) as count
      FROM reports
      WHERE ra = $1 AND created_at >= NOW() - INTERVAL '1 hour'
    `;
    
    try {
      const result = await pool.query(query, [ra]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Error counting reports by RA:', error);
      throw error;
    }
  }
}

module.exports = Report;