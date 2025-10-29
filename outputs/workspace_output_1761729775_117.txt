const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');
const config = require('../config');
const { errorResponse } = require('../utils/response');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:'
  }),
  handler: (req, res) => {
    return errorResponse(
      res,
      429,
      'Too many requests, please try again later'
    );
  },
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health';
  }
});

/**
 * Strict rate limiter for authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  handler: (req, res) => {
    return errorResponse(
      res,
      429,
      'Too many authentication attempts, please try again after 15 minutes'
    );
  }
});

/**
 * Rate limiter for file uploads
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:upload:'
  }),
  handler: (req, res) => {
    return errorResponse(
      res,
      429,
      'Upload limit exceeded, please try again later'
    );
  }
});

/**
 * Rate limiter for password reset
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:password:'
  }),
  handler: (req, res) => {
    return errorResponse(
      res,
      429,
      'Too many password reset attempts, please try again after 1 hour'
    );
  }
});

/**
 * Rate limiter for email verification
 */
const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:email:'
  }),
  handler: (req, res) => {
    return errorResponse(
      res,
      429,
      'Too many verification emails sent, please try again after 1 hour'
    );
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  passwordResetLimiter,
  emailVerificationLimiter
};