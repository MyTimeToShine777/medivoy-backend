const redis = require('../config/redis');
const logger = require('../utils/logger');

class CacheService {
  /**
   * Get value from cache
   */
  async get(key) {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      throw error;
    }
  }

  /**
   * Set value in cache
   */
  async set(key, value, ttl) {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await redis.setex(key, ttl, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      throw error;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      throw error;
    }
  }

  /**
   * Clear cache with pattern
   */
  async clearPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('Cache clear pattern error:', error);
      throw error;
    }
  }
}

module.exports = new CacheService();
