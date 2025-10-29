const logger = require('../utils/logger');

/**
 * Audit middleware to log user activities
 */
const auditMiddleware = async (req, res, next) => {
  try {
    // Log the request details
    logger.info('Audit Log', {
      method: req.method,
      url: req.originalUrl,
      userId: req.user ? req.user.id : null,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });
    
    next();
  } catch (error) {
    logger.error('Audit middleware error:', error);
    next();
  }
};

module.exports = auditMiddleware;