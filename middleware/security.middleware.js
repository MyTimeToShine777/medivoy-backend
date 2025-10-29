/**
 * Security Headers Middleware
 * Adds security headers to all responses
 */

const helmet = require('helmet');
const logger = require('../utils/logger');

// Custom security configuration
const securityMiddleware = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // X-Frame-Options
  frameguard: {
    action: 'deny',
  },

  // X-Content-Type-Options
  noSniff: true,

  // Referrer Policy
  referrerPolicy: {
    policy: ['no-referrer', 'strict-origin-when-cross-origin'],
  },

  // X-DNS-Prefetch-Control
  dnsPrefetchControl: {
    allow: false,
  },

  // X-Download-Options
  downloadOptions: {
    noOpen: true,
  },

  // X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: false,

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // IE compatibility
  ieNoOpen: true,

  // Disable client-side caching
  noCache: process.env.NODE_ENV === 'production',
});

// CORS configuration
const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://medivoy.com',
    'https://www.medivoy.com',
    'https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works',
  ];

  const { origin } = req.headers;

  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
};

// API security middleware
const apiSecurityMiddleware = (req, res, next) => {
  // Add API-specific security headers
  res.header('X-API-Version', '1.0.0');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Remove server information
  res.removeHeader('Server');

  // Log suspicious requests
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-originating-ip',
  ];

  const hasSuspiciousHeaders = suspiciousHeaders.some((header) => req.headers[header]);
  if (hasSuspiciousHeaders) {
    logger.warn('Suspicious request detected:', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      headers: req.headers,
      path: req.path,
    });
  }

  next();
};

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
      code: 'REQUEST_TOO_LARGE',
      maxSize: '10MB',
    });
  }

  next();
};

// IP whitelist middleware (optional)
const ipWhitelistMiddleware = (whitelistedIPs = []) => (req, res, next) => {
  if (whitelistedIPs.length === 0) {
    return next(); // No whitelist configured
  }

  const clientIP = req.ip || req.connection.remoteAddress;

  if (whitelistedIPs.includes(clientIP)) {
    return next();
  }

  logger.warn(`Unauthorized IP access attempt: ${clientIP}`);

  return res.status(403).json({
    success: false,
    message: 'Access denied from this IP address',
    code: 'IP_NOT_ALLOWED',
  });
};

module.exports = {
  securityMiddleware,
  corsMiddleware,
  apiSecurityMiddleware,
  requestSizeLimiter,
  ipWhitelistMiddleware,
};
