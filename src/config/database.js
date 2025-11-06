// PostgreSQL Configuration
import Sequelize from 'sequelize';
import config from './index.js';
import logger from '../utils/logger.js';

if (!config.database.url) {
    logger.error('DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sequelize = new Sequelize(config.database.url, {
    dialect: config.database.dialect,
    logging: config.database.logging,
    pool: config.database.pool,
    timestamps: true,
    underscored: true,
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        logger.info('✅ PostgreSQL database connected successfully');
        return true;
    } catch (error) {
        logger.error('Failed to connect to PostgreSQL database');
        logger.error('Error details:', error.message);
        return false;
    }
}

async function syncModels() {
    try {
        await sequelize.sync({ alter: config.nodeEnv === 'development' });
        logger.info('✅ Database models synchronized');
        return true;
    } catch (error) {
        logger.error('Failed to sync database models');
        logger.error('Error details:', error.message);
        return false;
    }
}

export {
    sequelize,
    testConnection,
    syncModels,
};