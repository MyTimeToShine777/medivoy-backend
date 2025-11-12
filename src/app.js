'use strict';

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

// Xata connection - schema managed via Xata dashboard, NOT sequelize.sync()
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,

        pool: {
            max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
            min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
            acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
            idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000
        },

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 10000,
            keepAlive: true,
            statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT, 10) || 30000,
            idle_in_transaction_session_timeout: parseInt(process.env.DB_IDLE_TRANSACTION_TIMEOUT, 10) || 30000
        },

        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        },

        retry: {
            max: 3,
            timeout: 3000,
            match: [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/,
                /ECONNREFUSED/,
                /ETIMEDOUT/,
                /EHOSTUNREACH/
            ]
        },

        benchmark: process.env.NODE_ENV === 'development',
        logQueryParameters: process.env.NODE_ENV === 'development'
    });

    console.log('🔗 Using DATABASE_URL for Xata connection');
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'medivoy',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'password', {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            dialect: 'postgres',
            logging: process.env.DB_LOGGING === 'true' ? console.log : false,

            pool: {
                max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
                min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
                acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
                idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000
            },

            dialectOptions: {
                ssl: process.env.DB_SSL === 'true' ? {
                    require: true,
                    rejectUnauthorized: false
                } : false,
                connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 10000,
                keepAlive: true,
                statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT, 10) || 30000,
                idle_in_transaction_session_timeout: parseInt(process.env.DB_IDLE_TRANSACTION_TIMEOUT, 10) || 30000
            },

            define: {
                timestamps: true,
                underscored: true,
                freezeTableName: true
            },

            retry: {
                max: 3,
                timeout: 3000,
                match: [
                    /SequelizeConnectionError/,
                    /SequelizeConnectionRefusedError/,
                    /SequelizeHostNotFoundError/,
                    /SequelizeHostNotReachableError/,
                    /SequelizeInvalidConnectionError/,
                    /SequelizeConnectionTimedOutError/,
                    /ECONNREFUSED/,
                    /ETIMEDOUT/,
                    /EHOSTUNREACH/
                ]
            },

            benchmark: process.env.NODE_ENV === 'development',
            logQueryParameters: process.env.NODE_ENV === 'development'
        }
    );

    console.log('🔗 Using individual credentials for connection');
}

const parseDatabaseUrl = (url) => {
    try {
        if (!url) return null;
        const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/(.+?)(?:\?(.*))?$/;
        const match = url.match(urlPattern);
        if (match) {
            return {
                user: match[1],
                password: match[2],
                host: match[3],
                port: match[4] || '5432',
                database: match[5].split(':')[0]
            };
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const testConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log(`✅ PostgreSQL connection established successfully`);

        let dbInfo;
        if (process.env.DATABASE_URL) {
            const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
            if (parsed) {
                dbInfo = {
                    host: parsed.host,
                    port: parsed.port,
                    database: parsed.database,
                    user: parsed.user
                };
            } else {
                dbInfo = {
                    host: 'parsed from URL',
                    port: 'parsed from URL',
                    database: 'parsed from URL',
                    user: 'parsed from URL'
                };
            }
        } else {
            dbInfo = {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                database: process.env.DB_NAME || 'medivoy',
                user: process.env.DB_USER || 'postgres'
            };
        }

        console.log(`   Host: ${dbInfo.host}:${dbInfo.port}`);
        console.log(`   Database: ${dbInfo.database}`);
        console.log(`   User: ${dbInfo.user}`);
        return true;
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown connection error';
        console.error(`❌ Unable to connect to PostgreSQL: ${errorMessage}`);
        throw error;
    }
};

export const testConnectionWithRetry = async(maxRetries = 3, retryDelay = 5000) => {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📡 Connecting to PostgreSQL... (Attempt ${attempt}/${maxRetries})`);
            const result = await testConnection();
            return result;
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                console.log(`🔄 Retrying PostgreSQL in ${retryDelay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    console.error(`❌ PostgreSQL failed after ${maxRetries} attempts`);
    throw lastError;
};

// REMOVED sync functionality - Xata manages schema via dashboard
export const syncDatabase = async() => {
    console.log(`⚠️  Xata detected - schema managed via Xata dashboard`);
    console.log(`⚠️  Sequelize sync disabled (not supported on Xata)`);
    console.log(`✅ Using existing Xata schema`);
    return true;
};

export const checkDatabaseHealth = async() => {
    try {
        const result = await sequelize.query('SELECT NOW() as current_time, version() as version', {
            type: Sequelize.QueryTypes.SELECT
        });
        if (result && result.length > 0) {
            const info = result[0];
            console.log(`✅ Database health check passed`);
            console.log(`   Current Time: ${info.current_time}`);
            return { healthy: true, info: info };
        }
        return { healthy: false, error: 'No response from database' };
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        console.error(`❌ Database health check failed: ${errorMessage}`);
        return { healthy: false, error: errorMessage };
    }
};

export const disconnectDatabase = async() => {
    try {
        await sequelize.close();
        console.log(`✅ PostgreSQL disconnected successfully`);
        return true;
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        console.error(`❌ Database disconnect failed: ${errorMessage}`);
        throw error;
    }
};

export const gracefulShutdown = async() => {
    try {
        console.log(`\n🔄 Initiating graceful database shutdown...`);
        await sequelize.close();
        console.log(`✅ Database connections closed successfully`);
        return true;
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        console.error(`❌ Error during graceful shutdown: ${errorMessage}`);
        return false;
    }
};

export { sequelize, Sequelize };
export default sequelize;