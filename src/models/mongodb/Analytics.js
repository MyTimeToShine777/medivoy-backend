const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'daily_stats',
      'monthly_report',
      'user_activity',
      'revenue_analysis',
      'performance_metrics',
      'booking_stats',
      'appointment_stats',
      'payment_stats',
      'user_engagement',
      'system_health'
    ],
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: Number,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'analytics'
});

// Compound indexes for better query performance
analyticsSchema.index({ type: 1, date: -1 });
analyticsSchema.index({ userId: 1, type: 1, date: -1 });
analyticsSchema.index({ date: -1 });

// TTL index - automatically delete analytics older than 1 year
analyticsSchema.index({ date: 1 }, { expireAfterSeconds: 31536000 }); // 365 days

// Static methods
analyticsSchema.statics.recordDailyStats = async function(date, stats) {
  return this.findOneAndUpdate(
    {
      date: new Date(date),
      type: 'daily_stats'
    },
    {
      $set: {
        data: stats,
        metadata: {
          generated_at: new Date()
        }
      }
    },
    {
      upsert: true,
      new: true
    }
  );
};

analyticsSchema.statics.recordMonthlyReport = async function(date, report) {
  return this.findOneAndUpdate(
    {
      date: new Date(date),
      type: 'monthly_report'
    },
    {
      $set: {
        data: report,
        metadata: {
          generated_at: new Date()
        }
      }
    },
    {
      upsert: true,
      new: true
    }
  );
};

analyticsSchema.statics.recordUserActivity = async function(userId, activity) {
  const record = new this({
    date: new Date(),
    type: 'user_activity',
    userId,
    data: activity,
    metadata: {
      recorded_at: new Date()
    }
  });

  return record.save();
};

analyticsSchema.statics.getDailyStats = async function(startDate, endDate) {
  return this.find({
    type: 'daily_stats',
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .sort({ date: -1 })
    .lean();
};

analyticsSchema.statics.getMonthlyReports = async function(startDate, endDate) {
  return this.find({
    type: 'monthly_report',
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .sort({ date: -1 })
    .lean();
};

analyticsSchema.statics.getUserActivity = async function(userId, options = {}) {
  const { limit = 100, skip = 0, startDate = null, endDate = null } = options;

  const query = {
    type: 'user_activity',
    userId
  };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  return this.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

analyticsSchema.statics.getRevenueAnalysis = async function(startDate, endDate) {
  return this.find({
    type: 'revenue_analysis',
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .sort({ date: -1 })
    .lean();
};

analyticsSchema.statics.getPerformanceMetrics = async function(startDate, endDate) {
  return this.find({
    type: 'performance_metrics',
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .sort({ date: -1 })
    .lean();
};

analyticsSchema.statics.aggregateByType = async function(type, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        type,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        },
        count: { $sum: 1 },
        data: { $push: '$data' }
      }
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
    }
  ]);
};

analyticsSchema.statics.getLatestByType = async function(type, limit = 10) {
  return this.find({ type })
    .sort({ date: -1 })
    .limit(limit)
    .lean();
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;