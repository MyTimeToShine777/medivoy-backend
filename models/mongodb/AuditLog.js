const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create', 'read', 'update', 'delete',
      'login', 'logout', 'register',
      'password_reset', 'email_verification',
      'payment', 'booking', 'appointment',
      'upload', 'download', 'export',
      'admin_action', 'system_action',
    ],
  },
  resource_type: {
    type: String,
    required: true,
    index: true,
  },
  resource_id: {
    type: Number,
    index: true,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  old_values: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  new_values: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ip_address: {
    type: String,
    required: true,
  },
  user_agent: {
    type: String,
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'error'],
    default: 'success',
  },
  error_message: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'audit_logs',
});

// Indexes for better query performance
auditLogSchema.index({ user_id: 1, timestamp: -1 });
auditLogSchema.index({ resource_type: 1, resource_id: 1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// TTL index - automatically delete logs older than 90 days
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Static methods
auditLogSchema.statics.log = async function (data) {
  try {
    const log = new this(data);
    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent audit logging from breaking the main flow
    return null;
  }
};

auditLogSchema.statics.getUserLogs = async function (userId, options = {}) {
  const {
    limit = 50,
    skip = 0,
    action = null,
    resourceType = null,
    startDate = null,
    endDate = null,
  } = options;

  const query = { user_id: userId };

  if (action) query.action = action;
  if (resourceType) query.resource_type = resourceType;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

auditLogSchema.statics.getResourceLogs = async function (resourceType, resourceId, options = {}) {
  const { limit = 50, skip = 0 } = options;

  return this.find({
    resource_type: resourceType,
    resource_id: resourceId,
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

auditLogSchema.statics.getActionStats = async function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        success: {
          $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] },
        },
        failure: {
          $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] },
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
