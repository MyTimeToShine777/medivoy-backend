const mongoose = require('mongoose');
const { Op } = require('sequelize');
const { analyticsQueue } = require('./queue');
const logger = require('../utils/logger');
const {
  Booking, Appointment, Payment, User, Hospital, Doctor,
} = require('../models');

// Process analytics jobs
analyticsQueue.process(async (job) => {
  const { type, data } = job.data;

  try {
    logger.info('Processing analytics job', { type, jobId: job.id });

    switch (type) {
      case 'daily_stats':
        await generateDailyStats(data);
        break;

      case 'monthly_report':
        await generateMonthlyReport(data);
        break;

      case 'user_activity':
        await trackUserActivity(data);
        break;

      case 'revenue_analysis':
        await analyzeRevenue(data);
        break;

      case 'performance_metrics':
        await calculatePerformanceMetrics(data);
        break;

      default:
        throw new Error(`Unknown analytics type: ${type}`);
    }

    logger.info('Analytics job completed successfully', { type, jobId: job.id });
    return { success: true, type };
  } catch (error) {
    logger.error('Analytics job failed', { type, jobId: job.id, error: error.message });
    throw error;
  }
});

// Generate daily statistics
const generateDailyStats = async (data) => {
  const date = data.date || new Date();
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  try {
    const Analytics = mongoose.model('Analytics');

    // Count new users
    const newUsers = await User.count({
      where: {
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    // Count new bookings
    const newBookings = await Booking.count({
      where: {
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    // Count completed appointments
    const completedAppointments = await Appointment.count({
      where: {
        status: 'completed',
        updated_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    // Calculate daily revenue
    const dailyRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    // Save analytics data
    await Analytics.create({
      date: startOfDay,
      type: 'daily_stats',
      data: {
        newUsers,
        newBookings,
        completedAppointments,
        dailyRevenue: dailyRevenue || 0,
      },
    });

    logger.info('Daily stats generated', {
      date: startOfDay,
      newUsers,
      newBookings,
      completedAppointments,
      dailyRevenue,
    });

    return {
      success: true,
      stats: {
        newUsers, newBookings, completedAppointments, dailyRevenue,
      },
    };
  } catch (error) {
    logger.error('Failed to generate daily stats', { error: error.message });
    throw error;
  }
};

// Generate monthly report
const generateMonthlyReport = async (data) => {
  const date = data.date || new Date();
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  try {
    const Analytics = mongoose.model('Analytics');

    // Monthly statistics
    const stats = {
      totalUsers: await User.count(),
      newUsers: await User.count({
        where: {
          created_at: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      }),
      totalBookings: await Booking.count({
        where: {
          created_at: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      }),
      completedBookings: await Booking.count({
        where: {
          status: 'completed',
          updated_at: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      }),
      totalRevenue: await Payment.sum('amount', {
        where: {
          status: 'completed',
          created_at: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      }) || 0,
      activeHospitals: await Hospital.count({
        where: { is_active: true },
      }),
      activeDoctors: await Doctor.count({
        where: { is_verified: true },
      }),
    };

    // Save monthly report
    await Analytics.create({
      date: startOfMonth,
      type: 'monthly_report',
      data: stats,
    });

    logger.info('Monthly report generated', { month: startOfMonth, stats });
    return { success: true, stats };
  } catch (error) {
    logger.error('Failed to generate monthly report', { error: error.message });
    throw error;
  }
};

// Track user activity
const trackUserActivity = async (data) => {
  const { userId, action, metadata } = data;

  try {
    const Analytics = mongoose.model('Analytics');

    await Analytics.create({
      date: new Date(),
      type: 'user_activity',
      userId,
      data: {
        action,
        metadata,
        timestamp: new Date(),
      },
    });

    logger.info('User activity tracked', { userId, action });
    return { success: true };
  } catch (error) {
    logger.error('Failed to track user activity', { error: error.message });
    throw error;
  }
};

// Analyze revenue
const analyzeRevenue = async (data) => {
  const period = data.period || 'month'; // day, week, month, year
  const date = data.date || new Date();

  try {
    let startDate; let
      endDate;

    switch (period) {
      case 'day':
        startDate = new Date(date.setHours(0, 0, 0, 0));
        endDate = new Date(date.setHours(23, 59, 59, 999));
        break;
      case 'week':
        startDate = new Date(date.setDate(date.getDate() - date.getDay()));
        endDate = new Date(date.setDate(date.getDate() - date.getDay() + 6));
        break;
      case 'month':
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(date.getFullYear(), 0, 1);
        endDate = new Date(date.getFullYear(), 11, 31);
        break;
    }

    const revenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const transactionCount = await Payment.count({
      where: {
        status: 'completed',
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const averageTransaction = transactionCount > 0 ? revenue / transactionCount : 0;

    logger.info('Revenue analysis completed', {
      period,
      revenue,
      transactionCount,
      averageTransaction,
    });

    return {
      success: true,
      analysis: {
        period,
        startDate,
        endDate,
        revenue: revenue || 0,
        transactionCount,
        averageTransaction,
      },
    };
  } catch (error) {
    logger.error('Failed to analyze revenue', { error: error.message });
    throw error;
  }
};

// Calculate performance metrics
const calculatePerformanceMetrics = async (data) => {
  try {
    // Booking conversion rate
    const totalBookings = await Booking.count();
    const completedBookings = await Booking.count({ where: { status: 'completed' } });
    const conversionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

    // Average appointment duration
    const appointments = await Appointment.findAll({
      where: { status: 'completed' },
      attributes: ['start_time', 'end_time'],
    });

    let totalDuration = 0;
    appointments.forEach((apt) => {
      const duration = new Date(apt.end_time) - new Date(apt.start_time);
      totalDuration += duration;
    });

    const averageDuration = appointments.length > 0 ? totalDuration / appointments.length : 0;

    // Customer satisfaction (based on reviews)
    const { Review } = require('../models');
    const averageRating = await Review.findOne({
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('rating')), 'avgRating']],
    });

    logger.info('Performance metrics calculated', {
      conversionRate,
      averageDuration,
      averageRating: averageRating?.dataValues?.avgRating || 0,
    });

    return {
      success: true,
      metrics: {
        conversionRate,
        averageDuration: averageDuration / (1000 * 60), // Convert to minutes
        averageRating: parseFloat(averageRating?.dataValues?.avgRating || 0),
      },
    };
  } catch (error) {
    logger.error('Failed to calculate performance metrics', { error: error.message });
    throw error;
  }
};

// Schedule analytics jobs
const scheduleAnalyticsJobs = () => {
  // Generate daily stats at midnight
  analyticsQueue.add(
    { type: 'daily_stats', data: {} },
    {
      repeat: {
        cron: '0 0 * * *', // Midnight every day
      },
    },
  );

  // Generate monthly report on the 1st of each month
  analyticsQueue.add(
    { type: 'monthly_report', data: {} },
    {
      repeat: {
        cron: '0 1 1 * *', // 1 AM on the 1st of each month
      },
    },
  );

  logger.info('Analytics jobs scheduled');
};

// Add analytics job to queue
const addAnalyticsJob = async (type, data = {}, options = {}) => {
  try {
    const job = await analyticsQueue.add(
      { type, data },
      {
        priority: options.priority || 3,
        ...options,
      },
    );

    logger.info('Analytics job added to queue', { type, jobId: job.id });
    return job;
  } catch (error) {
    logger.error('Failed to add analytics job to queue', { type, error: error.message });
    throw error;
  }
};

module.exports = {
  addAnalyticsJob,
  scheduleAnalyticsJobs,
};
