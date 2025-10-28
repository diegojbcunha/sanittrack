const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Report = require('../models/Report');
const logger = require('../utils/logger');

// Admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await Admin.findByEmail(email);
    
    if (!admin) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }
    
    // Verify password
    const isPasswordValid = await Admin.verifyPassword(password, admin.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    // Remove password hash from response
    const { password_hash, ...adminWithoutPassword } = admin;
    
    logger.info(`Admin logged in: ${admin.email}`);
    
    res.json({
      success: true,
      token,
      user: adminWithoutPassword
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Falha no login',
      message: error.message
    });
  }
};

// Get all reports with filters
const getAllReports = async (req, res) => {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.status) filters.status = req.query.status;
    if (req.query.predio) filters.predio = req.query.predio;
    if (req.query.tipo_banheiro) filters.tipo_banheiro = req.query.tipo_banheiro;
    if (req.query.limit) filters.limit = parseInt(req.query.limit);
    if (req.query.offset) filters.offset = parseInt(req.query.offset);
    
    // Get reports
    const reports = await Report.findAll(filters);
    
    // Get total count for pagination
    const countResult = await Report.findAll({ ...filters, limit: null, offset: null });
    const total = countResult.length;
    
    res.json({
      success: true,
      reports,
      total
    });
  } catch (error) {
    logger.error('Error fetching reports:', error);
    res.status(500).json({
      error: 'Falha ao buscar reportes',
      message: error.message
    });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({
        error: 'Reporte não encontrado'
      });
    }
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    logger.error('Error fetching report:', error);
    res.status(500).json({
      error: 'Falha ao buscar reporte',
      message: error.message
    });
  }
};

// Update report status
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observacao } = req.body;
    const responsavel = req.admin.nome; // Get admin name from authenticated user
    
    const updatedReport = await Report.updateStatus(id, status, responsavel, observacao);
    
    logger.info(`Report ${id} status updated to ${status} by ${responsavel}`);
    
    res.json({
      success: true,
      message: 'Status atualizado',
      report: updatedReport
    });
  } catch (error) {
    logger.error('Error updating report status:', error);
    res.status(500).json({
      error: 'Falha ao atualizar status do reporte',
      message: error.message
    });
  }
};

// Get system statistics
const getStatistics = async (req, res) => {
  try {
    const statistics = await Report.getStatistics();
    
    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    logger.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Falha ao buscar estatísticas',
      message: error.message
    });
  }
};

module.exports = {
  login,
  getAllReports,
  getReportById,
  updateReportStatus,
  getStatistics
};