// Password Hashing and Verification - NO optional chaining
import bcrypt from 'bcryptjs';
import logger from './logger.js';
import config from '../config/index.js';

const passwordUtil = {
    // Hash password
    hashPassword: async(password) => {
        try {
            if (!password || typeof password !== 'string') {
                throw new Error('Password is required');
            }

            const salt = await bcrypt.genSalt(config.security.bcryptRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            logger.error('Password hashing failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    },

    // Verify password
    verifyPassword: async(password, hashedPassword) => {
        try {
            if (!password || !hashedPassword) {
                throw new Error('Password and hashed password are required');
            }

            const isValid = await bcrypt.compare(password, hashedPassword);
            return isValid;
        } catch (error) {
            logger.error('Password verification failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    },
};

export default passwordUtil;