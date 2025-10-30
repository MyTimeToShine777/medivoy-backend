const redis = require("../config/redis");
const logger = require("../utils/logger");

/**
 * Cache middleware - Cache responses in Redis
 * @param {Number} ttl - Time to live in seconds
 */
const cache =
  (ttl = 300) =>
  async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      // Check if cached data exists
      const cachedData = await redis.get(key);

      if (cachedData) {
        logger.debug(`Cache hit: ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        redis
          .setex(key, ttl, JSON.stringify(data))
          .catch((err) => logger.error("Cache set error:", err));

        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error("Cache middleware error:", error);
      next();
    }
  };

/**
 * Clear cache by pattern
 * @param {String} pattern - Redis key pattern
 */
const clearCache = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Cleared ${keys.length} cache keys matching: ${pattern}`);
    }
  } catch (error) {
    logger.error("Clear cache error:", error);
  }
};

module.exports = {
  cache,
  clearCache,
};
