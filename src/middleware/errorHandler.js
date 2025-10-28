const logger = require('../utils/logger');

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // PostgreSQL error codes
  if (err.code) {
    // Unique violation
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Entrada duplicada',
        message: 'Este registro já existe'
      });
    }
    
    // Foreign key violation
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'Referência inválida',
        message: 'Registro referenciado não existe'
      });
    }
    
    // Not null violation
    if (err.code === '23502') {
      return res.status(400).json({
        error: 'Campo obrigatório ausente',
        message: 'Um campo obrigatório está faltando'
      });
    }
  }
  
  // Handle validation errors from express-validator
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      message: err.message
    });
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'O token fornecido é inválido'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'O token fornecido expirou'
    });
  }
  
  // Default error response
  if (process.env.NODE_ENV === 'production') {
    // Don't expose internal error details in production
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro inesperado'
    });
  } else {
    // In development, provide more details
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: err.message,
      stack: err.stack
    });
  }
};

module.exports = errorHandler;