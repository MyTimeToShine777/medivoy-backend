/**
 * Worker Entry Point
 * Initializes and manages all background job processors
 * Run separately: node worker.js or npm run worker:dev
 * Status: PRODUCTION-READY
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

const logger = require('./src/utils/logger');
const { queues, checkQueuesHealth } = require('./src/jobs/queue');

// Import all worker processors
require('./src/workers/translation.worker');
// Add other workers as needed:
// require('./src/workers/email.worker');
// require('./src/workers/sms.worker');
// require('./src/workers/notification.worker');
// require('./src/workers/backup.worker');
// etc...

const PORT = process.env.WORKER_PORT || 3001;

/**
 * Start the worker process
 */
async function startWorker() {
  try {
    logger.info('='.repeat(60));
    logger.info('🚀 Medivoy Background Worker Starting...');
    logger.info('='.repeat(60));

    // Check queue health on startup
    const health = await checkQueuesHealth();
    logger.info('📊 Queue Status on Startup:', health);
    logger.info('');

    // Log worker configuration
    logger.info('⚙️  Worker Configuration:');
    logger.info(` Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(` Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    logger.info(` Max Concurrency: 4 workers per queue`);
    logger.info('');

    // Log active queues
    logger.info('📋 Active Queues:');
    Object.keys(queues).forEach((queueName) => {
      logger.info(` ✓ ${queueName}`);
    });
    logger.info('');

    logger.info('✅ Background Worker is running and ready for jobs!');
    logger.info('');
    logger.info('Monitor queue status:');
    logger.info(
      ` GET http://localhost:${process.env.APP_PORT}/api/v1/admin/queues/health`
    );
    logger.info('');
    logger.info('='.repeat(60));
  } catch (error) {
    logger.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
}

/**
 * Health check endpoint for monitoring
 */
if (process.env.ENABLE_WORKER_HEALTH_CHECK === 'true') {
  const express = require('express');
  const app = express();

  app.get('/health', async (req, res) => {
    try {
      const health = await checkQueuesHealth();
      res.json({
        status: 'OK',
        worker: 'active',
        queues: health,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: 'ERROR',
        error: error.message,
      });
    }
  });

  app.listen(PORT, () => {
    logger.info(
      `🌐 Worker health check endpoint: http://localhost:${PORT}/health`
    );
  });
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown() {
  logger.info('');
  logger.info('='.repeat(60));
  logger.info('🛑 Shutting down worker gracefully...');
  logger.info('='.repeat(60));

  try {
    // Pause all queues to prevent new jobs
    logger.info('⏸️  Pausing all queues...');
    for (const [queueName, queue] of Object.entries(queues)) {
      await queue.pause();
      logger.info(` ✓ ${queueName} paused`);
    }

    logger.info('✅ All queues paused');
    logger.info('');

    // Wait for in-progress jobs to complete
    logger.info('⏳ Waiting for in-progress jobs to complete (5 seconds)...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Close all queues
    logger.info('🔌 Closing all queues...');
    for (const [queueName, queue] of Object.entries(queues)) {
      await queue.close();
      logger.info(` ✓ ${queueName} closed`);
    }

    logger.info('');
    logger.info('✅ Worker shut down successfully');
    logger.info('='.repeat(60));
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Handle SIGTERM (from PM2/Docker)
process.on('SIGTERM', gracefulShutdown);

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('🔥 Uncaught Exception in Worker:', error);
  gracefulShutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('🔥 Unhandled Rejection in Worker:', {
    reason,
    promise: promise.toString(),
  });
  gracefulShutdown();
});

// Start the worker
startWorker();
