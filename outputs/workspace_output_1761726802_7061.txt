/**
 * Server Entry Point
 */

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { testConnection } = require('./config/database');
const connectMongoDB = require('./config/mongodb');
const redis = require('./config/redis');

const PORT = config.port;

/**
 * Start the server
 */
async function startServer() {
  try {
    // ========================================================================
    // DATABASE CONNECTIONS
    // ========================================================================
    
    logger.info('🔌 Connecting to databases...');
    
    // Connect to PostgreSQL
    await testConnection();
    
    // Connect to MongoDB
    await connectMongoDB();
    
    // Test Redis connection
    await redis.ping();
    logger.info('✅ Redis connected successfully');
    
    logger.info('✅ All database connections established');
    
    // ========================================================================
    // SYNC DATABASE (Development only)
    // ========================================================================
    
    if (config.env === 'development') {
      const { sequelize } = require('./config/database');
      await sequelize.sync({ alter: false }); // Set to true to auto-update schema
      logger.info('✅ Database synchronized');
    }
    
    // ========================================================================
    // START SERVER
    // ========================================================================
    
    app.listen(PORT, () => {
      logger.info('='.repeat(60));
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 API Base URL: http://localhost:${PORT}/api/${config.apiVersion}`);
      logger.info(`🌍 Environment: ${config.env}`);
      logger.info(`⏰ Started at: ${new Date().toISOString()}`);
      logger.info('='.repeat(60));
      
      // Log some useful endpoints
      logger.info('\n📍 Key Endpoints:');
      logger.info(`   Health Check: http://localhost:${PORT}/health`);
      logger.info(`   Auth: http://localhost:${PORT}/api/${config.apiVersion}/auth`);
      logger.info(`   Patients: http://localhost:${PORT}/api/${config.apiVersion}/patients`);
      logger.info(`   Doctors: http://localhost:${PORT}/api/${config.apiVersion}/doctors`);
      logger.info(`   Hospitals: http://localhost:${PORT}/api/${config.apiVersion}/hospitals`);
      logger.info(`   Appointments: http://localhost:${PORT}/api/${config.apiVersion}/appointments`);
      logger.info(`   Bookings: http://localhost:${PORT}/api/${config.apiVersion}/bookings`);
      logger.info(`   Insurance: http://localhost:${PORT}/api/${config.apiVersion}/insurances`);
      logger.info('');
    });
    
  } catch (error) {
    logger.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// ============================================================================
// START THE SERVER
// ============================================================================

startServer();