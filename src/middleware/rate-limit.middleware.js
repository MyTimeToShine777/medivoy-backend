/**
 * Rate Limiting Middleware - CORRECTED & PRETTIER-COMPATIBLE
 * Implements professional-grade rate limiting with Redis backend
 * Follows OWASP recommendations and production best practices
 * Status: PRODUCTION-READY | PRETTIER-FORMATTED
 */

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');
const logger = require('../utils/logger');

// Helper: only instantiate RedisStore when the provided redis client
// implements a compatible command interface. Some redis clients or
// wrappers do not expose the expected `.sendCommand` method and the
// rate-limit-redis constructor will throw synchronously. In that
// case return undefined to let express-rate-limit use its default
// in-memory store (safe fallback for development).
const getStore = (prefix) => {
    try {
        if (!RedisStore) return undefined;
        // ioredis and node-redis have slightly different APIs. Check for
        // either sendCommand (node-redis v4) or call (ioredis) as a
        // heuristic for compatibility.
        const client = redis;
        const hasSendCommand = client && typeof client.sendCommand === 'function';
        const hasCall = client && typeof client.call === 'function';
        if (!hasSendCommand && !hasCall) {
            logger.warn(
                'Redis client does not expose sendCommand/call — skipping RedisStore for rate limiter'
            );
            return undefined;
        }

        return new RedisStore({ client, prefix });
    } catch (err) {
        logger.warn(
            'Failed to create RedisStore for rate limiter — falling back to MemoryStore',
            (err && err.message) || err
        );
        return undefined;
    }
};

// Avoid optional chaining inline so formatters won't accidentally
// inject whitespace (some formatter/plugin combinations have
// produced `req.user ? .id` which is a syntax error). Use a small
// helper to obtain a stable user id value.
const getUserId = (req) => {
    if (!req) return undefined;
    if (req.user && typeof req.user === 'object') return req.user.id;
    return undefined;
};

/**
 * Global API Rate Limiter
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
    store: getStore('rate-limit:api:'),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return req.path === '/health';
    },
    handler: (req, res) => {
        logger.warn('API rate limit exceeded', {
            ip: req.ip,
            path: req.path,
            method: req.method,
        });
        res.status(429).json({
            success: false,
            error: 'Too many requests. Please try again later.',
        });
    },
});

/**
 * Strict Auth Rate Limiter
 * 5 attempts per 15 minutes per IP (for login/register)
 */
const authLimiter = rateLimit({
    store: getStore('rate-limit:auth:'),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        error: 'Too many login attempts, please try again later.',
    },
    handler: (req, res) => {
        logger.warn('Auth rate limit exceeded', {
            ip: req.ip,
            email: req.body.email,
        });
        res.status(429).json({
            success: false,
            error: 'Too many login attempts. Please try again in 15 minutes.',
        });
    },
});

/**
 * Booking Rate Limiter
 * 10 bookings per hour per user
 */
const bookingLimiter = rateLimit({
    store: getStore('rate-limit:booking:'),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    keyGenerator: (req) => {
        return getUserId(req) || req.ip;
    },
    message: {
        success: false,
        error: 'Too many bookings. Maximum 10 bookings per hour.',
    },
    handler: (req, res) => {
        const userId = getUserId(req);
        logger.warn('Booking rate limit exceeded', {
            userId,
            ip: req.ip,
        });
        res.status(429).json({
            success: false,
            error: 'Too many booking requests. Please try again in 1 hour.',
        });
    },
});

/**
 * Payment Rate Limiter
 * 3 payment attempts per 10 minutes per user
 */
const paymentLimiter = rateLimit({
    store: getStore('rate-limit:payment:'),
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3,
    keyGenerator: (req) => {
        return getUserId(req) || req.ip;
    },
    message: {
        success: false,
        error: 'Too many payment attempts. Please try again later.',
    },
    handler: (req, res) => {
        const userId = getUserId(req);
        logger.warn('Payment rate limit exceeded', {
            userId,
            amount: req.body.amount,
        });
        res.status(429).json({
            success: false,
            error: 'Too many payment attempts. Please try again in 10 minutes.',
        });
    },
});

/**
 * Upload Rate Limiter
 * 5 uploads per hour per user
 */
const uploadLimiter = rateLimit({
    store: getStore('rate-limit:upload:'),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    keyGenerator: (req) => {
        return getUserId(req) || req.ip;
    },
    message: {
        success: false,
        error: 'Too many uploads. Maximum 5 uploads per hour.',
    },
    handler: (req, res) => {
        const userId = getUserId(req);
        logger.warn('Upload rate limit exceeded', {
            userId,
        });
        res.status(429).json({
            success: false,
            error: 'Too many uploads. Please try again in 1 hour.',
        });
    },
});

/**
 * Search Rate Limiter
 * 30 searches per minute
 */
const searchLimiter = rateLimit({
    store: getStore('rate-limit:search:'),
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    keyGenerator: (req) => {
        return getUserId(req) || req.ip;
    },
    message: {
        success: false,
        error: 'Too many searches. Please slow down.',
    },
    handler: (req, res) => {
        const userId = getUserId(req);
        logger.warn('Search rate limit exceeded', {
            userId,
        });
        res.status(429).json({
            success: false,
            error: 'Too many searches. Please try again in 1 minute.',
        });
    },
});

/**
 * Medical Record Access Rate Limiter
 * 20 accesses per hour per user
 */
const medicalRecordLimiter = rateLimit({
    store: getStore('rate-limit:medical-record:'),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    keyGenerator: (req) => {
        return getUserId(req);
    },
    message: {
        success: false,
        error: 'Too many medical record accesses.',
    },
    handler: (req, res) => {
        const userId = getUserId(req);
        logger.warn('Medical record rate limit exceeded', {
            userId,
        });
        res.status(429).json({
            success: false,
            error: 'Too many accesses. Please try again later.',
        });
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    bookingLimiter,
    paymentLimiter,
    uploadLimiter,
    searchLimiter,
    medicalRecordLimiter,
};