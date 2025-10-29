const { Sequelize } = require('sequelize');
const config = require('./index');
const logger = require('../utils/logger');

// Create Sequelize instance
const sequelize = new Sequelize(
  config.postgres.database,
  config.postgres.user,
  config.postgres.password,
  {
    host: config.postgres.host,
    port: config.postgres.port,
    dialect: config.postgres.dialect,
    logging: config.postgres.logging ? logger.debug : false,
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
  } catch (error) {
    logger.error('❌ Unable to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  testConnection,
};