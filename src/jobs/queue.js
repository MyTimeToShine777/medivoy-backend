/**
 * Centralized Queue Manager
 * Manages all Bull queues with consistent configuration and error handling
 * Following Medivoy's production standards
 * Status: PRODUCTION-READY
 */

const Queue = require('bull');
const redis = require('../config/redis');
const logger = require('../utils/logger');

// Queue configuration with production-grade settings
const queueConfig = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: 0,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        enableOfflineQueue: true,
    },
    defaultJobOptions: {
        attempts: process.env.NODE_ENV === 'production' ? 5 : 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            age: 3600, // Remove completed jobs after 1 hour
            isPattern: false,
        },
        removeOnFail: false, // Keep failed jobs for debugging
    },
    settings: {
        maxStalledCount: 2,
        stalledInterval: 5000,
        maxStalledInterval: 30000,
        lockDuration: 30000,
        lockRenewTime: 15000,
    },
};

// Initialize all 8 queues
const queues = {
    translation: new Queue('translation', queueConfig),
    email: new Queue('email', queueConfig),
    sms: new Queue('sms', queueConfig),
    notification: new Queue('notification', queueConfig),
    backup: new Queue('backup', queueConfig),
    paymentReminder: new Queue('paymentReminder', queueConfig),
    subscriptionRenewal: new Queue('subscriptionRenewal', queueConfig),
    cleanup: new Queue('cleanup', queueConfig),
};

// Queue event handlers for all queues
Object.entries(queues).forEach(([queueName, queue]) => {
    // Completed event
    queue.on('completed', (job, result) => {
        logger.info(`✅ Queue [${queueName}] Job ${job.id} completed`, {
            jobId: job.id,
            result,
            duration: Date.now() - job.processedOn,
        });
    });

    // Failed event
    queue.on('failed', (job, err) => {
        logger.error(`❌ Queue [${queueName}] Job ${job.id} failed`, {
            jobId: job.id,
            error: err.message,
            stack: err.stack,
            attempts: job.attemptsMade,
        });
    });

    // Stalled event - detects hanging jobs
    queue.on('stalled', (job) => {
        logger.warn(`⚠️ Queue [${queueName}] Job ${job.id} stalled`, {
            jobId: job.id,
            data: job.data,
        });
    });

    // Error event - critical queue errors
    queue.on('error', (error) => {
        logger.error(`🔥 Queue [${queueName}] error`, {
            error: error.message,
            stack: error.stack,
        });
    });

    // Drained event - when queue becomes idle
    queue.on('drained', () => {
        logger.info(`⏳ Queue [${queueName}] drained - all jobs processed`);
    });

    // Ready event
    queue.on('ready', () => {
        logger.info(`🟢 Queue [${queueName}] is ready`);
    });

    // Clean up on process exit
    process.on('exit', () => {
        queue.close();
    });
});

/**
 * Health check for all queues
 * Returns detailed statistics for monitoring
 */
async function checkQueuesHealth() {
    try {
        const health = {};
        for (const [queueName, queue] of Object.entries(queues)) {
            const counts = await queue.getJobCounts();
            health[queueName] = {
                active: counts.active,
                waiting: counts.waiting,
                completed: counts.completed,
                failed: counts.failed,
                delayed: counts.delayed,
                paused: counts.paused,
            };
        }
        return health;
    } catch (error) {
        logger.error('Queue health check failed:', error);
        throw error;
    }
}

/**
 * Pause all queues (graceful shutdown)
 */
async function pauseAllQueues() {
    try {
        await Promise.all(
            Object.values(queues).map((queue) => queue.pause())
        );
        logger.info('✅ All queues paused');
    } catch (error) {
        logger.error('Failed to pause queues:', error);
        throw error;
    }
}

/**
 * Resume all queues
 */
async function resumeAllQueues() {
    try {
        await Promise.all(
            Object.values(queues).map((queue) => queue.resume())
        );
        logger.info('✅ All queues resumed');
    } catch (error) {
        logger.error('Failed to resume queues:', error);
        throw error;
    }
}

/**
 * Clean queues (remove old jobs)
 * Removes jobs older than grace period
 */
async function cleanQueues(grace = 3600000) {
    try {
        for (const queue of Object.values(queues)) {
            await queue.clean(grace, 10000);
        }
        logger.info('✅ All queues cleaned');
    } catch (error) {
        logger.error('Failed to clean queues:', error);
        throw error;
    }
}

/**
 * Get queue status
 * Detailed information about a specific queue
 */
async function getQueueStatus(queueName) {
    try {
        const queue = queues[queueName];
        if (!queue) {
            throw new Error(`Queue '${queueName}' not found`);
        }

        const counts = await queue.getJobCounts();
        const isPaused = await queue.isPaused();

        return {
            name: queueName,
            isPaused,
            jobs: counts,
        };
    } catch (error) {
        logger.error('Failed to get queue status:', error);
        throw error;
    }
}

/**
 * Get job details
 */
async function getJobDetails(queueName, jobId) {
    try {
        const queue = queues[queueName];
        if (!queue) {
            throw new Error(`Queue '${queueName}' not found`);
        }

        const job = await queue.getJob(jobId);
        if (!job) {
            return null;
        }

        const state = await job.getState();
        const progress = job.progress();

        return {
            id: job.id,
            state,
            progress,
            data: job.data,
            result: job.returnvalue,
            attempts: job.attemptsMade,
            maxAttempts: job.opts.attempts,
            stacktrace: job.stacktrace,
            createdAt: new Date(job.timestamp),
        };
    } catch (error) {
        logger.error('Failed to get job details:', error);
        throw error;
    }
}

/**
 * Retry failed job
 */
async function retryJob(queueName, jobId) {
    try {
        const queue = queues[queueName];
        if (!queue) {
            throw new Error(`Queue '${queueName}' not found`);
        }

        const job = await queue.getJob(jobId);
        if (!job) {
            throw new Error(`Job '${jobId}' not found`);
        }

        await job.retry();
        logger.info(`✅ Job ${jobId} retried`);
        return job;
    } catch (error) {
        logger.error('Failed to retry job:', error);
        throw error;
    }
}

/**
 * Remove job from queue
 */
async function removeJob(queueName, jobId) {
    try {
        const queue = queues[queueName];
        if (!queue) {
            throw new Error(`Queue '${queueName}' not found`);
        }

        const job = await queue.getJob(jobId);
        if (job) {
            await job.remove();
            logger.info(`✅ Job ${jobId} removed`);
        }
    } catch (error) {
        logger.error('Failed to remove job:', error);
        throw error;
    }
}

module.exports = {
    queues,
    checkQueuesHealth,
    pauseAllQueues,
    resumeAllQueues,
    cleanQueues,
    getQueueStatus,
    getJobDetails,
    retryJob,
    removeJob,
};