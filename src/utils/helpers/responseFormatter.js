'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE FORMATTER - STANDARDIZED API RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

export class ResponseFormatter {
    static success(data = null, message = 'Success', statusCode = 200) {
        return {
            success: true,
            statusCode: statusCode,
            message: message,
            data: data,
            timestamp: new Date().toISOString()
        };
    }

    static error(error, statusCode = 500, code = null) {
        return {
            success: false,
            statusCode: statusCode,
            error: error,
            code: code,
            timestamp: new Date().toISOString()
        };
    }

    static paginated(data, total, page, limit, message = 'Success') {
        return {
            success: true,
            message: message,
            data: data,
            pagination: {
                total: total,
                page: page,
                limit: limit,
                pages: Math.ceil(total / limit)
            },
            timestamp: new Date().toISOString()
        };
    }

    static created(data, message = 'Resource created') {
        return this.success(data, message, 201);
    }

    static notFound(resource = 'Resource') {
        return this.error(`${resource} not found`, 404, 'NOT_FOUND');
    }

    static unauthorized(message = 'Unauthorized') {
        return this.error(message, 401, 'UNAUTHORIZED');
    }

    static forbidden(message = 'Forbidden') {
        return this.error(message, 403, 'FORBIDDEN');
    }

    static validation(errors) {
        return {
            success: false,
            statusCode: 400,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors,
            timestamp: new Date().toISOString()
        };
    }

    static bulkOperation(successful, failed, message = 'Bulk operation completed') {
        return {
            success: failed.length === 0,
            message: message,
            summary: {
                total: successful.length + failed.length,
                successful: successful.length,
                failed: failed.length
            },
            successful: successful,
            failed: failed,
            timestamp: new Date().toISOString()
        };
    }
}

export default ResponseFormatter;