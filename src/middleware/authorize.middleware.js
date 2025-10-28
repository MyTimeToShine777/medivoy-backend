const { ForbiddenError } = require('../utils/error-handler');
const { USER_ROLES, ROLE_PERMISSIONS } = require('../constants/user-roles');
const logger = require('../utils/logger');

/**
 * Authorization middleware - Check user roles
 * @param {...String} allowedRoles - Allowed roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }
      
      // Check if user role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role}`);
        throw new ForbiddenError('You do not have permission to access this resource');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user has specific permission
 * @param {String} permission - Required permission
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }
      
      const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
      
      if (!userPermissions.includes(permission)) {
        logger.warn(`Permission denied: ${req.user.email} lacks ${permission}`);
        throw new ForbiddenError(`You do not have the required permission: ${permission}`);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user owns the resource
 * @param {String} paramName - Parameter name containing resource owner ID
 */
const checkOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }
      
      // Admin can access any resource
      if (req.user.role === USER_ROLES.ADMIN) {
        return next();
      }
      
      const resourceOwnerId = req.params[paramName] || req.body[paramName];
      
      if (req.user.id !== parseInt(resourceOwnerId, 10)) {
        logger.warn(`Ownership check failed for user ${req.user.email}`);
        throw new ForbiddenError('You can only access your own resources');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authorize,
  checkPermission,
  checkOwnership
};