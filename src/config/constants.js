'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP STATUS CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    RATE_LIMIT: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    SERVER_ERROR: 'SERVER_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED'
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER ROLES
// ═══════════════════════════════════════════════════════════════════════════════

export const USER_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    DOCTOR: 'DOCTOR',
    PATIENT: 'PATIENT',
    STAFF: 'STAFF'
};

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING STATUS
// ═══════════════════════════════════════════════════════════════════════════════

export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    ON_HOLD: 'on_hold'
};

// ═══════════════════════════════════════════════════════════════════════════════
// APPOINTMENT STATUS
// ═══════════════════════════════════════════════════════════════════════════════

export const APPOINTMENT_STATUS = {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT STATUS
// ═══════════════════════════════════════════════════════════════════════════════

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRESCRIPTION STATUS
// ═══════════════════════════════════════════════════════════════════════════════

export const PRESCRIPTION_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    REVIEW_NEEDED: 'review_needed',
    APPROVED: 'approved',
    REVOKED: 'revoked'
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORT TICKET STATUS
// ═══════════════════════════════════════════════════════════════════════════════

export const TICKET_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    ON_HOLD: 'on_hold',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORTED LANGUAGES
// ═══════════════════════════════════════════════════════════════════════════════

export const LANGUAGES = {
    EN: 'en',
    AR: 'ar',
    HI: 'hi',
    ES: 'es',
    FR: 'fr',
    DE: 'de',
    PT: 'pt'
};

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const CACHE_KEYS = {
    TRANSLATIONS: 'translations',
    HOSPITALS: 'hospitals',
    DOCTORS: 'doctors',
    TREATMENTS: 'treatments',
    PACKAGES: 'packages',
    SPECIALIZATIONS: 'specializations',
    FAQ: 'faq'
};

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE EXPIRY (in seconds)
// ═══════════════════════════════════════════════════════════════════════════════

export const CACHE_EXPIRY = {
    FIVE_MINUTES: 300,
    FIFTEEN_MINUTES: 900,
    ONE_HOUR: 3600,
    FOUR_HOURS: 14400,
    ONE_DAY: 86400,
    ONE_WEEK: 604800
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGEX PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s-]{10,}$/,
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// ═══════════════════════════════════════════════════════════════════════════════
// FILE UPLOAD
// ═══════════════════════════════════════════════════════════════════════════════

export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_MIME_TYPES: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    UPLOAD_DIR: './uploads'
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════════════════════════════════

export const PAGINATION = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0
};

// ═══════════════════════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════════

export const RATE_LIMIT = {
    GLOBAL: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100
    },
    AUTH: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 5 // 5 login attempts
    },
    API: {
        WINDOW_MS: 1 * 60 * 1000, // 1 minute
        MAX_REQUESTS: 30
    }
};

export default {
    HTTP_STATUS,
    ERROR_CODES,
    USER_ROLES,
    BOOKING_STATUS,
    APPOINTMENT_STATUS,
    PAYMENT_STATUS,
    PRESCRIPTION_STATUS,
    TICKET_STATUS,
    LANGUAGES,
    CACHE_KEYS,
    CACHE_EXPIRY,
    REGEX_PATTERNS,
    UPLOAD_CONFIG,
    PAGINATION,
    RATE_LIMIT
};