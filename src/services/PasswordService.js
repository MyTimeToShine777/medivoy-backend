'use strict';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * PasswordService - Password hashing and validation
 * Production-ready password management with bcrypt
 */
class PasswordService {
    constructor() {
        this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    }

    /**
     * Hash password using bcrypt
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Hashed password
     */
    async hashPassword(password) {
        try {
            if (!password || typeof password !== 'string') {
                throw new Error('Password must be a non-empty string');
            }

            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            console.error('Password hashing error:', error.message);
            throw error;
        }
    }

    /**
     * Compare password with hash
     * @param {string} password - Plain text password
     * @param {string} hash - Hashed password
     * @returns {Promise<boolean>} True if password matches
     */
    async comparePassword(password, hash) {
        try {
            if (!password || !hash) {
                return false;
            }

            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Password comparison error:', error.message);
            return false;
        }
    }

    /**
     * Generate random password
     * @param {number} length - Password length (default: 16)
     * @returns {string} Random password
     */
    generateRandomPassword(length = 16) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        return password;
    }

    /**
     * Generate password reset token
     * @returns {Object} {token: string, hashedToken: string}
     */
    generateResetToken() {
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        return {
            token,
            hashedToken
        };
    }

    /**
     * Hash token for storage
     * @param {string} token - Token to hash
     * @returns {string} Hashed token
     */
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} {valid: boolean, score: number, errors: array}
     */
    validatePasswordStrength(password) {
        const errors = [];
        let score = 0;

        if (!password || typeof password !== 'string') {
            return {
                valid: false,
                score: 0,
                errors: ['Password must be a string']
            };
        }

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }

        // Character type checks
        if (/[A-Z]/.test(password)) {
            score++;
        } else {
            errors.push('Password must contain uppercase letters');
        }

        if (/[a-z]/.test(password)) {
            score++;
        } else {
            errors.push('Password must contain lowercase letters');
        }

        if (/[0-9]/.test(password)) {
            score++;
        } else {
            errors.push('Password must contain numbers');
        }

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score++;
        }

        return {
            valid: errors.length === 0,
            score: Math.min(score, 5),
            errors
        };
    }
}

export default new PasswordService();
