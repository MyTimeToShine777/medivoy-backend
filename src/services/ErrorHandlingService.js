// Error Handling Service - Custom error handling
// NO optional chaining - Production Ready

class ErrorHandlingService {
    // ========== ERROR TYPES ==========
    static ERROR_TYPES = {
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        NOT_FOUND: 'NOT_FOUND',
        UNAUTHORIZED: 'UNAUTHORIZED',
        FORBIDDEN: 'FORBIDDEN',
        CONFLICT: 'CONFLICT',
        SERVER_ERROR: 'SERVER_ERROR',
        BAD_REQUEST: 'BAD_REQUEST',
        DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
        INVALID_INPUT: 'INVALID_INPUT',
        RESOURCE_NOT_AVAILABLE: 'RESOURCE_NOT_AVAILABLE',
    };

    // ========== CREATE ERROR RESPONSE ==========
    createErrorResponse(type, message, details = null, statusCode = 400) {
        return {
            success: false,
            error: {
                type,
                message,
                details,
                timestamp: new Date(),
            },
            statusCode,
        };
    }

    // ========== VALIDATION ERROR ==========
    validationError(message, errors = []) {
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.VALIDATION_ERROR,
            message, { errors },
            400
        );
    }

    // ========== NOT FOUND ERROR ==========
    notFoundError(resource) {
        const message = `${resource} not found`;
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.NOT_FOUND,
            message,
            null,
            404
        );
    }

    // ========== UNAUTHORIZED ERROR ==========
    unauthorizedError(message = 'Unauthorized access') {
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.UNAUTHORIZED,
            message,
            null,
            401
        );
    }

    // ========== FORBIDDEN ERROR ==========
    forbiddenError(message = 'Access forbidden') {
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.FORBIDDEN,
            message,
            null,
            403
        );
    }

    // ========== CONFLICT ERROR ==========
    conflictError(message, existingResource = null) {
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.CONFLICT,
            message, { existingResource },
            409
        );
    }

    // ========== DUPLICATE ENTRY ERROR ==========
    duplicateEntryError(field) {
        const message = `${field} already exists`;
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.DUPLICATE_ENTRY,
            message, { field },
            409
        );
    }

    // ========== SERVER ERROR ==========
    serverError(message = 'Internal server error', error = null) {
        const details = error ? { originalError: error.message } : null;

        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.SERVER_ERROR,
            message,
            details,
            500
        );
    }

    // ========== BAD REQUEST ERROR ==========
    badRequestError(message, details = null) {
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.BAD_REQUEST,
            message,
            details,
            400
        );
    }

    // ========== INVALID INPUT ERROR ==========
    invalidInputError(message, invalidFields = []) {
        return this.createErrorResponse(
            ErrorHandlingService.ERROR_TYPES.INVALID_INPUT,
            message, { invalidFields },
            400
        );
    }

    // ========== SUCCESS RESPONSE ==========
    successResponse(data, message = 'Success', statusCode = 200) {
        return {
            success: true,
            data,
            message,
            statusCode,
        };
    }

    // ========== PAGINATED RESPONSE ==========
    paginatedResponse(data, total, page, limit, message = 'Success') {
        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
            message,
        };
    }

    // ========== LOG ERROR ==========
    logError(error, context = {}) {
        const errorLog = {
            timestamp: new Date(),
            message: error.message ? error.message : String(error),
            stack: error.stack ? error.stack : null,
            context,
        };

        console.error('[ERROR]', JSON.stringify(errorLog, null, 2));

        return errorLog;
    }

    // ========== HANDLE TRY CATCH ==========
    handleTryCatch(error, defaultMessage = 'An error occurred') {
        if (error.message && typeof error.message === 'string') {
            if (error.message.includes('duplicate')) {
                return this.duplicateEntryError('Record');
            }
            if (error.message.includes('not found')) {
                return this.notFoundError('Resource');
            }
            if (error.message.includes('unauthorized')) {
                return this.unauthorizedError();
            }
        }

        return this.serverError(defaultMessage, error);
    }
}

export default new ErrorHandlingService();