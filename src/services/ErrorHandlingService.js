'use strict';

class ErrorHandlingService {
    handleError(error, context = '') {
        const errorInfo = {
            message: error.message || 'Unknown error',
            code: error.code || 'INTERNAL_ERROR',
            context: context,
            timestamp: new Date().toISOString()
        };
        if (error.stack) errorInfo.stack = error.stack;
        console.error(`[${context}] Error:`, errorInfo);
        return errorInfo;
    }

    createError(message, code = 'ERROR', statusCode = 500) {
        const error = new Error(message);
        error.code = code;
        error.statusCode = statusCode;
        return error;
    }

    formatErrorResponse(error) {
        return {
            success: false,
            error: error.message || 'An error occurred',
            code: error.code || 'ERROR',
            timestamp: new Date().toISOString()
        };
    }
}

export default new ErrorHandlingService();
