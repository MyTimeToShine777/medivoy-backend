/**
 * Caching utility for frequently accessed data
 * Uses Redis with fallback to in-memory cache
 */

const redis = require("../config/redis");
const logger = require("./logger");

// In-memory cache fallback
const memoryCache = new Map();

class CacheUtil {
  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} - Cached data or null
   */
  static async get(key) {
    try {
      // Try Redis first
      if (redis && typeof redis.get === "function") {
        const data = await redis.get(key);
        if (data) {
          return JSON.parse(data);
        }
      }

      // Fallback to memory cache
      if (memoryCache.has(key)) {
        const { data, expiry } = memoryCache.get(key);
        if (expiry > Date.now()) {
          return data;
        }
        memoryCache.delete(key);
      }

      return null;
    } catch (error) {
      logger.warn("Cache get error:", error);
      return null;
    }
  }

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in seconds (default: 300)
   * @returns {Promise<boolean>} - Success status
   */
  static async set(key, data, ttl = 300) {
    try {
      const serializedData = JSON.stringify(data);

      // Try Redis first
      if (redis && typeof redis.setex === "function") {
        await redis.setex(key, ttl, serializedData);
        return true;
      }

      // Fallback to memory cache
      memoryCache.set(key, {
        data,
        expiry: Date.now() + ttl * 1000,
      });

      return true;
    } catch (error) {
      logger.warn("Cache set error:", error);
      return false;
    }
  }

  /**
   * Delete data from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  static async del(key) {
    try {
      // Try Redis first
      if (redis && typeof redis.del === "function") {
        await redis.del(key);
      }

      // Also delete from memory cache
      memoryCache.delete(key);

      return true;
    } catch (error) {
      logger.warn("Cache delete error:", error);
      return false;
    }
  }

  /**
   * Clear all cache
   * @returns {Promise<boolean>} - Success status
   */
  static async clear() {
    try {
      // Try Redis first
      if (redis && typeof redis.flushdb === "function") {
        await redis.flushdb();
      }

      // Clear memory cache
      memoryCache.clear();

      return true;
    } catch (error) {
      logger.warn("Cache clear error:", error);
      return false;
    }
  }

  /**
   * Generate cache key for resources
   * @param {string} resource - Resource type (e.g., 'doctors', 'hospitals')
   * @param {object} params - Parameters to include in key
   * @returns {string} - Generated cache key
   */
  static generateKey(resource, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");

    return paramString ? `${resource}:${paramString}` : resource;
  }

  /**
   * Cache wrapper for database operations
   * @param {string} key - Cache key
   * @param {Function} dbOperation - Database operation function
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<any>} - Data from cache or database
   */
  static async withCache(key, dbOperation, ttl = 300) {
    try {
      // Try to get from cache first
      const cachedData = await this.get(key);
      if (cachedData !== null) {
        logger.debug(`Cache hit for key: ${key}`);
        return cachedData;
      }

      // Execute database operation
      logger.debug(`Cache miss for key: ${key}`);
      const data = await dbOperation();

      // Cache the result
      if (data !== null && data !== undefined) {
        await this.set(key, data, ttl);
      }

      return data;
    } catch (error) {
      logger.error("Cache wrapper error:", error);
      // Fallback to database operation
      return await dbOperation();
    }
  }

  /**
   * Invalidate cache patterns
   * @param {string} pattern - Cache key pattern
   * @returns {Promise<boolean>} - Success status
   */
  static async invalidatePattern(pattern) {
    try {
      // Try Redis first
      if (redis && typeof redis.keys === "function") {
        const keys = await redis.keys(`*${pattern}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }

      // Invalidate memory cache entries matching pattern
      for (const [key] of memoryCache) {
        if (key.includes(pattern)) {
          memoryCache.delete(key);
        }
      }

      return true;
    } catch (error) {
      logger.warn("Cache pattern invalidate error:", error);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Promise<object>} - Cache statistics
   */
  static async getStats() {
    try {
      const memorySize = memoryCache.size;
      let redisConnected = false;

      if (redis && typeof redis.ping === "function") {
        try {
          await redis.ping();
          redisConnected = true;
        } catch (error) {
          redisConnected = false;
        }
      }

      return {
        memoryCache: {
          size: memorySize,
          keys: Array.from(memoryCache.keys()),
        },
        redis: {
          connected: redisConnected,
        },
      };
    } catch (error) {
      logger.error("Cache stats error:", error);
      return {
        memoryCache: { size: 0, keys: [] },
        redis: { connected: false },
      };
    }
  }
}

module.exports = CacheUtil;
