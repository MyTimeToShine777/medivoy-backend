const Queue = require('bull');
const config = require('../config');
const logger = require('../utils/logger');

// Create queues for different job types
const emailQueue = new Queue('email', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

const smsQueue = new Queue('sms', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

const notificationQueue = new Queue('notification', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

const translationQueue = new Queue('translation', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

const backupQueue = new Queue('backup', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: false
  }
});

const cleanupQueue = new Queue('cleanup', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: false
  }
});

const analyticsQueue = new Queue('analytics', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Queue event listeners
const setupQueueListeners = (queue, queueName) => {
  queue.on('completed', (job, result) => {
    logger.info(`${queueName} job completed`, { jobId: job.id, result });
  });

  queue.on('failed', (job, err) => {
    logger.error(`${queueName} job failed`, { jobId: job.id, error: err.message });
  });

  queue.on('stalled', (job) => {
    logger.warn(`${queueName} job stalled`, { jobId: job.id });
  });

  queue.on('error', (error) => {
    logger.error(`${queueName} queue error`, { error: error.message });
  });
};

// Setup listeners for all queues
setupQueueListeners(emailQueue, 'Email');
setupQueueListeners(smsQueue, 'SMS');
setupQueueListeners(notificationQueue, 'Notification');
setupQueueListeners(translationQueue, 'Translation');
setupQueueListeners(backupQueue, 'Backup');
setupQueueListeners(cleanupQueue, 'Cleanup');
setupQueueListeners(analyticsQueue, 'Analytics');

module.exports = {
  emailQueue,
  smsQueue,
  notificationQueue,
  translationQueue,
  backupQueue,
  cleanupQueue,
  analyticsQueue
};