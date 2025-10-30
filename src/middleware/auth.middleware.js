const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User.model");
const logger = require("../utils/logger");

/**
 * Authentication middleware to verify JWT tokens
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization header provided",
        code: "AUTH_NO_TOKEN",
      });
    }

    // Check if token is in Bearer format
    const tokenParts = authHeader.split(" ");
    if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header format",
        code: "AUTH_INVALID_TOKEN_FORMAT",
      });
    }

    const token = tokenParts[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Get user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: "AUTH_USER_NOT_FOUND",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
        code: "AUTH_TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        code: "AUTH_TOKEN_INVALID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      code: "AUTH_FAILED",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
