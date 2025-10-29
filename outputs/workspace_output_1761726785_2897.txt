const Redis = require('ioredis');
const config = require('./index');
const logger = require('../utils/logger');

// Create Redis instance
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Handle Redis connection events
redis.on('connect', () => {
  logger.info('✅ Redis client connected');
});

redis.on('error', (error) => {
  logger.error('❌ Redis connection error:', error);
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis client reconnecting');
});

redis.on('close', () => {
  logger.info('🔒 Redis client closed');
});

module.exports = redis;