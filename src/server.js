// Server Startup - Production-Ready - NO optional chaining
import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import { testConnection, syncModels } from './config/database.js';
import { connectRedis } from './config/redis.js';

const PORT = config.port;
const ENV = config.nodeEnv;

// ============================================================================
// STARTUP SEQUENCE
// ============================================================================
async function startServer() {
    try {
        logger.info('');
        logger.info('═══════════════════════════════════════════════════════════');
        logger.info(`🚀 Starting Medivoy Healthcare Backend Server`);
        logger.info('═══════════════════════════════════════════════════════════');
        logger.info('');

        // Environment info
        logger.info(`📊 Environment: ${ENV}`);
        logger.info(`🔑 App Name: ${config.appName}`);
        logger.info(`🌐 App URL: ${config.appUrl}`);
        logger.info('');

        // ====================================================================
        // DATABASE CONNECTION
        // ====================================================================
        logger.info('🔗 Connecting to Database...');
        const dbConnected = await testConnection();

        if (!dbConnected) {
            logger.warn('⚠️  Database connection test failed');
            logger.warn('⚠️  Continuing without database...');
        } else {
            logger.info('✅ Database connected successfully');

            // Sync models
            logger.info('🔄 Synchronizing database models...');
            const modelsSynced = await syncModels();

            if (!modelsSynced) {
                logger.warn('⚠️  Model sync failed');
            } else {
                logger.info('✅ Database models synchronized');
            }
        }
        logger.info('');

        // ====================================================================
        // REDIS CONNECTION
        // ====================================================================
        logger.info('💾 Connecting to Redis Cache...');
        const redisConnected = await connectRedis();

        if (!redisConnected) {
            logger.warn('⚠️  Redis connection failed');
            logger.warn('⚠️  Continuing without cache (performance may be affected)');
        } else {
            logger.info('✅ Redis connected successfully');
        }
        logger.info('');

        // ====================================================================
        // START EXPRESS SERVER
        // ====================================================================
        const server = app.listen(PORT, () => {
            logger.info('═══════════════════════════════════════════════════════════');
            logger.info(`✅ Server is running successfully!`);
            logger.info('═══════════════════════════════════════════════════════════');
            logger.info('');
            logger.info(`📡 Server Address: http://localhost:${PORT}`);
            logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
            logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            logger.info(`❤️  Health Check: http://localhost:${PORT}/health`);
            logger.info('');
            logger.info('Available Endpoints:');
            logger.info('  🔐 Authentication: POST /api/auth/register, /api/auth/login');
            logger.info('  👥 Users: GET/POST /api/users (Coming soon)');
            logger.info('  📋 Bookings: GET/POST /api/bookings (Coming soon)');
            logger.info('  💳 Payments: POST /api/payments (Coming soon)');
            logger.info('  🏥 Consultations: GET/POST /api/consultations (Coming soon)');
            logger.info('');
            logger.info(`⚙️  Environment: ${ENV}`);
            logger.info(`📝 Log Level: ${config.logLevel || 'info'}`);
            logger.info('');
            logger.info('═══════════════════════════════════════════════════════════');
            logger.info('');
        });

        // ====================================================================
        // HANDLE SERVER ERRORS
        // ====================================================================
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`❌ Port ${PORT} is already in use`);
                logger.error('Try using a different port: PORT=3001 pnpm dev');
            } else {
                logger.error('❌ Server error:', error.message);
            }
            process.exit(1);
        });

        // ====================================================================
        // HANDLE SERVER CLOSE
        // ====================================================================
        server.on('close', () => {
            logger.info('Server closed');
        });

        return server;
    } catch (error) {
        logger.error('');
        logger.error('═══════════════════════════════════════════════════════════');
        logger.error(`❌ Failed to start server`);
        logger.error('═══════════════════════════════════════════════════════════');
        logger.error('');
        logger.error('Error Details:');
        logger.error(`  Message: ${error.message}`);
        if (error.stack) {
            logger.error(`  Stack: ${error.stack}`);
        }
        logger.error('');
        logger.error('Troubleshooting:');
        logger.error('  1. Check .env file is configured correctly');
        logger.error('  2. Verify DATABASE_URL is valid');
        logger.error('  3. Check PostgreSQL is running');
        logger.error('  4. Check Redis is running (optional)');
        logger.error('');
        logger.error('═══════════════════════════════════════════════════════════');
        logger.error('');
        process.exit(1);
    }
}

// ============================================================================
// HANDLE UNHANDLED PROMISE REJECTIONS
// ============================================================================
process.on('unhandledRejection', (reason, promise) => {
    logger.error('');
    logger.error('⚠️  UNHANDLED PROMISE REJECTION');
    logger.error(`Promise: ${promise}`);
    logger.error(`Reason: ${reason}`);
    logger.error('');
    // Don't exit - let the app continue
});

// ============================================================================
// HANDLE UNCAUGHT EXCEPTIONS
// ============================================================================
process.on('uncaughtException', (error) => {
    logger.error('');
    logger.error('❌ UNCAUGHT EXCEPTION');
    logger.error(`Message: ${error.message}`);
    if (error.stack) {
        logger.error(`Stack: ${error.stack}`);
    }
    logger.error('');
    // Exit the process for uncaught exceptions
    process.exit(1);
});

// ============================================================================
// GRACEFUL SHUTDOWN HANDLERS
// ============================================================================
process.on('SIGTERM', () => {
    logger.warn('');
    logger.warn('═══════════════════════════════════════════════════════════');
    logger.warn('🛑 SIGTERM signal received: closing HTTP server');
    logger.warn('═══════════════════════════════════════════════════════════');
    logger.warn('');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.warn('');
    logger.warn('═══════════════════════════════════════════════════════════');
    logger.warn('🛑 SIGINT signal received: closing HTTP server');
    logger.warn('═══════════════════════════════════════════════════════════');
    logger.warn('');
    process.exit(0);
});

// ============================================================================
// START SERVER
// ============================================================================
startServer();