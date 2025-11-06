// Error Handler Middleware - NO optional chaining
import logger from '../utils/logger.js';
import { sendError } from '../utils/response.js';
import { AppError } from '../exceptions/index.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const errorHandlerMiddleware = (error, req, res, next) => {
    logger.error('Error caught by middleware:', error.message);

    if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message);
    }

    // Sequelize validation error
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map((err) => err.message);
        return sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation error', messages);
    }

    // Sequelize unique constraint error
    if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors && error.errors.length > 0 ? error.errors[0].path : 'field';
        return sendError(res, HTTP_STATUS.CONFLICT, `${field} already exists`);
    }

    // JSON parse error
    if (error instanceof SyntaxError && error.status === 400) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid JSON');
    }

    // Default error
    logger.error('Unhandled error:', error);
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal server error');
};

export default errorHandlerMiddleware;