const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true
  },
  session_token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  refresh_token: {
    type: String,
    index: true
  },
  device_info: {
    type: {
      device_type: String,
      device_name: String,
      os: String,
      os_version: String,
      browser: String,
      browser_version: String
    },
    default: {}
  },
  ip_address: {
    type: String,
    required: true
  },
  user_agent: {
    type: String
  },
  location: {
    type: {
      country: String,
      city: String,
      region: String,
      latitude: Number,
      longitude: Number
    },
    default: {}
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  last_activity: {
    type: Date,
    default: Date.now,
    index: true
  },
  login_at: {
    type: Date,
    default: Date.now
  },
  logout_at: {
    type: Date
  },
  expires_at: {
    type: Date,
    required: true,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'sessions'
});

// Indexes for better query performance
sessionSchema.index({ user_id: 1, is_active: 1 });
sessionSchema.index({ session_token: 1, is_active: 1 });
sessionSchema.index({ expires_at: 1 });
sessionSchema.index({ last_activity: -1 });

// TTL index - automatically delete expired sessions
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Instance methods
sessionSchema.methods.updateActivity = async function() {
  this.last_activity = new Date();
  return this.save();
};

sessionSchema.methods.terminate = async function() {
  this.is_active = false;
  this.logout_at = new Date();
  return this.save();
};

sessionSchema.methods.isExpired = function() {
  return new Date() > this.expires_at;
};

sessionSchema.methods.isValid = function() {
  return this.is_active && !this.isExpired();
};

// Static methods
sessionSchema.statics.createSession = async function(data) {
  const session = new this({
    user_id: data.user_id,
    session_token: data.session_token,
    refresh_token: data.refresh_token,
    device_info: data.device_info || {},
    ip_address: data.ip_address,
    user_agent: data.user_agent,
    location: data.location || {},
    expires_at: data.expires_at,
    metadata: data.metadata || {}
  });

  return session.save();
};

sessionSchema.statics.findByToken = async function(sessionToken) {
  return this.findOne({
    session_token: sessionToken,
    is_active: true
  });
};

sessionSchema.statics.findByRefreshToken = async function(refreshToken) {
  return this.findOne({
    refresh_token: refreshToken,
    is_active: true
  });
};

sessionSchema.statics.getUserActiveSessions = async function(userId) {
  return this.find({
    user_id: userId,
    is_active: true,
    expires_at: { $gt: new Date() }
  })
    .sort({ last_activity: -1 })
    .lean();
};

sessionSchema.statics.getUserAllSessions = async function(userId, options = {}) {
  const { limit = 50, skip = 0 } = options;

  return this.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

sessionSchema.statics.terminateSession = async function(sessionToken) {
  return this.findOneAndUpdate(
    { session_token: sessionToken },
    {
      $set: {
        is_active: false,
        logout_at: new Date()
      }
    },
    { new: true }
  );
};

sessionSchema.statics.terminateUserSessions = async function(userId, exceptToken = null) {
  const query = {
    user_id: userId,
    is_active: true
  };

  if (exceptToken) {
    query.session_token = { $ne: exceptToken };
  }

  return this.updateMany(
    query,
    {
      $set: {
        is_active: false,
        logout_at: new Date()
      }
    }
  );
};

sessionSchema.statics.terminateAllUserSessions = async function(userId) {
  return this.updateMany(
    {
      user_id: userId,
      is_active: true
    },
    {
      $set: {
        is_active: false,
        logout_at: new Date()
      }
    }
  );
};

sessionSchema.statics.cleanupExpiredSessions = async function() {
  const result = await this.updateMany(
    {
      is_active: true,
      expires_at: { $lt: new Date() }
    },
    {
      $set: {
        is_active: false,
        logout_at: new Date()
      }
    }
  );

  return result.modifiedCount;
};

sessionSchema.statics.getActiveSessionsCount = async function(userId = null) {
  const query = {
    is_active: true,
    expires_at: { $gt: new Date() }
  };

  if (userId) {
    query.user_id = userId;
  }

  return this.countDocuments(query);
};

sessionSchema.statics.getSessionStats = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        created_at: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
          day: { $dayOfMonth: '$created_at' }
        },
        total_sessions: { $sum: 1 },
        active_sessions: {
          $sum: { $cond: ['$is_active', 1, 0] }
        },
        unique_users: { $addToSet: '$user_id' }
      }
    },
    {
      $project: {
        _id: 1,
        total_sessions: 1,
        active_sessions: 1,
        unique_users_count: { $size: '$unique_users' }
      }
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
    }
  ]);
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;