// JWT Service - JWT token management
// NO optional chaining - Production Ready
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

class JWTService {
    // ========== GENERATE ACCESS TOKEN ==========
    generateAccessToken(payload, expiresIn = '1h') {
        try {
            if (!payload || typeof payload !== 'object') {
                return { success: false, error: 'Payload must be an object' };
            }

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'your-secret-key', { expiresIn }
            );

            return { success: true, token };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GENERATE REFRESH TOKEN ==========
    async generateRefreshToken(userId, expiresIn = '7d') {
        try {
            if (!userId) {
                return { success: false, error: 'User ID is required' };
            }

            const token = jwt.sign({ userId },
                process.env.JWT_REFRESH_SECRET || 'refresh-secret-key', { expiresIn }
            );

            const refreshTokenRecord = await prisma.refreshToken.create({
                data: {
                userId,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: 'active',
            });

            return { success: true, token, recordId: refreshTokenRecord.refreshTokenId };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VERIFY ACCESS TOKEN ==========
    verifyAccessToken(token) {
        try {
            if (!token || typeof token !== 'string') {
                return { success: false, error: 'Token must be a non-empty string' };
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key'
            );

            return { success: true, decoded };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                expired: error.name === 'TokenExpiredError',
            };
        }
    }

    // ========== VERIFY REFRESH TOKEN ==========
    async verifyRefreshToken(token) {
        try {
            if (!token || typeof token !== 'string') {
                return { success: false, error: 'Token must be a non-empty string' };
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET || 'refresh-secret-key'
            );

            const refreshTokenRecord = await prisma.refreshToken.findFirst({
                where: { token, status: 'active' },
            });

            if (!refreshTokenRecord) {
                return { success: false, error: 'Refresh token not found or revoked' };
            }

            return { success: true, decoded };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DECODE TOKEN ==========
    decodeToken(token) {
        try {
            if (!token || typeof token !== 'string') {
                return { success: false, error: 'Token must be a non-empty string' };
            }

            const decoded = jwt.decode(token);

            if (!decoded) {
                return { success: false, error: 'Invalid token format' };
            }

            return { success: true, decoded };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== REFRESH ACCESS TOKEN ==========
    async refreshAccessToken(refreshToken) {
        try {
            const verification = await this.verifyRefreshToken(refreshToken);

            if (!verification.success) {
                return verification;
            }

            const userId = verification.decoded.userId;

            const newAccessToken = this.generateAccessToken({ userId },
                '1h'
            );

            return newAccessToken;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== REVOKE REFRESH TOKEN ==========
    async revokeRefreshToken(token) {
        try {
            const refreshTokenRecord = await prisma.refreshToken.findFirst({
                where: { token },
            });

            if (!refreshTokenRecord) {
                return { success: false, error: 'Refresh token not found' };
            }

            refreshTokenRecord.status = 'revoked';
            refreshTokenRecord.revokedAt = new Date();
            await refreshTokenRecord.save();

            return { success: true, message: 'Refresh token revoked' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET TOKEN EXPIRATION ==========
    getTokenExpiration(token) {
        try {
            const decoded = jwt.decode(token);

            if (!decoded || !decoded.exp) {
                return { success: false, error: 'Invalid token' };
            }

            const expirationTime = new Date(decoded.exp * 1000);
            const currentTime = new Date();
            const timeRemaining = expirationTime - currentTime;

            return {
                success: true,
                expiresAt: expirationTime,
                expiresIn: Math.floor(timeRemaining / 1000),
                isExpired: timeRemaining < 0,
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== IS TOKEN VALID ==========
    isTokenValid(token) {
        try {
            jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key'
            );

            return { success: true, isValid: true };
        } catch (error) {
            return { success: true, isValid: false, reason: error.message };
        }
    }
}

export default new JWTService();