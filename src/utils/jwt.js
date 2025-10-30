const jwt = require("jsonwebtoken");
const config = require("../config");
const { UnauthorizedError } = require("./error-handler");

/**
 * Generate access token
 * @param {Object} payload - Token payload
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
  });

/**
 * Verify access token
 * @param {String} token - JWT token
 * @returns {Object} Decoded payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Token has expired");
    }
    throw new UnauthorizedError("Invalid token");
  }
};

/**
 * Verify refresh token
 * @param {String} token - JWT refresh token
 * @returns {Object} Decoded payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Refresh token has expired");
    }
    throw new UnauthorizedError("Invalid refresh token");
  }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - Token payload
 * @returns {Object} Object containing both tokens
 */
const generateTokenPair = (payload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
