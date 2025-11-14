'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION - ULTRA-COMPREHENSIVE
// Centralized configuration from .env file
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

class EnvironmentConfig {
    constructor() {
        this.validateEnvironment();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // APPLICATION CORE
    // ─────────────────────────────────────────────────────────────────────────────

    get NODE_ENV() {
        return process.env.NODE_ENV || 'development';
    }

    get PORT() {
        const port = process.env.PORT;
        return port ? parseInt(port, 10) : 5000;
    }

    get APP_NAME() {
        return process.env.APP_NAME || 'Medivoy Backend';
    }

    get APP_VERSION() {
        return process.env.APP_VERSION || '1.0.0';
    }

    get APP_URL() {
        return process.env.APP_URL || 'http://localhost:5000';
    }

    get DEBUG() {
        return process.env.DEBUG === 'true';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DATABASE - POSTGRESQL
    // ─────────────────────────────────────────────────────────────────────────────

    get DATABASE_URL() {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error('DATABASE_URL is not defined in .env file');
        }
        return url;
    }

    get DB_LOGGING() {
        return process.env.DB_LOGGING === 'true';
    }

    get DB_TIMEZONE() {
        return process.env.DB_TIMEZONE || '+05:30';
    }

    get DB_POOL_MAX() {
        const max = process.env.DB_POOL_MAX;
        return max ? parseInt(max, 10) : 10;
    }

    get DB_POOL_MIN() {
        const min = process.env.DB_POOL_MIN;
        return min ? parseInt(min, 10) : 2;
    }

    get DB_POOL_ACQUIRE() {
        const acquire = process.env.DB_POOL_ACQUIRE;
        return acquire ? parseInt(acquire, 10) : 30000;
    }

    get DB_POOL_IDLE() {
        const idle = process.env.DB_POOL_IDLE;
        return idle ? parseInt(idle, 10) : 10000;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CACHE - REDIS
    // ─────────────────────────────────────────────────────────────────────────────

    get REDIS_URL() {
        return process.env.REDIS_URL || null;
    }

    get REDIS_DB() {
        const db = process.env.REDIS_DB;
        return db ? parseInt(db, 10) : 0;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DATABASE - MONGODB (OPTIONAL)
    // ─────────────────────────────────────────────────────────────────────────────

    get MONGODB_URL() {
        return process.env.MONGODB_URL || null;
    }

    get MONGODB_POOL_SIZE() {
        const size = process.env.MONGODB_POOL_SIZE;
        return size ? parseInt(size, 10) : 10;
    }

    get MONGODB_MIN_POOL_SIZE() {
        const size = process.env.MONGODB_MIN_POOL_SIZE;
        return size ? parseInt(size, 10) : 2;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // JWT AUTHENTICATION
    // ─────────────────────────────────────────────────────────────────────────────

    get JWT_SECRET() {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in .env file');
        }
        if (secret.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters long');
        }
        return secret;
    }

    get JWT_EXPIRE() {
        return process.env.JWT_EXPIRE || '7d';
    }

    get JWT_REFRESH_SECRET() {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not defined in .env file');
        }
        if (secret.length < 32) {
            throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
        }
        return secret;
    }

    get JWT_REFRESH_EXPIRE() {
        return process.env.JWT_REFRESH_EXPIRE || '30d';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // ENCRYPTION
    // ─────────────────────────────────────────────────────────────────────────────

    get ENCRYPTION_KEY() {
        const key = process.env.ENCRYPTION_KEY;
        if (!key) {
            throw new Error('ENCRYPTION_KEY is not defined in .env file');
        }
        return key;
    }

    get ENCRYPTION_ALGORITHM() {
        return process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // EMAIL CONFIGURATION - SMTP
    // ─────────────────────────────────────────────────────────────────────────────

    get SMTP_HOST() {
        return process.env.SMTP_HOST || 'smtp.gmail.com';
    }

    get SMTP_PORT() {
        const port = process.env.SMTP_PORT;
        return port ? parseInt(port, 10) : 587;
    }

    get SMTP_USER() {
        return process.env.SMTP_USER || '';
    }

    get SMTP_PASSWORD() {
        return process.env.SMTP_PASSWORD || '';
    }

    get SMTP_FROM_NAME() {
        return process.env.SMTP_FROM_NAME || 'Medivoy';
    }

    get SMTP_FROM_EMAIL() {
        return process.env.SMTP_FROM_EMAIL || 'noreply@medivoy.com';
    }

    get SMTP_SECURE() {
        return process.env.SMTP_SECURE === 'true';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SMS CONFIGURATION
    // ─────────────────────────────────────────────────────────────────────────────

    get SMS_PROVIDER() {
        return process.env.SMS_PROVIDER || 'twilio';
    }

    get TWILIO_ACCOUNT_SID() {
        return process.env.TWILIO_ACCOUNT_SID || '';
    }

    get TWILIO_AUTH_TOKEN() {
        return process.env.TWILIO_AUTH_TOKEN || '';
    }

    get TWILIO_PHONE_NUMBER() {
        return process.env.TWILIO_PHONE_NUMBER || '';
    }

    get NEXMO_API_KEY() {
        return process.env.NEXMO_API_KEY || '';
    }

    get NEXMO_API_SECRET() {
        return process.env.NEXMO_API_SECRET || '';
    }

    get NEXMO_FROM_NUMBER() {
        return process.env.NEXMO_FROM_NUMBER || 'Medivoy';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PAYMENT GATEWAY - STRIPE
    // ─────────────────────────────────────────────────────────────────────────────

    get STRIPE_SECRET_KEY() {
        return process.env.STRIPE_SECRET_KEY || '';
    }

    get STRIPE_PUBLISHABLE_KEY() {
        return process.env.STRIPE_PUBLISHABLE_KEY || '';
    }

    get STRIPE_WEBHOOK_SECRET() {
        return process.env.STRIPE_WEBHOOK_SECRET || '';
    }

    get STRIPE_API_VERSION() {
        return process.env.STRIPE_API_VERSION || '2023-10-16';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PAYMENT GATEWAY - RAZORPAY
    // ─────────────────────────────────────────────────────────────────────────────

    get RAZORPAY_KEY_ID() {
        return process.env.RAZORPAY_KEY_ID || '';
    }

    get RAZORPAY_KEY_SECRET() {
        return process.env.RAZORPAY_KEY_SECRET || '';
    }

    get RAZORPAY_WEBHOOK_SECRET() {
        return process.env.RAZORPAY_WEBHOOK_SECRET || '';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // VIDEO CONFERENCING - JITSI
    // ─────────────────────────────────────────────────────────────────────────────

    get JITSI_SERVER_URL() {
        return process.env.JITSI_SERVER_URL || 'https://meet.jit.si';
    }

    get JITSI_APP_ID() {
        return process.env.JITSI_APP_ID || '';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // FILE STORAGE - AWS S3
    // ─────────────────────────────────────────────────────────────────────────────

    get AWS_REGION() {
        return process.env.AWS_REGION || 'us-east-1';
    }

    get AWS_ACCESS_KEY_ID() {
        return process.env.AWS_ACCESS_KEY_ID || '';
    }

    get AWS_SECRET_ACCESS_KEY() {
        return process.env.AWS_SECRET_ACCESS_KEY || '';
    }

    get AWS_S3_BUCKET() {
        return process.env.AWS_S3_BUCKET || 'medivoy-uploads';
    }

    get AWS_S3_URL() {
        return process.env.AWS_S3_URL || '';
    }

    get AWS_CLOUDFRONT_URL() {
        return process.env.AWS_CLOUDFRONT_URL || '';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LOGGING
    // ─────────────────────────────────────────────────────────────────────────────

    get LOG_LEVEL() {
        return process.env.LOG_LEVEL || 'info';
    }

    get LOG_FORMAT() {
        return process.env.LOG_FORMAT || 'combined';
    }

    get LOG_DIR() {
        return process.env.LOG_DIR || './logs';
    }

    get VERBOSE_LOGGING() {
        return process.env.VERBOSE_LOGGING === 'true';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CORS
    // ─────────────────────────────────────────────────────────────────────────────

    get CORS_ORIGIN() {
        return process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'http://localhost:3000';
    }

    get CORS_CREDENTIALS() {
        return process.env.CORS_CREDENTIALS === 'true';
    }

    get CORS_METHODS() {
        return process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS';
    }

    get CORS_ALLOW_HEADERS() {
        return process.env.CORS_ALLOW_HEADERS || 'Content-Type,Authorization,X-Requested-With';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RATE LIMITING
    // ─────────────────────────────────────────────────────────────────────────────

    get RATE_LIMIT_WINDOW_MS() {
        const window = process.env.RATE_LIMIT_WINDOW_MS;
        return window ? parseInt(window, 10) : 900000;
    }

    get RATE_LIMIT_MAX_REQUESTS() {
        const max = process.env.RATE_LIMIT_MAX_REQUESTS;
        return max ? parseInt(max, 10) : 100;
    }

    get AUTH_RATE_LIMIT_WINDOW_MS() {
        const window = process.env.AUTH_RATE_LIMIT_WINDOW_MS;
        return window ? parseInt(window, 10) : 900000;
    }

    get AUTH_RATE_LIMIT_MAX_REQUESTS() {
        const max = process.env.AUTH_RATE_LIMIT_MAX_REQUESTS;
        return max ? parseInt(max, 10) : 5;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SECURITY
    // ─────────────────────────────────────────────────────────────────────────────

    get HELMET_ENABLED() {
        return process.env.HELMET_ENABLED !== 'false';
    }

    get HELMET_CSP_ENABLED() {
        return process.env.HELMET_CSP_ENABLED === 'true';
    }

    get BCRYPT_ROUNDS() {
        const rounds = process.env.BCRYPT_ROUNDS;
        return rounds ? parseInt(rounds, 10) : 10;
    }

    get PASSWORD_MIN_LENGTH() {
        const length = process.env.PASSWORD_MIN_LENGTH;
        return length ? parseInt(length, 10) : 8;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SESSION & COOKIES
    // ─────────────────────────────────────────────────────────────────────────────

    get SESSION_SECRET() {
        const secret = process.env.SESSION_SECRET;
        if (!secret) {
            throw new Error('SESSION_SECRET is not defined in .env file');
        }
        if (secret.length < 32) {
            throw new Error('SESSION_SECRET must be at least 32 characters long');
        }
        return secret;
    }

    get SESSION_TIMEOUT() {
        const timeout = process.env.SESSION_TIMEOUT;
        return timeout ? parseInt(timeout, 10) : 3600000;
    }

    get COOKIE_SECURE() {
        return process.env.COOKIE_SECURE === 'true';
    }

    get COOKIE_HTTP_ONLY() {
        return process.env.COOKIE_HTTP_ONLY === 'true';
    }

    get COOKIE_SAME_SITE() {
        return process.env.COOKIE_SAME_SITE || 'Strict';
    }

    get COOKIE_DOMAIN() {
        return process.env.COOKIE_DOMAIN || 'localhost';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ─────────────────────────────────────────────────────────────────────────────

    get DEFAULT_PAGE() {
        const page = process.env.DEFAULT_PAGE;
        return page ? parseInt(page, 10) : 1;
    }

    get DEFAULT_LIMIT() {
        const limit = process.env.DEFAULT_LIMIT;
        return limit ? parseInt(limit, 10) : 20;
    }

    get MAX_LIMIT() {
        const max = process.env.MAX_LIMIT;
        return max ? parseInt(max, 10) : 100;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CACHE SETTINGS
    // ─────────────────────────────────────────────────────────────────────────────

    get CACHE_DEFAULT_TTL() {
        const ttl = process.env.CACHE_DEFAULT_TTL;
        return ttl ? parseInt(ttl, 10) : 3600;
    }

    get CACHE_USER_PROFILE_TTL() {
        const ttl = process.env.CACHE_USER_PROFILE_TTL;
        return ttl ? parseInt(ttl, 10) : 86400;
    }

    get CACHE_SETTINGS_TTL() {
        const ttl = process.env.CACHE_SETTINGS_TTL;
        return ttl ? parseInt(ttl, 10) : 86400;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // FILE UPLOAD
    // ─────────────────────────────────────────────────────────────────────────────

    get MAX_FILE_SIZE() {
        const size = process.env.MAX_FILE_SIZE;
        return size ? parseInt(size, 10) : 5242880;
    }

    get MAX_IMAGE_SIZE() {
        const size = process.env.MAX_IMAGE_SIZE;
        return size ? parseInt(size, 10) : 2097152;
    }

    get ALLOWED_IMAGE_TYPES() {
        return process.env.ALLOWED_IMAGE_TYPES || 'jpg,jpeg,png,gif,webp';
    }

    get ALLOWED_DOCUMENT_TYPES() {
        return process.env.ALLOWED_DOCUMENT_TYPES || 'pdf,doc,docx,xls,xlsx';
    }

    get UPLOAD_DIR() {
        return process.env.UPLOAD_DIR || './uploads';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LOCALIZATION
    // ─────────────────────────────────────────────────────────────────────────────

    get DEFAULT_TIMEZONE() {
        return process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata';
    }

    get DEFAULT_LANGUAGE() {
        return process.env.DEFAULT_LANGUAGE || 'en';
    }

    get SUPPORTED_LANGUAGES() {
        return process.env.SUPPORTED_LANGUAGES ? process.env.SUPPORTED_LANGUAGES.split(',') : ['en', 'hi', 'ta', 'te', 'ml', 'kn'];
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // FEATURE FLAGS
    // ─────────────────────────────────────────────────────────────────────────────

    get FEATURE_VIDEO_CALL() {
        return process.env.FEATURE_VIDEO_CALL === 'true';
    }

    get FEATURE_INSURANCE() {
        return process.env.FEATURE_INSURANCE === 'true';
    }

    get FEATURE_PRESCRIPTION() {
        return process.env.FEATURE_PRESCRIPTION === 'true';
    }

    get FEATURE_LAB_TEST() {
        return process.env.FEATURE_LAB_TEST === 'true';
    }

    get FEATURE_ACCOMMODATION() {
        return process.env.FEATURE_ACCOMMODATION === 'true';
    }

    get FEATURE_FLIGHT_BOOKING() {
        return process.env.FEATURE_FLIGHT_BOOKING === 'true';
    }

    get FEATURE_COUPON() {
        return process.env.FEATURE_COUPON === 'true';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RESPONSE COMPRESSION
    // ─────────────────────────────────────────────────────────────────────────────

    get RESPONSE_COMPRESSION() {
        return process.env.RESPONSE_COMPRESSION || 'gzip';
    }

    get RESPONSE_COMPRESSION_LEVEL() {
        const level = process.env.RESPONSE_COMPRESSION_LEVEL;
        return level ? parseInt(level, 10) : 6;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // ADMIN SETTINGS
    // ─────────────────────────────────────────────────────────────────────────────

    get ADMIN_EMAIL() {
        return process.env.ADMIN_EMAIL || 'admin@medivoy.com';
    }

    get ADMIN_PHONE() {
        return process.env.ADMIN_PHONE || '+919876543210';
    }

    get ADMIN_TIMEZONE() {
        return process.env.ADMIN_TIMEZONE || 'Asia/Kolkata';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // HELPER METHODS
    // ─────────────────────────────────────────────────────────────────────────────

    isProduction() {
        return this.NODE_ENV === 'production';
    }

    isDevelopment() {
        return this.NODE_ENV === 'development';
    }

    isTest() {
        return this.NODE_ENV === 'test';
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────────────────────────────────────────

    validateEnvironment() {
        const requiredVariables = [
            'DATABASE_URL',
            'JWT_SECRET',
            'JWT_REFRESH_SECRET',
            'SESSION_SECRET'
        ];

        const missing = [];

        for (let i = 0; i < requiredVariables.length; i++) {
            const variable = requiredVariables[i];
            if (!process.env[variable]) {
                missing.push(variable);
            }
        }

        if (missing.length > 0) {
            console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
            if (this.isProduction()) {
                process.exit(1);
            }
        }

        console.log(`✅ Environment validation passed`);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET ALL CONFIG
    // ─────────────────────────────────────────────────────────────────────────────

    getAllConfig() {
        return {
            app: {
                NODE_ENV: this.NODE_ENV,
                PORT: this.PORT,
                APP_NAME: this.APP_NAME,
                APP_VERSION: this.APP_VERSION,
                APP_URL: this.APP_URL,
                DEBUG: this.DEBUG
            },
            database: {
                DATABASE_URL: this.DATABASE_URL,
                MONGODB_URL: this.MONGODB_URL,
                REDIS_URL: this.REDIS_URL
            },
            jwt: {
                JWT_SECRET: '***',
                JWT_EXPIRE: this.JWT_EXPIRE,
                JWT_REFRESH_SECRET: '***',
                JWT_REFRESH_EXPIRE: this.JWT_REFRESH_EXPIRE
            },
            features: {
                FEATURE_VIDEO_CALL: this.FEATURE_VIDEO_CALL,
                FEATURE_INSURANCE: this.FEATURE_INSURANCE,
                FEATURE_PRESCRIPTION: this.FEATURE_PRESCRIPTION,
                FEATURE_LAB_TEST: this.FEATURE_LAB_TEST
            }
        };
    }
}

export const environment = new EnvironmentConfig();

export default environment;