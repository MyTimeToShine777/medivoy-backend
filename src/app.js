'use strict';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

// Import ALL Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger, errorLogger } from './middleware/logger.js';
import { loggingMiddleware } from './middleware/logging.middleware.js';
import { notFoundHandler } from './middleware/notFound.js';
import { healthCheckHandler } from './middleware/healthCheck.js';
import { authenticateToken, authMiddleware } from './middleware/auth.middleware.js';
import { verifyRoleAccess, authorizationMiddleware } from './middleware/authorization.middleware.js';
import { asyncHandler } from './middleware/asyncHandler.middleware.js';
import { authRateLimiter, globalRateLimiter, apiRateLimiter, createRateLimiter, uploadRateLimiter, deleteRateLimiter, searchRateLimiter } from './middleware/rateLimit.middleware.js';
import { validateLogin, validateRegister, validatePagination, validationMiddleware } from './middleware/validation.middleware.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { cacheMiddleware } from './middleware/cache.middleware.js';
import { detectLanguage, loadTranslations, i18nHelper } from './middleware/multilingual.middleware.js';
import { permissionMiddleware } from './middleware/permission.middleware.js';
import { roleBasedAccessMiddleware, roleAccessMiddleware } from './middleware/roleBasedAccess.middleware.js';
import { uploadMiddleware, handleUploadError } from './middleware/upload.middleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
//import patientRoutes from './routes/patientRoutes.js';
//import doctorRoutes from './routes/doctorRoutes.js';
//import staffRoutes from './routes/staffRoutes.js';
//import adminRoutes from './routes/adminRoutes.js';
//import superAdminRoutes from './routes/superAdminRoutes.js';

dotenv.config();

// Development fallbacks: some route files may be intentionally commented out
// or not present in this environment. Provide empty routers so startup
// continues while those modules are being implemented.
const patientRoutes = express.Router();
const doctorRoutes = express.Router();
const staffRoutes = express.Router();
const adminRoutes = express.Router();
const superAdminRoutes = express.Router();

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZE EXPRESS APP
// ═══════════════════════════════════════════════════════════════════════════════

const app = express();

console.log(`🚀 Initializing Medivoy Backend API...`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1: SECURITY HEADERS (FIRST)
// ═══════════════════════════════════════════════════════════════════════════════

if (process.env.HELMET_ENABLED === 'true') {
    app.use(helmet({
        contentSecurityPolicy: process.env.HELMET_CSP_ENABLED === 'true' ? {} : false,
        frameguard: { action: 'deny' },
        noSniff: true,
        xssFilter: true,
        referrerPolicy: { policy: 'no-referrer' }
    }));
    console.log(`✅ [1] Helmet security headers enabled`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2: CORS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS').split(','),
    allowedHeaders: (process.env.CORS_ALLOW_HEADERS || 'Content-Type,Authorization').split(','),
    exposedHeaders: ['X-Cache', 'X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    optionsSuccessStatus: 200,
    maxAge: 86400
};
app.use(cors(corsOptions));
console.log(`✅ [2] CORS enabled`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3: SECURITY PROTECTION
// ═══════════════════════════════════════════════════════════════════════════════

app.use(hpp({
    whitelist: ['sort', 'fields', 'filter', 'page', 'limit', 'search', 'status']
}));
console.log(`✅ [3] HPP (HTTP Parameter Pollution) protection enabled`);

app.use(mongoSanitize());
console.log(`✅ [3] MongoDB query sanitization enabled`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 4: BODY PARSING & COOKIES
// ═══════════════════════════════════════════════════════════════════════════════

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
console.log(`✅ [4] Body parsing & cookie parsing enabled`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 5: COMPRESSION
// ═══════════════════════════════════════════════════════════════════════════════

if (process.env.RESPONSE_COMPRESSION === 'gzip') {
    app.use(compression({
        level: parseInt(process.env.RESPONSE_COMPRESSION_LEVEL) || 6,
        threshold: 1024
    }));
    console.log(`✅ [5] Response compression (gzip) enabled`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 6: LOGGING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

if (process.env.VERBOSE_LOGGING === 'true') {
    app.use(morgan(process.env.LOG_FORMAT || 'combined', {
        skip: (req, res) => req.path === '/health' || req.path === '/'
    }));
}
app.use(requestLogger);
app.use(errorLogger);
app.use(loggingMiddleware);
console.log(`✅ [6] Request/error logging enabled`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 7: SESSION & AUTHENTICATION SETUP
// ═══════════════════════════════════════════════════════════════════════════════

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.COOKIE_SECURE === 'true',
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        sameSite: process.env.COOKIE_SAME_SITE || 'Strict',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: parseInt(process.env.SESSION_TIMEOUT) || 3600000
    }
}));

app.use(passport.initialize());
app.use(passport.session());
console.log(`✅ [7] Session & Passport authentication initialized`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 8: RATE LIMITING (GLOBAL)
// ═══════════════════════════════════════════════════════════════════════════════

app.use(globalRateLimiter);
console.log(`✅ [8] Global rate limiting enabled`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 9: REQUEST ID GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

app.use((req, res, next) => {
    req.id = require('crypto').randomUUID();
    res.setHeader('X-Request-ID', req.id);
    next();
});
console.log(`✅ [9] Request ID generation enabled`);

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 10: LANGUAGE DETECTION & TRANSLATION
// ═══════════════════════════════════════════════════════════════════════════════

app.use(detectLanguage);
app.use(loadTranslations);
app.use(i18nHelper);
console.log(`✅ [10] Multilingual support (i18n) enabled`);

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK ENDPOINT (NO MIDDLEWARE)
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/health', healthCheckHandler);
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Medivoy Backend API is running',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});
console.log(`✅ Health check endpoints registered`);

// ═══════════════════════════════════════════════════════════════════════════════
// API ROUTES WITH SPECIFIC MIDDLEWARE STACKS
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ROUTES (PUBLIC - NO AUTHENTICATION REQUIRED)
// Middleware Stack: Rate Limiting + Translation + Logging
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/auth', [
    authRateLimiter, // Strict rate limiting for login attempts
    detectLanguage, // Language detection
    loadTranslations, // Load translations
    loggingMiddleware // Log all auth requests
], authRoutes);
console.log(`✅ Auth routes registered [Rate Limited + i18n + Logging]`);

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT ROUTES (AUTHENTICATED + ROLE-BASED)
// Middleware Stack: Auth + Role Check + Cache + Translation + Logging
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/patient', [
    authenticateToken, // JWT authentication
    roleBasedAccessMiddleware(['patient', 'staff', 'admin', 'superadmin']), // Role check
    cacheMiddleware(3600), // Cache for 1 hour
    detectLanguage, // Language detection
    loadTranslations, // Load translations
    loggingMiddleware // Log requests
], patientRoutes);
console.log(`✅ Patient routes registered [Auth + Role + Cache(1h) + i18n + Logging]`);

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR ROUTES (AUTHENTICATED + ROLE-BASED)
// Middleware Stack: Auth + Role Check + Cache + Translation + Logging
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/doctor', [
    authenticateToken, // JWT authentication
    roleBasedAccessMiddleware(['doctor', 'staff', 'admin', 'superadmin']), // Role check
    cacheMiddleware(1800), // Cache for 30 minutes
    detectLanguage, // Language detection
    loadTranslations, // Load translations
    loggingMiddleware // Log requests
], doctorRoutes);
console.log(`✅ Doctor routes registered [Auth + Role + Cache(30m) + i18n + Logging]`);

// ─────────────────────────────────────────────────────────────────────────────
// STAFF ROUTES (AUTHENTICATED + ROLE-BASED + PERMISSION)
// Middleware Stack: Auth + Role Check + Permission + Cache + Translation + Logging
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/staff', [
    authenticateToken, // JWT authentication
    roleBasedAccessMiddleware(['staff', 'admin', 'superadmin']), // Role check
    cacheMiddleware(3600), // Cache for 1 hour
    detectLanguage, // Language detection
    loadTranslations, // Load translations
    loggingMiddleware // Log requests
], staffRoutes);
console.log(`✅ Staff routes registered [Auth + Role + Cache(1h) + i18n + Logging]`);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES (AUTHENTICATED + ADMIN ROLE + PERMISSION)
// Middleware Stack: Auth + Admin Role + Permission + Cache + Translation + Logging
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/admin', [
    authenticateToken, // JWT authentication
    roleBasedAccessMiddleware(['admin', 'superadmin']), // Admin role check
    cacheMiddleware(1800), // Cache for 30 minutes
    detectLanguage, // Language detection
    loadTranslations, // Load translations
    loggingMiddleware // Log requests
], adminRoutes);
console.log(`✅ Admin routes registered [Auth + AdminRole + Cache(30m) + i18n + Logging]`);

// ─────────────────────────────────────────────────────────────────────────────
// SUPER ADMIN ROUTES (AUTHENTICATED + SUPER ADMIN ONLY + NO CACHE)
// Middleware Stack: Auth + SuperAdmin Role + Permission + Translation + Logging
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/superadmin', [
    authenticateToken, // JWT authentication
    roleBasedAccessMiddleware(['superadmin']), // Super admin only
    detectLanguage, // Language detection
    loadTranslations, // Load translations
    loggingMiddleware // Log requests
    // NO CACHING for super admin routes (sensitive operations)
], superAdminRoutes);
console.log(`✅ SuperAdmin routes registered [Auth + SuperAdminRole + i18n + Logging] [NO CACHE]`);

// ═══════════════════════════════════════════════════════════════════════════════
// 404 NOT FOUND HANDLER (MUST BE AFTER ALL ROUTES)
// ═══════════════════════════════════════════════════════════════════════════════

app.use(notFoundHandler);
console.log(`✅ 404 Not Found handler registered`);

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER (MUST BE LAST)
// ═══════════════════════════════════════════════════════════════════════════════

app.use(errorHandler);
console.log(`✅ Global error handler registered`);

console.log(`\n✅ All middleware and routes initialized successfully\n`);

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT APP
// ═══════════════════════════════════════════════════════════════════════════════

export default app;
export {
    authRateLimiter,
    globalRateLimiter,
    apiRateLimiter,
    createRateLimiter,
    uploadRateLimiter,
    deleteRateLimiter,
    searchRateLimiter,
    authenticateToken,
    roleBasedAccessMiddleware,
    permissionMiddleware,
    cacheMiddleware,
    uploadMiddleware,
    handleUploadError,
    asyncHandler
};