const Redis = require('ioredis');
const config = require('./index');
const logger = require('../utils/logger');

// Create Redis instance with error handling
let redis;

try {
  redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    retryStrategy: (times) => {
      // Stop retrying after 3 attempts
      if (times > 3) {
        logger.warn('⚠️  Redis connection failed after 3 attempts');
        logger.warn('⚠️  Application will continue without Redis');
        return null;
      }
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Don't connect immediately
  });

  // Handle Redis connection events
  redis.on('connect', () => {
    logger.info('✅ Redis client connected');
  });

  redis.on('error', (error) => {
    logger.warn('⚠️  Redis connection error:', error.message);
    logger.warn('⚠️  Application will continue without Redis caching');
  });

  redis.on('reconnecting', () => {
    logger.info('🔄 Redis client reconnecting');
  });

  redis.on('close', () => {
    logger.info('🔒 Redis client closed');
  });

  // Try to connect
  redis.connect().catch((error) => {
    logger.warn('⚠️  Could not connect to Redis:', error.message);
    logger.warn('⚠️  Application will continue without Redis');
  });
} catch (error) {
  logger.warn('⚠️  Redis initialization error:', error.message);
  logger.warn('⚠️  Application will continue without Redis');
  // Create a mock redis client that does nothing
  redis = {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    setex: async () => 'OK',
    expire: async () => 1,
    ttl: async () => -1,
    exists: async () => 0,
    keys: async () => [],
    flushdb: async () => 'OK',
  };
}

module.exports = redis;
