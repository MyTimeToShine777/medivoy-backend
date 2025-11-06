// Rate Limiting Middleware - NO optional chaining
import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

const limiter = rateLimit({
    windowMs: config.security.rateLimitWindow || 15 * 60 * 1000,
    max: config.security.rateLimitMax || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => {
        return process.env.NODE_ENV === 'development';
    },
});

export default limiter;