const Report = require('../models/Report');
const logger = require('../utils/logger');

// Rate limit by RA - max 5 reports per hour per RA
const rateLimitByRA = async (req, res, next) => {
  try {
    const { ra } = req.body;
    
    if (!ra) {
      return res.status(400).json({ error: 'RA é obrigatório para limitação de taxa' });
    }
    
    const count = await Report.countByRaInLastHour(ra);
    
    if (count >= 5) {
      logger.warn(`Rate limit exceeded for RA: ${ra}`);
      return res.status(429).json({
        error: 'Muitas solicitações. Você atingiu o limite de 5 reportes por hora.'
      });
    }
    
    next();
  } catch (error) {
    logger.error('Rate limiting error:', error);
    // In case of error, we allow the request to proceed to not block legitimate requests
    next();
  }
};

module.exports = {
  rateLimitByRA
};