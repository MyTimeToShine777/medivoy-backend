'use strict';

import jwt from 'jsonwebtoken';

class JWTService {
    generateToken(payload, expiresIn = '24h') {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) throw new Error('JWT_SECRET not configured');
            return jwt.sign(payload, secret, { expiresIn });
        } catch (error) {
            console.error('JWT generation error:', error.message);
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) throw new Error('JWT_SECRET not configured');
            return jwt.verify(token, secret);
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return null;
        }
    }

    generateRefreshToken(payload) {
        try {
            const secret = process.env.JWT_REFRESH_SECRET;
            if (!secret) throw new Error('JWT_REFRESH_SECRET not configured');
            return jwt.sign(payload, secret, { expiresIn: '7d' });
        } catch (error) {
            console.error('Refresh token generation error:', error.message);
            throw error;
        }
    }
}

export default new JWTService();
