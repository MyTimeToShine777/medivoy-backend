// JWT Token Generation and Verification - NO optional chaining
import jwt from 'jsonwebtoken';
import logger from './logger.js';
import config from '../config/index.js';

const jwtUtil = {
    // Generate access token
    generateAccessToken: (payload) => {
        try {
            if (!payload || typeof payload !== 'object') {
                throw new Error('Payload is required');
            }

            const token = jwt.sign(payload, config.jwt.secret, {
                expiresIn: config.jwt.expiresIn,
            });

            return token;
        } catch (error) {
            logger.error('Access token generation failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Generate refresh token
    generateRefreshToken: (payload) => {
        try {
            if (!payload || typeof payload !== 'object') {
                throw new Error('Payload is required');
            }

            const token = jwt.sign(payload, config.jwt.refreshSecret, {
                expiresIn: config.jwt.refreshExpiresIn,
            });

            return token;
        } catch (error) {
            logger.error('Refresh token generation failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Verify access token
    verifyAccessToken: (token) => {
        try {
            if (!token || typeof token !== 'string') {
                throw new Error('Token is required');
            }

            const decoded = jwt.verify(token, config.jwt.secret);
            return decoded;
        } catch (error) {
            logger.error('Access token verification failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Verify refresh token
    verifyRefreshToken: (token) => {
        try {
            if (!token || typeof token !== 'string') {
                throw new Error('Token is required');
            }

            const decoded = jwt.verify(token, config.jwt.refreshSecret);
            return decoded;
        } catch (error) {
            logger.error('Refresh token verification failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Decode token without verification
    decodeToken: (token) => {
        try {
            if (!token || typeof token !== 'string') {
                throw new Error('Token is required');
            }

            const decoded = jwt.decode(token);
            return decoded;
        } catch (error) {
            logger.error('Token decoding failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    },
};

export default jwtUtil;