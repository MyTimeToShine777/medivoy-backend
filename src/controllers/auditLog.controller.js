/**
 * Audit Log Controller
 * Handles audit log retrieval and management
 */

const { Op } = require('sequelize');
const { AuditLog, User } = require('../models');

/**
 * Get all audit logs
 */
exports.getAllAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      actionType,
      entityType,
      entityId,
      severity,
      status,
      startDate,
      endDate,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (userId) whereClause.user_id = userId;
    if (action) whereClause.action = { [Op.iLike]: `%${action}%` };
    if (actionType) whereClause.action_type = actionType;
    if (entityType) whereClause.entity_type = entityType;
    if (entityId) whereClause.entity_id = entityId;
    if (severity) whereClause.severity = severity;
    if (status) whereClause.status = status;

    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[sortBy, sortOrder]],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
      error: error.message,
    });
  }
};

/**
 * Get audit log by ID
 */
exports.getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const auditLog = await AuditLog.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
        },
      ],
    });

    if (!auditLog) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found',
      });
    }

    res.json({
      success: true,
      data: auditLog,
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit log',
      error: error.message,
    });
  }
};

/**
 * Create audit log
 */
exports.createAuditLog = async (req, res) => {
  try {
    const {
      user_id,
      action,
      action_type,
      entity_type,
      entity_id,
      description,
      old_values,
      new_values,
      ip_address,
      user_agent,
      request_method,
      request_url,
      request_body,
      response_status,
      response_time_ms,
      severity,
      status,
      error_message,
      session_id,
      location,
      metadata,
    } = req.body;

    const auditLog = await AuditLog.create({
      user_id,
      action,
      action_type: action_type || 'other',
      entity_type,
      entity_id,
      description,
      old_values,
      new_values,
      ip_address: ip_address || req.ip,
      user_agent: user_agent || req.get('user-agent'),
      request_method,
      request_url,
      request_body,
      response_status,
      response_time_ms,
      severity: severity || 'low',
      status: status || 'success',
      error_message,
      session_id,
      location,
      metadata,
    });

    res.status(201).json({
      success: true,
      message: 'Audit log created successfully',
      data: auditLog,
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating audit log',
      error: error.message,
    });
  }
};

/**
 * Get user activity logs
 */
exports.getUserActivityLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, actionType, startDate, endDate } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { user_id: userId };

    if (actionType) whereClause.action_type = actionType;
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity logs',
      error: error.message,
    });
  }
};

/**
 * Get entity audit trail
 */
exports.getEntityAuditTrail = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const auditLogs = await AuditLog.findAll({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: auditLogs,
    });
  } catch (error) {
    console.error('Error fetching entity audit trail:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching entity audit trail',
      error: error.message,
    });
  }
};

/**
 * Get audit log statistics
 */
exports.getAuditLogStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const totalLogs = await AuditLog.count({ where: whereClause });

    const logsByActionType = await AuditLog.findAll({
      where: whereClause,
      attributes: [
        'action_type',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('id')),
          'count',
        ],
      ],
      group: ['action_type'],
      raw: true,
    });

    const logsBySeverity = await AuditLog.findAll({
      where: whereClause,
      attributes: [
        'severity',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('id')),
          'count',
        ],
      ],
      group: ['severity'],
      raw: true,
    });

    const logsByStatus = await AuditLog.findAll({
      where: whereClause,
      attributes: [
        'status',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('id')),
          'count',
        ],
      ],
      group: ['status'],
      raw: true,
    });

    const topUsers = await AuditLog.findAll({
      where: whereClause,
      attributes: [
        'user_id',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('id')),
          'count',
        ],
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email'],
        },
      ],
      group: [
        'user_id',
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
      ],
      order: [
        [
          require('sequelize').fn(
            'COUNT',
            require('sequelize').col('AuditLog.id')
          ),
          'DESC',
        ],
      ],
      limit: 10,
      subQuery: false,
    });

    res.json({
      success: true,
      data: {
        totalLogs,
        logsByActionType,
        logsBySeverity,
        logsByStatus,
        topUsers,
      },
    });
  } catch (error) {
    console.error('Error fetching audit log statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit log statistics',
      error: error.message,
    });
  }
};

/**
 * Get security events
 */
exports.getSecurityEvents = async (req, res) => {
  try {
    const { page = 1, limit = 50, startDate, endDate } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {
      [Op.or]: [
        { severity: 'critical' },
        { severity: 'high' },
        { status: 'failure' },
        { action_type: 'login' },
      ],
    };

    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching security events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching security events',
      error: error.message,
    });
  }
};

/**
 * Export audit logs
 */
exports.exportAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const auditLogs = await AuditLog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(auditLogs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=audit-logs.csv'
      );
      return res.send(csv);
    }

    res.json({
      success: true,
      data: auditLogs,
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting audit logs',
      error: error.message,
    });
  }
};

/**
 * Helper function to convert to CSV
 */
function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = [
    'ID',
    'User',
    'Action',
    'Entity Type',
    'Entity ID',
    'Status',
    'Severity',
    'Created At',
  ];
  const rows = data.map((log) => [
    log.id,
    log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System',
    log.action,
    log.entity_type || '',
    log.entity_id || '',
    log.status,
    log.severity,
    log.created_at,
  ]);

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}
