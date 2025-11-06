// Redis Configuration
import redis from 'redis';
import logger from '../utils/logger.js';
import config from './index.js';

const client = redis.createClient({
    url: config.redis.url,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                logger.warn('Redis reconnection attempts exceeded');
                return new Error('Redis max retries exceeded');
            }
            return retries * 100;
        },
    },
});

client.on('error', (error) => {
    logger.warn('Redis client error:', error.message);
});

client.on('connect', () => {
    logger.info('✅ Redis connected successfully');
});

async function connectRedis() {
    try {
        if (client.isOpen === false) {
            await client.connect();
        }
        logger.info('✅ Redis connection established');
        return true;
    } catch (error) {
        logger.warn('Redis connection warning:', error.message);
        logger.warn('Application will continue without Redis cache');
        return false;
    }
}

export {
    client,
    connectRedis,
};