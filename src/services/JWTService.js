'use strict';

import jwt from 'jsonwebtoken';

/**
 * JWTService - JSON Web Token management
 * Production-ready JWT generation and verification
 */
class JWTService {
    /**
     * Generate access token
     * @param {Object} payload - Data to encode in token
     * @param {string} expiresIn - Token expiration (default: 24h)
     * @returns {string} JWT token
     */
    generateToken(payload, expiresIn = '24h') {
        try {
            const secret = process.env.JWT_SECRET;
            
            if (!secret) {
                throw new Error('JWT_SECRET not configured in environment');
            }

            return jwt.sign(payload, secret, {
                expiresIn,
                issuer: process.env.APP_NAME || 'medivoy',
                audience: process.env.APP_URL || 'medivoy-app'
            });
        } catch (error) {
            console.error('JWT generation error:', error.message);
            throw error;
        }
    }

    /**
     * Generate refresh token
     * @param {Object} payload - Data to encode in token
     * @returns {string} Refresh token
     */
    generateRefreshToken(payload) {
        try {
            const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
            
            if (!secret) {
                throw new Error('JWT_REFRESH_SECRET not configured');
            }

            return jwt.sign(payload, secret, {
                expiresIn: '7d',
                issuer: process.env.APP_NAME || 'medivoy',
                audience: process.env.APP_URL || 'medivoy-app'
            });
        } catch (error) {
            console.error('Refresh token generation error:', error.message);
            throw error;
        }
    }

    /**
     * Verify and decode token
     * @param {string} token - JWT token to verify
     * @returns {Object|null} Decoded payload or null if invalid
     */
    verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET;
            
            if (!secret) {
                throw new Error('JWT_SECRET not configured');
            }

            return jwt.verify(token, secret, {
                issuer: process.env.APP_NAME || 'medivoy',
                audience: process.env.APP_URL || 'medivoy-app'
            });
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return null;
        }
    }

    /**
     * Verify refresh token
     * @param {string} token - Refresh token to verify
     * @returns {Object|null} Decoded payload or null if invalid
     */
    verifyRefreshToken(token) {
        try {
            const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
            
            if (!secret) {
                throw new Error('JWT_REFRESH_SECRET not configured');
            }

            return jwt.verify(token, secret, {
                issuer: process.env.APP_NAME || 'medivoy',
                audience: process.env.APP_URL || 'medivoy-app'
            });
        } catch (error) {
            console.error('Refresh token verification error:', error.message);
            return null;
        }
    }

    /**
     * Decode token without verification
     * @param {string} token - JWT token to decode
     * @returns {Object|null} Decoded payload or null if invalid
     */
    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            console.error('JWT decode error:', error.message);
            return null;
        }
    }

    /**
     * Check if token is expired
     * @param {string} token - JWT token to check
     * @returns {boolean} True if expired
     */
    isTokenExpired(token) {
        try {
            const decoded = this.decodeToken(token);
            
            if (!decoded || !decoded.exp) {
                return true;
            }

            return Date.now() >= decoded.exp * 1000;
        } catch (error) {
            return true;
        }
    }
}

export default new JWTService();
