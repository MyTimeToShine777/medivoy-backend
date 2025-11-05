const path = require('path');
const { cleanupQueue } = require('./queue');
const fs = require('fs').promises;
const logger = require('../utils/logger');
const { PasswordReset, RefreshToken } = require('../models');
const { Op } = require('sequelize');

// Process cleanup jobs
cleanupQueue.process(async (job) => {
  const { type, data } = job.data;

  try {
    logger.info('Processing cleanup job', { type, jobId: job.id });

    switch (type) {
      case 'temp_files':
        await cleanupTempFiles(data);
        break;

      case 'expired_tokens':
        await cleanupExpiredTokens(data);
        break;

      case 'old_logs':
        await cleanupOldLogs(data);
        break;

      case 'session_data':
        await cleanupSessionData(data);
        break;

      case 'all':
        await cleanupAll(data);
        break;

      default:
        throw new Error(`Unknown cleanup type: ${type}`);
    }

    logger.info('Cleanup job completed successfully', { type, jobId: job.id });
    return { success: true, type };
  } catch (error) {
    logger.error('Cleanup job failed', {
      type,
      jobId: job.id,
      error: error.message,
    });
    throw error;
  }
});

// Cleanup temporary files
const cleanupTempFiles = async (data) => {
  const tempDir = path.join(__dirname, '../../temp');
  const maxAge = data.maxAgeDays || 1; // Default: 1 day
  const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;

  try {
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      const age = now - stats.mtime.getTime();

      if (age > maxAgeMs) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }

    logger.info('Temporary files cleaned up', { deletedCount });
    return { success: true, deletedCount };
  } catch (error) {
    logger.error('Failed to cleanup temp files', { error: error.message });
    throw error;
  }
};

// Cleanup expired tokens
const cleanupExpiredTokens = async (data) => {
  try {
    const now = new Date();

    // Delete expired password reset tokens
    const deletedPasswordResets = await PasswordReset.destroy({
      where: {
        expires_at: {
          [Op.lt]: now,
        },
      },
    });

    // Delete expired refresh tokens
    const deletedRefreshTokens = await RefreshToken.destroy({
      where: {
        expires_at: {
          [Op.lt]: now,
        },
      },
    });

    logger.info('Expired tokens cleaned up', {
      passwordResets: deletedPasswordResets,
      refreshTokens: deletedRefreshTokens,
    });

    return {
      success: true,
      deletedPasswordResets,
      deletedRefreshTokens,
    };
  } catch (error) {
    logger.error('Failed to cleanup expired tokens', { error: error.message });
    throw error;
  }
};

// Cleanup old log files
const cleanupOldLogs = async (data) => {
  const logsDir = path.join(__dirname, '../../logs');
  const maxAge = data.maxAgeDays || 30; // Default: 30 days
  const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;

  try {
    const files = await fs.readdir(logsDir);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      // Skip current log files
      if (
        file.includes('.log') &&
        !file.includes(new Date().toISOString().split('T')[0])
      ) {
        const filePath = path.join(logsDir, file);
        const stats = await fs.stat(filePath);
        const age = now - stats.mtime.getTime();

        if (age > maxAgeMs) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }
    }

    logger.info('Old log files cleaned up', { deletedCount });
    return { success: true, deletedCount };
  } catch (error) {
    logger.error('Failed to cleanup old logs', { error: error.message });
    throw error;
  }
};

// Cleanup old session data from MongoDB
const cleanupSessionData = async (data) => {
  try {
    const mongoose = require('mongoose');
    const Session = mongoose.model('Session');

    const maxAge = data.maxAgeDays || 7; // Default: 7 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAge);

    const result = await Session.deleteMany({
      updatedAt: { $lt: cutoffDate },
    });

    logger.info('Old session data cleaned up', {
      deletedCount: result.deletedCount,
    });
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    logger.error('Failed to cleanup session data', { error: error.message });
    throw error;
  }
};

// Run all cleanup tasks
const cleanupAll = async (data) => {
  const results = {
    tempFiles: null,
    expiredTokens: null,
    oldLogs: null,
    sessionData: null,
  };

  try {
    results.tempFiles = await cleanupTempFiles(data);
    results.expiredTokens = await cleanupExpiredTokens(data);
    results.oldLogs = await cleanupOldLogs(data);
    results.sessionData = await cleanupSessionData(data);

    logger.info('All cleanup tasks completed', results);
    return results;
  } catch (error) {
    logger.error('Cleanup all failed', { error: error.message });
    throw error;
  }
};

// Schedule daily cleanup
const scheduleDailyCleanup = () => {
  // Run cleanup every day at 3 AM
  cleanupQueue.add(
    { type: 'all', data: {} },
    {
      repeat: {
        cron: '0 3 * * *', // 3 AM every day
      },
    }
  );

  logger.info('Daily cleanup scheduled');
};

// Add cleanup job to queue
const addCleanupJob = async (type, data = {}, options = {}) => {
  try {
    const job = await cleanupQueue.add(
      { type, data },
      {
        priority: options.priority || 2,
        ...options,
      }
    );

    logger.info('Cleanup job added to queue', { type, jobId: job.id });
    return job;
  } catch (error) {
    logger.error('Failed to add cleanup job to queue', {
      type,
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  addCleanupJob,
  scheduleDailyCleanup,
};
