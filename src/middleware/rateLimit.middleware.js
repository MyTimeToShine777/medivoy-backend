/**
 * Rate Limiting Middleware
 * Provides configurable rate limiting for API endpoints
 */

const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Route: ${req.path}`);
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutes",
    });
  },
});

// Strict rate limiter for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
    code: "STRICT_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `Strict rate limit exceeded for IP: ${req.ip}, Route: ${req.path}`,
    );
    res.status(429).json({
      success: false,
      message: "Too many attempts, please try again later.",
      code: "STRICT_RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutes",
    });
  },
});

// Authentication rate limiter (login, register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `Auth rate limit exceeded for IP: ${req.ip}, Route: ${req.path}`,
    );
    res.status(429).json({
      success: false,
      message: "Too many authentication attempts, please try again later.",
      code: "AUTH_RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutes",
    });
  },
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: "Too many password reset attempts, please try again later.",
    code: "PASSWORD_RESET_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `Password reset rate limit exceeded for IP: ${req.ip}, Route: ${req.path}`,
    );
    res.status(429).json({
      success: false,
      message: "Too many password reset attempts, please try again later.",
      code: "PASSWORD_RESET_RATE_LIMIT_EXCEEDED",
      retryAfter: "1 hour",
    });
  },
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 upload requests per windowMs
  message: {
    success: false,
    message: "Too many file uploads, please try again later.",
    code: "UPLOAD_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `Upload rate limit exceeded for IP: ${req.ip}, Route: ${req.path}`,
    );
    res.status(429).json({
      success: false,
      message: "Too many file uploads, please try again later.",
      code: "UPLOAD_RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutes",
    });
  },
});

// Search rate limiter (for public endpoints)
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: {
    success: false,
    message: "Too many search requests, please try again later.",
    code: "SEARCH_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `Search rate limit exceeded for IP: ${req.ip}, Route: ${req.path}`,
    );
    res.status(429).json({
      success: false,
      message: "Too many search requests, please try again later.",
      code: "SEARCH_RATE_LIMIT_EXCEEDED",
      retryAfter: "1 minute",
    });
  },
});

module.exports = {
  generalLimiter,
  strictLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  searchLimiter,
};
