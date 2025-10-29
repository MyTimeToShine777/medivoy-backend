const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * Connect to MongoDB
 */
async function connectMongoDB() {
  try {
    await mongoose.connect(config.mongodb.uri, options);
    logger.info('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    logger.warn('⚠️  MongoDB connection error:', error.message);
    logger.warn('⚠️  Application will continue without MongoDB connection');
    logger.warn('⚠️  Please configure MongoDB settings in .env file');
    return false;
  }
}

module.exports = connectMongoDB;
