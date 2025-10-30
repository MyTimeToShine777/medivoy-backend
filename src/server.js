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
    // DATABASE CONNECTIONS (Optional - will warn if not available)
    // ========================================================================

    logger.info('🔌 Attempting to connect to databases...');

    // Connect to PostgreSQL (optional)
    const postgresConnected = await testConnection();

    // Connect to MongoDB (optional)
    const mongoConnected = await connectMongoDB();

    // Test Redis connection (optional)
    let redisConnected = false;
    try {
      await redis.ping();
      logger.info('✅ Redis connected successfully');
      redisConnected = true;
    } catch (error) {
      logger.warn('⚠️  Redis not available:', error.message);
      logger.warn('⚠️  Application will continue without Redis caching');
    }

    // Log connection status
    if (postgresConnected && mongoConnected && redisConnected) {
      logger.info('✅ All database connections established');
    } else {
      logger.warn('⚠️  Some database connections are not available:');
      if (!postgresConnected) logger.warn('   - PostgreSQL: Not connected');
      if (!mongoConnected) logger.warn('   - MongoDB: Not connected');
      if (!redisConnected) logger.warn('   - Redis: Not connected');
      logger.info('✅ Server will continue with available connections');
    }

    // ========================================================================
    // SYNC DATABASE (Development only - if PostgreSQL is connected)
    // ========================================================================

    if (config.env === 'development' && postgresConnected) {
      try {
        const { sequelize } = require('./config/database');
        await sequelize.sync({ alter: false }); // Set to true to auto-update schema
        logger.info('✅ Database synchronized');
      } catch (error) {
        logger.warn('⚠️  Database sync failed:', error.message);
      }
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

      // Log database status
      logger.info('📊 Database Status:');
      logger.info(`   PostgreSQL: ${postgresConnected ? '✅ Connected' : '❌ Not Connected'}`);
      logger.info(`   MongoDB: ${mongoConnected ? '✅ Connected' : '❌ Not Connected'}`);
      logger.info(`   Redis: ${redisConnected ? '✅ Connected' : '❌ Not Connected'}`);
      logger.info('');

      if (!postgresConnected || !mongoConnected || !redisConnected) {
        logger.warn('⚠️  Note: Some features may be limited without database connections');
        logger.warn('⚠️  Please configure database settings in .env file');
        logger.warn('⚠️  Or run: docker-compose up -d (to start databases)');
        logger.info('');
      }
    });
  } catch (error) {
    logger.error('❌ Server startup failed:', error);
    logger.error('Stack trace:', error.stack);
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
  logger.error('Stack trace:', error.stack);
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
