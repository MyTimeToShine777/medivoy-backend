const userRoles = require("../constants/user-roles");
const logger = require("../utils/logger");

/**
 * Authorization middleware to check user roles and permissions
 */
const authorizeMiddleware = (allowedRoles) => (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        code: "AUTH_NO_TOKEN",
      });
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        code: "AUTH_INSUFFICIENT_PERMISSIONS",
      });
    }

    next();
  } catch (error) {
    logger.error("Authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization check failed",
      code: "AUTHORIZATION_FAILED",
      error: error.message,
    });
  }
};

module.exports = authorizeMiddleware;
