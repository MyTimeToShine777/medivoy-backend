// Cache Utility - Redis Integration - NO optional chaining
import { client } from '../config/redis.js';
import logger from './logger.js';
import config from '../config/index.js';

const cacheUtil = {
    // Set cache
    set: async(key, value, ttl) => {
        try {
            if (!config.cache.enabled) {
                return false;
            }

            if (!key || !value) {
                throw new Error('Key and value are required');
            }

            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            const expirationTime = ttl || config.cache.ttl.medium;

            await client.setEx(key, expirationTime, stringValue);
            logger.debug(`Cache set: ${key}`);
            return true;
        } catch (error) {
            logger.warn('Cache set failed');
            logger.warn('Error details:', error.message);
            return false;
        }
    },

    // Get cache
    get: async(key) => {
        try {
            if (!config.cache.enabled) {
                return null;
            }

            if (!key) {
                throw new Error('Key is required');
            }

            const value = await client.get(key);
            if (!value) {
                return null;
            }

            try {
                return JSON.parse(value);
            } catch (parseError) {
                return value;
            }
        } catch (error) {
            logger.warn('Cache get failed');
            logger.warn('Error details:', error.message);
            return null;
        }
    },

    // Delete cache
    delete: async(key) => {
        try {
            if (!config.cache.enabled) {
                return false;
            }

            if (!key) {
                throw new Error('Key is required');
            }

            await client.del(key);
            logger.debug(`Cache deleted: ${key}`);
            return true;
        } catch (error) {
            logger.warn('Cache delete failed');
            logger.warn('Error details:', error.message);
            return false;
        }
    },

    // Clear all cache
    clearAll: async() => {
        try {
            if (!config.cache.enabled) {
                return false;
            }

            await client.flushDb();
            logger.info('All cache cleared');
            return true;
        } catch (error) {
            logger.warn('Cache clear failed');
            logger.warn('Error details:', error.message);
            return false;
        }
    },

    // Check if key exists
    exists: async(key) => {
        try {
            if (!config.cache.enabled) {
                return false;
            }

            if (!key) {
                throw new Error('Key is required');
            }

            const exists = await client.exists(key);
            return exists === 1;
        } catch (error) {
            logger.warn('Cache exists check failed');
            logger.warn('Error details:', error.message);
            return false;
        }
    },
};

export default cacheUtil;