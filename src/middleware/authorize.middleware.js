// Authorization Middleware - Role-Based Access Control - NO optional chaining
import logger from '../utils/logger.js';
import { AuthorizationError } from '../exceptions/index.js';
import { sendError } from '../utils/response.js';
import { USER_ROLES, ROLE_HIERARCHY } from '../constants/userRoles.js';

export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new AuthorizationError('User not authenticated');
            }

            const userRole = req.user.role;

            if (!userRole) {
                throw new AuthorizationError('User role not found');
            }

            if (!Array.isArray(allowedRoles)) {
                throw new Error('allowedRoles must be an array');
            }

            if (!allowedRoles.includes(userRole)) {
                throw new AuthorizationError(`Role '${userRole}' not authorized for this action`);
            }

            next();
        } catch (error) {
            const errorResponse = error instanceof AuthorizationError ?
                error :
                new AuthorizationError('Authorization failed');

            logger.error('Authorization error:', error.message);
            return sendError(res, errorResponse.statusCode, errorResponse.message);
        }
    };
};

export const authorizeByHierarchy = (minimumRole) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new AuthorizationError('User not authenticated');
            }

            const userRole = req.user.role;
            const userHierarchy = ROLE_HIERARCHY[userRole];
            const minimumHierarchy = ROLE_HIERARCHY[minimumRole];

            if (!userHierarchy) {
                throw new AuthorizationError('Invalid user role');
            }

            if (!minimumHierarchy) {
                throw new Error('Invalid minimum role');
            }

            if (userHierarchy < minimumHierarchy) {
                throw new AuthorizationError(`Insufficient permissions. Minimum role required: ${minimumRole}`);
            }

            next();
        } catch (error) {
            const errorResponse = error instanceof AuthorizationError ?
                error :
                new AuthorizationError('Authorization failed');

            logger.error('Authorization error:', error.message);
            return sendError(res, errorResponse.statusCode, errorResponse.message);
        }
    };
};

export default authorize;