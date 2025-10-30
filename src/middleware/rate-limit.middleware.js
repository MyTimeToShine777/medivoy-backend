const rateLimit = require("express-rate-limit");
const config = require("../config");
const { errorResponse } = require("../utils/response");

// Try to use Redis store if available, otherwise use memory store
let RedisStore;
let redis;
let useRedis = false;

try {
  RedisStore = require("rate-limit-redis");
  redis = require("../config/redis");
  // Check if redis is a mock client
  if (redis && typeof redis.ping === "function") {
    useRedis = true;
  }
} catch (error) {
  console.warn("⚠️  rate-limit-redis not available, using memory store");
  useRedis = false;
}

/**
 * Create rate limiter configuration
 */
function createLimiterConfig(options) {
  const baseConfig = {
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>
      errorResponse(
        res,
        429,
        options.message || "Too many requests, please try again later",
      ),
    skip: options.skip || (() => false),
  };

  // Add Redis store if available
  if (useRedis && RedisStore) {
    try {
      baseConfig.store = new RedisStore({
        client: redis,
        prefix: options.prefix || "rl:",
      });
    } catch (error) {
      console.warn("⚠️  Could not create Redis store, using memory store");
    }
  }

  return baseConfig;
}

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit(
  createLimiterConfig({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    prefix: "rl:api:",
    message: "Too many requests, please try again later",
    skip: (req) =>
      // Skip rate limiting for health check
      req.path === "/health",
  }),
);

/**
 * Strict rate limiter for authentication endpoints
 */
const authLimiter = rateLimit(
  createLimiterConfig({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    prefix: "rl:auth:",
    message:
      "Too many authentication attempts, please try again after 15 minutes",
  }),
);

/**
 * Rate limiter for file uploads
 */
const uploadLimiter = rateLimit(
  createLimiterConfig({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    prefix: "rl:upload:",
    message: "Upload limit exceeded, please try again later",
  }),
);

/**
 * Rate limiter for password reset
 */
const passwordResetLimiter = rateLimit(
  createLimiterConfig({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per hour
    prefix: "rl:password:",
    message: "Too many password reset attempts, please try again after 1 hour",
  }),
);

/**
 * Rate limiter for email verification
 */
const emailVerificationLimiter = rateLimit(
  createLimiterConfig({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per hour
    prefix: "rl:email:",
    message: "Too many verification emails sent, please try again after 1 hour",
  }),
);

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
};
