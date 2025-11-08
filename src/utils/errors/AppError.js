'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM ERROR CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class AppError extends Error {
    constructor(message, statusCode = 500, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.timestamp = new Date();
        Error.captureStackTrace(this, this.constructor);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIFIC ERROR TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export class ValidationError extends AppError {
    constructor(message, details = {}) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, 'CONFLICT');
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}

export class ServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'SERVER_ERROR');
    }
}

export class DatabaseError extends AppError {
    constructor(message = 'Database error') {
        super(message, 500, 'DATABASE_ERROR');
    }
}

export class ExternalServiceError extends AppError {
    constructor(service, message = 'External service error') {
        super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
        this.service = service;
    }
}