// Request Validation Middleware - NO optional chaining
import logger from '../utils/logger.js';
import { ValidationError } from '../exceptions/index.js';
import { sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const validateRequest = (schema, dataSource) => {
    return (req, res, next) => {
        try {
            const data = dataSource === 'body' ? req.body : req.params;

            const { error, value } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true,
            });

            if (error) {
                const messages = error.details.map((detail) => detail.message);
                throw new ValidationError('Validation failed', messages);
            }

            if (dataSource === 'body') {
                req.body = value;
            } else {
                req.params = value;
            }

            next();
        } catch (err) {
            const errorResponse = err instanceof ValidationError ?
                err :
                new ValidationError('Validation failed');

            logger.error('Validation error:', err.message);
            return sendError(res, errorResponse.statusCode, errorResponse.message);
        }
    };
};

export default validateRequest;