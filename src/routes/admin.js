// routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validateLogin, validateStatusUpdate, checkValidation } = require('../middleware/validation');
const { 
  login, 
  getAllReports, 
  getReportById, 
  updateReportStatus, 
  getStatistics 
} = require('../controllers/adminController');

// POST /api/admin/login
router.post('/login', validateLogin, checkValidation, login);

// GET /api/admin/reportes
router.get('/reportes', authenticate, getAllReports);

// GET /api/admin/reportes/:id
router.get('/reportes/:id', authenticate, getReportById);

// PATCH /api/admin/reportes/:id
router.patch('/reportes/:id', authenticate, validateStatusUpdate, checkValidation, updateReportStatus);

// GET /api/admin/estatisticas
router.get('/estatisticas', authenticate, getStatistics);

module.exports = router;