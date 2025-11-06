// Authentication Middleware - NO optional chaining
import jwtUtil from '../utils/jwt.js';
import logger from '../utils/logger.js';
import { AuthenticationError } from '../exceptions/index.js';
import { sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AuthenticationError('Authorization header missing');
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new AuthenticationError('Invalid authorization header format');
        }

        const token = parts[1];

        try {
            const decoded = jwtUtil.verifyAccessToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            const errorMessage = error.message || 'Token verification failed';
            throw new AuthenticationError(errorMessage);
        }
    } catch (error) {
        const errorResponse = error instanceof AuthenticationError ?
            error :
            new AuthenticationError('Authentication failed');

        logger.error('Auth middleware error:', error.message);
        return sendError(res, errorResponse.statusCode, errorResponse.message);
    }
};

export default authMiddleware;