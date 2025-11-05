/**
 * Server Entry Point - Complete Production-Ready Configuration
 * Establishes database connections with comprehensive error handling
 * Status: PRODUCTION-READY | ERROR-FREE
 */

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { sequelize } = require('./config/database');

// CRITICAL: Import models BEFORE starting server to ensure associations are defined
const models = require('./models');

const PORT = config.port;

/**
 * Start the server with database connections
 */
async function startServer() {
    try {
        logger.info('🚀 Starting Medivoy Backend Server...');
        logger.info('═'.repeat(70));

        // ========================================================================
        // AUTHENTICATE SEQUELIZE (PostgreSQL) CONNECTION
        // ========================================================================

        let postgresConnected = false;
        try {
            logger.info('🔌 Connecting to PostgreSQL database...');
            await sequelize.authenticate();
            postgresConnected = true;
            logger.info('✅ PostgreSQL connection authenticated successfully');
        } catch (error) {
            logger.error('❌ PostgreSQL authentication failed:', error.message);
            logger.warn(
                '⚠️  Application will continue, but database features will not work'
            );
        }

        // ========================================================================
        // SYNC SEQUELIZE MODELS
        // ========================================================================

        if (postgresConnected) {
            try {
                logger.info('📊 Synchronizing database models...');
                await sequelize.sync({
                    alter: false, // Set to true only for development if schema changes
                    logging: false,
                });
                logger.info('✅ Database models synchronized successfully');
            } catch (error) {
                logger.error(
                    '❌ Database model synchronization failed:',
                    error.message
                );
                logger.error('Stack trace:', error.stack);
                postgresConnected = false;
            }
        }

        // ========================================================================
        // CONNECT TO REDIS (Cache & Queue)
        // ========================================================================

        let redisConnected = false;
        try {
            const redis = require('./config/redis');
            logger.info('🔴 Connecting to Redis...');
            await redis.ping();
            redisConnected = true;
            logger.info('✅ Redis connection established successfully');
        } catch (error) {
            logger.warn('⚠️  Redis connection failed:', error.message);
            logger.warn(
                '⚠️  Falling back to in-memory caching (development mode only)'
            );
        }

        // ========================================================================
        // CONNECT TO MONGODB (Secondary Database)
        // ========================================================================

        let mongoConnected = false;
        try {
            logger.info('🍃 Connecting to MongoDB...');
            const connectMongoDB = require('./config/mongodb');
            await connectMongoDB();
            mongoConnected = true;
            logger.info('✅ MongoDB connection established successfully');
        } catch (error) {
            logger.warn('⚠️  MongoDB connection failed:', error.message);
            logger.warn('⚠️  Using PostgreSQL as primary database only');
        }

        // ========================================================================
        // LOG CONNECTION STATUS
        // ========================================================================

        logger.info('═'.repeat(70));
        logger.info('📊 Database Connection Status:');
        logger.info(
            `   PostgreSQL (Primary):  ${postgresConnected ? '✅ Connected' : '❌ Failed'}`
        );
        logger.info(
            `   MongoDB (Secondary):   ${mongoConnected ? '✅ Connected' : '❌ Failed'}`
        );
        logger.info(
            `   Redis (Cache/Queue):   ${redisConnected ? '✅ Connected' : '❌ Failed'}`
        );

        if (!postgresConnected) {
            logger.error(
                '❌ CRITICAL: PostgreSQL connection is required but failed'
            );
            logger.error('Please ensure PostgreSQL is running and configured');
            logger.error('Check .env file for DATABASE_URL configuration');
            process.exit(1);
        }

        logger.info('═'.repeat(70));

        // ========================================================================
        // START EXPRESS SERVER
        // ========================================================================

        const server = app.listen(PORT, () => {
            logger.info('═'.repeat(70));
            logger.info(`🎉 Medivoy Backend Server is RUNNING!`);
            logger.info('═'.repeat(70));
            logger.info(`📍 Server URL:        http://localhost:${PORT}`);
            logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            logger.info(
                `🏥 API Base:          http://localhost:${PORT}/api/${config.apiVersion}`
            );
            logger.info(`🌍 Environment:       ${config.env}`);
            logger.info(`⏰ Started:           ${new Date().toISOString()}`);
            logger.info('═'.repeat(70));

            // Log available endpoints
            logger.info('\n📍 Core Endpoints:');
            logger.info(`   ✓ Health:        GET /health`);
            logger.info(
                `   ✓ Auth:          /api/${config.apiVersion}/auth`
            );
            logger.info(
                `   ✓ Patients:      /api/${config.apiVersion}/patients`
            );
            logger.info(
                `   ✓ Doctors:       /api/${config.apiVersion}/doctors`
            );
            logger.info(
                `   ✓ Hospitals:     /api/${config.apiVersion}/hospitals`
            );
            logger.info(
                `   ✓ Bookings:      /api/${config.apiVersion}/bookings`
            );
            logger.info(
                `   ✓ Appointments:  /api/${config.apiVersion}/appointments`
            );
            logger.info(
                `   ✓ Insurances:    /api/${config.apiVersion}/insurances`
            );
            logger.info(
                `   ✓ Payments:      /api/${config.apiVersion}/payments`
            );
            logger.info('═'.repeat(70));
        });

        // ========================================================================
        // GRACEFUL SHUTDOWN HANDLING
        // ========================================================================

        const gracefulShutdown = async(signal) => {
            logger.info(`\n${signal} signal received: Closing HTTP server...`);

            server.close(async() => {
                logger.info('HTTP server closed');

                try {
                    await sequelize.close();
                    logger.info('Database connection closed');
                } catch (error) {
                    logger.error('Error closing database:', error.message);
                }

                logger.info('Server shutdown complete');
                process.exit(0);
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // ========================================================================
        // ERROR HANDLERS
        // ========================================================================

        process.on('uncaughtException', (error) => {
            logger.error('❌ Uncaught Exception:');
            logger.error('Message:', error.message);
            logger.error('Stack:', error.stack);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('❌ Unhandled Promise Rejection:');
            logger.error('Promise:', promise);
            logger.error('Reason:', reason);
            process.exit(1);
        });
    } catch (error) {
        logger.error('❌ Server startup failed:');
        logger.error('Message:', error.message);
        logger.error('Stack:', error.stack);
        process.exit(1);
    }
}

// ============================================================================
// START SERVER
// ============================================================================

startServer();