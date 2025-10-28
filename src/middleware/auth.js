const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

// Authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acesso obrigatório' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta');

    // Find admin by ID
    const result = await pool.query('SELECT id, email, role FROM admins WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.admin = result.rows[0]; // attach admin to request
    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }

    return res.status(500).json({ error: 'Falha na autenticação' });
  }
};

// Authorize by role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ error: 'Autenticação obrigatória' });
    if (!roles.includes(req.admin.role)) return res.status(403).json({ error: 'Permissões insuficientes' });
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
