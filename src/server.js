'use strict';

import http from 'http';
import dotenv from 'dotenv';
import chalk from 'chalk';
import boxen from 'boxen';

dotenv.config();

import app from './app.js';
import { testConnectionWithRetry as testConnection, syncDatabase, disconnectDatabase } from './config/prisma.js';
import { cacheService } from './config/redis.js';
import { mongoDBService } from './config/mongodb.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'Medivoy Backend';
const APP_VERSION = process.env.APP_VERSION || '1.0.0';

// Connection retry configuration
const MAX_RETRIES = parseInt(process.env.DB_MAX_RETRIES) || 3;
const RETRY_DELAY = parseInt(process.env.DB_RETRY_DELAY) || 5000;
const CONNECTION_TIMEOUT = parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000;
const ALLOW_SERVER_START_WITHOUT_DB = process.env.ALLOW_SERVER_START_WITHOUT_DB === 'true';

const server = http.createServer(app);

// ═══════════════════════════════════════════════════════════════════════════════
// BEAUTIFUL CONSOLE LOG HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const log = {
    header: (text) => console.log(chalk.cyan.bold(`\n${'═'.repeat(80)}\n${text}\n${'═'.repeat(80)}`)),
    subheader: (text) => console.log(chalk.blue.bold(`\n${'─'.repeat(80)}\n${text}\n${'─'.repeat(80)}`)),
    success: (text) => console.log(chalk.green(`✅ ${text}`)),
    error: (text) => console.log(chalk.red(`❌ ${text}`)),
    warning: (text) => console.log(chalk.yellow(`⚠️  ${text}`)),
    info: (text) => console.log(chalk.blue(`ℹ️  ${text}`)),
    loading: (text) => console.log(chalk.cyan(`⏳ ${text}`)),
    retry: (text) => console.log(chalk.magenta(`🔄 ${text}`)),
    database: (text) => console.log(chalk.cyan(`📡 ${text}`)),
    box: (title, content, options = {}) => {
        const boxOptions = {
            title: title,
            titleAlignment: 'center',
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: options.color || 'cyan'
        };
        console.log(boxen(content, boxOptions));
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RETRY HELPER WITH DETAILED LOGGING - NO OPTIONAL CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

const retryWithTimeout = async(fn, maxRetries, delay, serviceName) => {
    let lastError = null;
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            log.database(`Connecting to ${chalk.bold(serviceName)}... (Attempt ${chalk.bold(attempt)}/${chalk.bold(maxRetries)})`);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Connection timeout after ${CONNECTION_TIMEOUT}ms`)), CONNECTION_TIMEOUT)
            );

            const result = await Promise.race([fn(), timeoutPromise]);

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            log.success(`${chalk.bold(serviceName)} connected successfully in ${chalk.bold(duration + 's')} (Attempt ${attempt})`);

            return { success: true, result: result, duration: duration };

        } catch (error) {
            lastError = error;
            const errorMessage = error && error.message ? error.message : 'Unknown error';
            log.error(`${chalk.bold(serviceName)} connection failed: ${chalk.dim(errorMessage)}`);

            if (attempt < maxRetries) {
                log.retry(`Retrying ${chalk.bold(serviceName)} in ${chalk.bold((delay / 1000) + 's')}...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log.error(`${chalk.bold(serviceName)} failed after ${chalk.bold(maxRetries)} attempts (${duration}s total)`);

    return { success: false, error: lastError, duration: duration };
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZE DATABASES WITH DETAILED LOGGING - NO OPTIONAL CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

const initializeDatabases = async() => {
    const results = {
        postgresql: { connected: false, duration: '0.00s', error: null },
        redis: { connected: false, duration: '0.00s', error: null },
        mongodb: { connected: false, duration: '0.00s', error: null }
    };

    try {
        // Header
        log.box(
            '🚀 SERVER INITIALIZATION',
            `${chalk.bold.cyan(APP_NAME)} ${chalk.dim('v' + APP_VERSION)}\n` +
            `Environment: ${chalk.yellow(NODE_ENV.toUpperCase())}\n` +
            `Node: ${chalk.green(process.version)}\n` +
            `Platform: ${chalk.blue(process.platform)}`
        );

        log.subheader('📊 DATABASE CONNECTIONS');

        // ─────────────────────────────────────────────────────────────────────
        // PostgreSQL Connection - NO OPTIONAL CHAINING
        // ─────────────────────────────────────────────────────────────────────

        log.info(`Initializing ${chalk.bold('PostgreSQL')} connection...`);
        const pgResult = await retryWithTimeout(testConnection, MAX_RETRIES, RETRY_DELAY, 'PostgreSQL');

        results.postgresql.connected = pgResult.success;
        results.postgresql.duration = pgResult.duration + 's';
        results.postgresql.error = pgResult.error && pgResult.error.message ? pgResult.error.message : null;

        if (pgResult.success) {
            // Models are now handled by Prisma Client
            log.info(`Using Prisma Client for database models`);
            log.success('Prisma Client ready');

            if (NODE_ENV === 'development' && process.env.DB_SYNC_ENABLED !== 'false') {
                log.info('Syncing database schema...');
                try {
                    await syncDatabase(false);
                    log.success('Database schema synced');
                } catch (error) {
                    const errorMessage = error && error.message ? error.message : 'Unknown error';
                    log.warning(`Schema sync failed: ${errorMessage}`);
                }
            }
        } else {
            log.warning(`PostgreSQL unavailable - ${chalk.dim('some features may not work')}`);
            if (!ALLOW_SERVER_START_WITHOUT_DB) {
                throw new Error('PostgreSQL is required but unavailable');
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // Redis Connection - NO OPTIONAL CHAINING
        // ─────────────────────────────────────────────────────────────────────

        if (process.env.REDIS_URL || process.env.REDIS_HOST) {
            log.info(`Initializing ${chalk.bold('Redis')} connection...`);
            const redisResult = await retryWithTimeout(() => cacheService.initialize(), MAX_RETRIES, RETRY_DELAY, 'Redis');

            results.redis.connected = redisResult.success;
            results.redis.duration = redisResult.duration + 's';
            results.redis.error = redisResult.error && redisResult.error.message ? redisResult.error.message : null;

            if (!redisResult.success) {
                log.warning(`Redis unavailable - ${chalk.dim('caching disabled')}`);
            }
        } else {
            log.info(`Redis not configured - ${chalk.dim('skipping')}`);
        }

        // ─────────────────────────────────────────────────────────────────────
        // MongoDB Connection - NO OPTIONAL CHAINING
        // ─────────────────────────────────────────────────────────────────────

        if (process.env.MONGODB_URL) {
            log.info(`Initializing ${chalk.bold('MongoDB')} connection...`);
            const mongoResult = await retryWithTimeout(() => mongoDBService.initialize(), MAX_RETRIES, RETRY_DELAY, 'MongoDB');

            results.mongodb.connected = mongoResult.success;
            results.mongodb.duration = mongoResult.duration + 's';
            results.mongodb.error = mongoResult.error && mongoResult.error.message ? mongoResult.error.message : null;

            if (!mongoResult.success) {
                log.warning(`MongoDB unavailable - ${chalk.dim('secondary storage disabled')}`);
            }
        } else {
            log.info(`MongoDB not configured - ${chalk.dim('skipping')}`);
        }

        // ─────────────────────────────────────────────────────────────────────
        // Connection Summary - NO OPTIONAL CHAINING
        // ─────────────────────────────────────────────────────────────────────

        const summaryLines = [
            `${chalk.bold('PostgreSQL:')} ${results.postgresql.connected ? chalk.green('✅ Connected') : chalk.red('❌ Disconnected')} ${chalk.dim('(' + results.postgresql.duration + ')')}`,
            results.postgresql.error ? chalk.dim('   ↳ ' + results.postgresql.error) : '',
            '',
            `${chalk.bold('Redis:     ')} ${results.redis.connected ? chalk.green('✅ Connected') : chalk.red('❌ Disconnected')} ${chalk.dim('(' + results.redis.duration + ')')}`,
            results.redis.error ? chalk.dim('   ↳ ' + results.redis.error) : '',
            '',
            `${chalk.bold('MongoDB:   ')} ${results.mongodb.connected ? chalk.green('✅ Connected') : chalk.red('❌ Disconnected')} ${chalk.dim('(' + results.mongodb.duration + ')')}`,
            results.mongodb.error ? chalk.dim('   ↳ ' + results.mongodb.error) : ''
        ];

        const summaryContent = summaryLines.filter(line => line !== '').join('\n');

        log.box(
            '📊 CONNECTION SUMMARY',
            summaryContent, { borderColor: results.postgresql.connected ? 'green' : 'yellow' }
        );

        return results;

    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        log.error(`Database initialization failed: ${errorMessage}`);

        if (ALLOW_SERVER_START_WITHOUT_DB) {
            log.warning('Starting server without database connections');
            return results;
        }

        log.error('Server startup aborted. Set ALLOW_SERVER_START_WITHOUT_DB=true to start anyway.');
        process.exit(1);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER WITH BEAUTIFUL LOGS - NO OPTIONAL CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

const startServer = async() => {
        try {
            const connections = await initializeDatabases();
            const startTime = Date.now();

            server.listen(PORT, () => {
                        const bootTime = ((Date.now() - startTime) / 1000).toFixed(2);

                        const serverInfoLines = [
                                `${chalk.bold('Status:     ')} ${chalk.green('🟢 RUNNING')}`,
                                `${chalk.bold('Environment:')} ${chalk.yellow(NODE_ENV.toUpperCase())}`,
                                `${chalk.bold('Port:       ')} ${chalk.cyan(PORT)}`,
                                `${chalk.bold('Boot Time:  ')} ${chalk.magenta(bootTime + 's')}`,
                                '',
                                `${chalk.bold('Endpoints:')}`,
                                `  ${chalk.cyan('→')} Server:  ${chalk.underline(`http://localhost:${PORT}`)}`,
                `  ${chalk.cyan('→')} Health:  ${chalk.underline(`http://localhost:${PORT}/health`)}`,
                process.env.SWAGGER_ENABLED === 'true' 
                    ? `  ${chalk.cyan('→')} Docs:    ${chalk.underline(`http://localhost:${PORT}${process.env.SWAGGER_PATH || '/api-docs'}`)}` 
                    : ''
            ];

            const serverInfo = serverInfoLines.filter(line => line !== '').join('\n');

            log.box(
                `✅ ${APP_NAME.toUpperCase()} v${APP_VERSION}`,
                serverInfo,
                { borderColor: 'green' }
            );

            // Warnings if services are down
            if (!connections.postgresql.connected) {
                log.warning('Server running in degraded mode - PostgreSQL unavailable');
            }
            if (!connections.redis.connected) {
                log.warning('Caching layer disabled - Redis unavailable');
            }

            log.success(chalk.bold('Server is ready to accept connections! 🚀\n'));
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                log.error(`Port ${PORT} is already in use`);
            } else {
                const errorMessage = error && error.message ? error.message : 'Unknown error';
                log.error(`Server error: ${errorMessage}`);
            }
            process.exit(1);
        });

    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        log.error(`Failed to start server: ${errorMessage}`);
        process.exit(1);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN WITH DETAILED LOGGING - NO OPTIONAL CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

const gracefulShutdown = async (signal) => {
    log.box(
        '⏹️  GRACEFUL SHUTDOWN',
        `Signal: ${chalk.yellow(signal)}\nClosing server connections...`,
        { borderColor: 'yellow' }
    );

    server.close(async () => {
        log.success('HTTP server closed');

        const shutdownTasks = [];

        if (server.listening) {
            shutdownTasks.push(
                disconnectDatabase()
                    .then(() => log.success('PostgreSQL disconnected'))
                    .catch(err => {
                        const errorMessage = err && err.message ? err.message : 'Unknown error';
                        log.error(`PostgreSQL disconnect failed: ${errorMessage}`);
                    })
            );
        }

        if (cacheService && cacheService.connected) {
            shutdownTasks.push(
                cacheService.disconnect()
                    .then(() => log.success('Redis disconnected'))
                    .catch(err => {
                        const errorMessage = err && err.message ? err.message : 'Unknown error';
                        log.error(`Redis disconnect failed: ${errorMessage}`);
                    })
            );
        }

        if (process.env.MONGODB_URL && mongoDBService) {
            shutdownTasks.push(
                mongoDBService.disconnect()
                    .then(() => log.success('MongoDB disconnected'))
                    .catch(err => {
                        const errorMessage = err && err.message ? err.message : 'Unknown error';
                        log.error(`MongoDB disconnect failed: ${errorMessage}`);
                    })
            );
        }

        await Promise.allSettled(shutdownTasks);

        log.box(
            '✅ SHUTDOWN COMPLETE',
            'All connections closed successfully',
            { borderColor: 'green' }
        );
        
        process.exit(0);
    });

    setTimeout(() => {
        log.error('Forced shutdown after 30s timeout');
        process.exit(1);
    }, 30000);
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESS EVENT HANDLERS - NO OPTIONAL CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
    const errorMessage = error && error.message ? error.message : 'Unknown error';
    log.error(`Uncaught Exception: ${errorMessage}`);
    if (error && error.stack) {
        console.error(error.stack);
    }
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason) => {
    const errorMessage = reason && typeof reason === 'object' && reason.message 
        ? reason.message 
        : String(reason);
    log.error(`Unhandled Rejection: ${errorMessage}`);
    gracefulShutdown('UNHANDLED_REJECTION');
});

// ═══════════════════════════════════════════════════════════════════════════════
// START APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

startServer();

export default server;