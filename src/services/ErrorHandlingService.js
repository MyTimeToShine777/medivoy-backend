'use strict';

/**
 * ErrorHandlingService - Centralized error handling
 * Production-ready error management and logging
 */
class ErrorHandlingService {
    /**
     * Handle and format error
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     * @returns {Object} Formatted error info
     */
    handleError(error, context = '') {
        const errorInfo = {
            message: error.message || 'Unknown error occurred',
            code: error.code || 'INTERNAL_ERROR',
            context: context,
            timestamp: new Date().toISOString(),
            statusCode: error.statusCode || 500
        };

        if (process.env.NODE_ENV !== 'production' && error.stack) {
            errorInfo.stack = error.stack;
        }

        console.error(`[${context}] Error:`, errorInfo);
        
        return errorInfo;
    }

    /**
     * Create custom error
     * @param {string} message - Error message
     * @param {string} code - Error code
     * @param {number} statusCode - HTTP status code
     * @returns {Error} Custom error object
     */
    createError(message, code = 'ERROR', statusCode = 500) {
        const error = new Error(message);
        error.code = code;
        error.statusCode = statusCode;
        return error;
    }

    /**
     * Check if error is validation error
     * @param {Error} error - Error to check
     * @returns {boolean}
     */
    isValidationError(error) {
        return (
            error.code === 'VALIDATION_ERROR' ||
            error.message?.toLowerCase().includes('validation') ||
            error.statusCode === 400
        );
    }

    /**
     * Check if error is database error
     * @param {Error} error - Error to check
     * @returns {boolean}
     */
    isDatabaseError(error) {
        return (
            error.code?.startsWith('P') || // Prisma error codes
            error.message?.includes('Prisma') ||
            error.message?.toLowerCase().includes('database')
        );
    }

    /**
     * Check if error is authentication error
     * @param {Error} error - Error to check
     * @returns {boolean}
     */
    isAuthError(error) {
        return (
            error.code === 'UNAUTHORIZED' ||
            error.statusCode === 401 ||
            error.message?.toLowerCase().includes('unauthorized')
        );
    }

    /**
     * Format error response for API
     * @param {Error} error - Error object
     * @returns {Object} API error response
     */
    formatErrorResponse(error) {
        return {
            success: false,
            error: error.message || 'An error occurred',
            code: error.code || 'ERROR',
            statusCode: error.statusCode || 500,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Log error with severity level
     * @param {Error} error - Error to log
     * @param {string} severity - Severity level (info, warn, error, fatal)
     * @param {Object} metadata - Additional metadata
     */
    logError(error, severity = 'error', metadata = {}) {
        const logEntry = {
            severity,
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString(),
            ...metadata
        };

        if (process.env.NODE_ENV !== 'production' && error.stack) {
            logEntry.stack = error.stack;
        }

        switch (severity) {
            case 'fatal':
            case 'error':
                console.error(logEntry);
                break;
            case 'warn':
                console.warn(logEntry);
                break;
            default:
                console.info(logEntry);
        }
    }
}

export default new ErrorHandlingService();
