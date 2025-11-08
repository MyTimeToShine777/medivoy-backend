'use strict';

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════════
// POSTGRESQL DATABASE CONFIGURATION - PRODUCTION READY
// ═══════════════════════════════════════════════════════════════════════════════

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    timezone: process.env.DB_TIMEZONE || '+05:30',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
        max: parseInt(process.env.DB_POOL_MAX) || 10,
        min: parseInt(process.env.DB_POOL_MIN) || 2,
        acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
        idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        connectTimeout: 30000,
        statement_timeout: 120000
    },
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: false
    },
    retry: {
        max: 3,
        timeout: 5000
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST CONNECTION
// ─────────────────────────────────────────────────────────────────────────────

const testConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log(`✅ PostgreSQL connection established successfully`);
        console.log(`   URL: ${process.env.DATABASE_URL.substring(0, 50)}...`);
        return true;
    } catch (error) {
        console.error(`❌ PostgreSQL connection failed:`, error.message);
        // In production we want to fail fast. In non-production environments
        // continue startup but report the failure so developers can work
        // without an available DB (useful for quick dev/test iterations).
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        return false;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SYNC DATABASE
// ─────────────────────────────────────────────────────────────────────────────

const syncDatabase = async(force = false) => {
    try {
        if (process.env.NODE_ENV === 'production' && force) {
            console.error(`❌ Cannot force sync in production!`);
            return false;
        }

        await sequelize.sync({
            force: force,
            alter: !force,
            logging: process.env.DB_LOGGING === 'true' ? console.log : false
        });

        console.log(`✅ PostgreSQL database synchronized successfully`);
        return true;
    } catch (error) {
        console.error(`❌ Database sync failed:`, error.message);
        return false;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DISCONNECT
// ─────────────────────────────────────────────────────────────────────────────

const disconnectDatabase = async() => {
    try {
        await sequelize.close();
        console.log(`✅ PostgreSQL disconnected`);
        return true;
    } catch (error) {
        console.error(`❌ PostgreSQL disconnect error:`, error.message);
        return false;
    }
};

// Note: Sequelize instances don't emit 'error'/'disconnect'/'reconnect' events like
// some database drivers do. If you need connection lifecycle hooks, attach them
// to the underlying driver or use Sequelize hooks. For now we keep connection
// handling simple and rely on authenticate()/sync()/close() above.

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export {
    sequelize,
    testConnection,
    syncDatabase,
    disconnectDatabase
};

export default sequelize;