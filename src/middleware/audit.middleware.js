const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Define audit log schema
const auditLogSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  user_email: String,
  action: { type: String, required: true },
  entity_type: String,
  entity_id: String,
  changes: mongoose.Schema.Types.Mixed,
  ip_address: String,
  user_agent: String,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'audit_logs' });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

/**
 * Audit middleware - Log all actions
 */
const auditMiddleware = async (req, res, next) => {
  // Store original res.json
  const originalJson = res.json.bind(res);
  
  // Override res.json
  res.json = async (data) => {
    // Only log successful requests
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      try {
        await AuditLog.create({
          user_id: req.user.id.toString(),
          user_email: req.user.email,
          action: `${req.method} ${req.path}`,
          entity_type: req.baseUrl.split('/').pop(),
          entity_id: req.params.id,
          changes: req.method !== 'GET' ? req.body : undefined,
          ip_address: req.ip,
          user_agent: req.get('user-agent')
        });
      } catch (error) {
        logger.error('Audit log error:', error);
      }
    }
    
    return originalJson(data);
  };
  
  next();
};

module.exports = auditMiddleware;