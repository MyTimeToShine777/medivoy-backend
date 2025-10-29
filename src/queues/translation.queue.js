const Queue = require('bull');
const logger = require('../utils/logger');

// Create translation queue
const translationQueue = new Queue('translation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Queue event listeners
translationQueue.on('completed', (job, result) => {
  logger.info(`Translation job ${job.id} completed:`, result);
});

translationQueue.on('failed', (job, err) => {
  logger.error(`Translation job ${job.id} failed:`, err);
});

translationQueue.on('stalled', (job) => {
  logger.warn(`Translation job ${job.id} stalled`);
});

translationQueue.on('error', (error) => {
  logger.error('Translation queue error:', error);
});

module.exports = translationQueue;