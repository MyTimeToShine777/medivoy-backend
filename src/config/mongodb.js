'use strict';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════════
// MONGODB CONFIGURATION - OPTIONAL SECONDARY DATABASE
// Using Connection URL String
// ═══════════════════════════════════════════════════════════════════════════════

class MongoDBService {
    constructor() {
        this.connection = null;
        this.connected = false;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // INITIALIZE MONGODB CONNECTION
    // ─────────────────────────────────────────────────────────────────────────────

    async initialize() {
        try {
            if (!process.env.MONGODB_URL) {
                console.warn(`⚠️ MONGODB_URL not provided, MongoDB disabled (optional)`);
                return false;
            }

            this.connection = await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 30000,
                maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE) || 10,
                minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 2,
                retryWrites: true,
                w: 'majority',
                journal: true,
                appName: 'medivoy-backend'
            });

            this.connected = true;
            console.log(`✅ MongoDB connected successfully`);
            console.log(`   URL: ${process.env.MONGODB_URL.substring(0, 50)}...`);
            console.log(`   Database: ${this.connection.connection.name}`);

            // Setup event listeners
            this.setupEventListeners();

            return true;
        } catch (error) {
            console.error(`❌ MongoDB connection failed:`, error.message);
            this.connected = false;
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SETUP EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────────────────────

    setupEventListeners() {
        mongoose.connection.on('connected', () => {
            console.log(`✅ MongoDB connection established`);
            this.connected = true;
        });

        mongoose.connection.on('error', (error) => {
            console.error(`❌ MongoDB error:`, error.message);
            this.connected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.warn(`⚠️ MongoDB disconnected`);
            this.connected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log(`✅ MongoDB reconnected`);
            this.connected = true;
        });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DISCONNECT
    // ─────────────────────────────────────────────────────────────────────────────

    async disconnect() {
        try {
            if (this.connection) {
                await mongoose.disconnect();
                this.connected = false;
                console.log(`✅ MongoDB disconnected`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`❌ MongoDB disconnect error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET STATUS
    // ─────────────────────────────────────────────────────────────────────────────

    getStatus() {
        return {
            connected: this.connected,
            url: process.env.MONGODB_URL ? 'configured' : 'not configured'
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const mongoDBService = new MongoDBService();

export { mongoDBService, MongoDBService, mongoose };
export default mongoDBService;