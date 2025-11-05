const { Sequelize } = require('sequelize');
const config = require('./index');
const logger = require('../utils/logger');

// Create Sequelize instance
const sequelize = new Sequelize(
    config.postgres.database,
    config.postgres.user,
    config.postgres.password, {
        host: config.postgres.host,
        port: config.postgres.port,
        dialect: config.postgres.dialect,
        logging: config.postgres.logging ? (msg) => logger.debug(msg) : false,
        pool: {
            max: config.postgres.pool.max,
            min: config.postgres.pool.min,
            acquire: config.postgres.pool.acquire,
            idle: config.postgres.pool.idle,
        },
    },
);

/**
 * Test database connection
 */
async function testConnection() {
    try {
        await sequelize.authenticate();
        logger.info('✅ PostgreSQL connection established successfully');
        return true;
    } catch (error) {
        logger.warn('⚠️  Unable to connect to PostgreSQL:', error.message);
        logger.warn('⚠️  Application will continue without database connection');
        logger.warn('⚠️  Please configure database settings in .env file');
        return false;
    }
}

module.exports = {
    sequelize,
    testConnection,
};