'use strict';

import http from 'http';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

import app from './app.js';
import { sequelize, testConnection, syncDatabase, disconnectDatabase } from './config/database.js';
import { initializeModels } from './models/index.js';
import { cacheService } from './config/redis.js';
import { mongoDBService } from './config/mongodb.js';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'Medivoy Backend';
const APP_VERSION = process.env.APP_VERSION || '1.0.0';

// ─────────────────────────────────────────────────────────────────────────────
// CREATE HTTP SERVER
// ─────────────────────────────────────────────────────────────────────────────

const server = http.createServer(app);

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZE DATABASES & SERVICES
// ─────────────────────────────────────────────────────────────────────────────

const initializeDatabases = async() => {
    try {
        console.log(`\n${'═'.repeat(80)}`);
        console.log(`🚀 Initializing ${APP_NAME} v${APP_VERSION}`);
        console.log(`${'═'.repeat(80)}\n`);

        // PostgreSQL Connection
        console.log(`📡 Connecting to PostgreSQL...`);
        const pgConnected = await testConnection();

        // Initialize models (associations) before attempting sync
        initializeModels();

        // Sync Database (only if connected)
        if (pgConnected) {
            if (NODE_ENV === 'development') {
                console.log(`📡 Syncing PostgreSQL database...`);
                const synced = await syncDatabase(false);
                if (!synced && process.env.FORCE_DB_SYNC === 'true') {
                    console.warn(`⚠️ Initial sync failed. FORCE_DB_SYNC=true so attempting force sync (this will ALTER/CREATE tables)`);
                    await syncDatabase(true);
                }
            }
        } else {
            console.warn(`⚠️ PostgreSQL is not available. Continuing without DB in ${NODE_ENV} mode.`);
        }

        // Redis Connection
        console.log(`\n📡 Connecting to Redis...`);
        const redisConnected = await cacheService.initialize();
        if (!redisConnected) {
            console.warn(`⚠️ Redis connection failed, caching disabled`);
        }

        // MongoDB Connection (Optional)
        if (process.env.MONGODB_URL) {
            console.log(`\n📡 Connecting to MongoDB...`);
            const mongoConnected = await mongoDBService.initialize();
            if (!mongoConnected) {
                console.warn(`⚠️ MongoDB connection failed, secondary database disabled`);
            }
        } else {
            console.warn(`⚠️ MONGODB_URL not configured, MongoDB disabled`);
        }

        console.log(`\n${'═'.repeat(80)}`);
        console.log(`✅ All databases initialized successfully`);
        console.log(`${'═'.repeat(80)}\n`);

        return true;
    } catch (error) {
        console.error(`\n❌ Database initialization failed:`, error.message);
        process.exit(1);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────────────

const startServer = async() => {
    try {
        // Initialize databases
        await initializeDatabases();

        // Start listening
        server.listen(PORT, () => {
            console.log(`\n${'═'.repeat(80)}`);
            console.log(`✅ ${APP_NAME} v${APP_VERSION} is running!`);
            console.log(`${'═'.repeat(80)}`);
            console.log(`🌐 Environment: ${NODE_ENV}`);
            console.log(`🔗 Server URL: http://localhost:${PORT}`);
            console.log(`📊 Health Check: http://localhost:${PORT}/health`);
            if (process.env.SWAGGER_ENABLED === 'true') {
                console.log(`📚 API Docs: http://localhost:${PORT}${process.env.SWAGGER_PATH || '/api-docs'}`);
            }
            console.log(`${'═'.repeat(80)}\n`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
            } else {
                console.error(`❌ Server error:`, error.message);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error(`❌ Failed to start server:`, error.message);
        process.exit(1);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GRACEFUL SHUTDOWN
// ─────────────────────────────────────────────────────────────────────────────

const gracefulShutdown = async(signal) => {
    console.log(`\n⏹️ Received ${signal}, shutting down gracefully...`);

    try {
        // Stop accepting new connections
        server.close(async() => {
            console.log(`✅ HTTP server closed`);

            // Disconnect databases
            try {
                await disconnectDatabase();
                console.log(`✅ PostgreSQL disconnected`);

                if (cacheService.connected) {
                    await cacheService.disconnect();
                    console.log(`✅ Redis disconnected`);
                }

                if (process.env.MONGODB_URL) {
                    await mongoDBService.disconnect();
                    console.log(`✅ MongoDB disconnected`);
                }

                console.log(`\n✅ Graceful shutdown completed`);
                process.exit(0);
            } catch (error) {
                console.error(`❌ Error during shutdown:`, error.message);
                process.exit(1);
            }
        });

        // Force shutdown after 30 seconds
        setTimeout(() => {
            console.error(`❌ Forced shutdown after timeout`);
            process.exit(1);
        }, 30000);
    } catch (error) {
        console.error(`❌ Shutdown error:`, error.message);
        process.exit(1);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─────────────────────────────────────────────────────────────────────────────
// UNCAUGHT EXCEPTIONS
// ─────────────────────────────────────────────────────────────────────────────

process.on('uncaughtException', (error) => {
    console.error(`\n❌ Uncaught Exception:`, error);
    console.error(`Stack:`, error.stack);
    process.exit(1);
});

// ─────────────────────────────────────────────────────────────────────────────
// UNHANDLED PROMISE REJECTIONS
// ─────────────────────────────────────────────────────────────────────────────

process.on('unhandledRejection', (reason, promise) => {
    console.error(`\n❌ Unhandled Rejection at:`, promise);
    console.error(`Reason:`, reason);
    process.exit(1);
});

// ─────────────────────────────────────────────────────────────────────────────
// START APPLICATION
// ─────────────────────────────────────────────────────────────────────────────

startServer().catch((error) => {
    console.error(`❌ Fatal error:`, error.message);
    process.exit(1);
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT SERVER
// ─────────────────────────────────────────────────────────────────────────────

export default server;