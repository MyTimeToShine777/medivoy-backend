'use strict';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class MongoDBService {
    constructor() {
        this.connection = null;
        this.connected = false;
        this._listenersAttached = false;
    }

    // Initialize with retries and exponential backoff
    async initialize(options) {
        options = options || {};
        const uri = options.uri || process.env.MONGODB_URL || '';
        if (!uri) {
            console.warn('⚠️ MONGODB_URL not provided, MongoDB disabled (optional)');
            return false;
        }

        const maxRetries = Number(options.maxRetries || process.env.MONGO_CONNECT_RETRIES || 3);
        const initialDelayMs = Number(options.initialDelayMs || process.env.MONGO_RETRY_DELAY_MS || 2000);
        const serverSelectionTimeoutMS = Number(options.serverSelectionTimeoutMS || process.env.MONGO_CONNECT_TIMEOUT_MS || 10000);
        const maxPoolSize = Number(options.maxPoolSize || process.env.MONGODB_POOL_SIZE || 10);
        let attempt = 0;
        let lastErr = null;

        this._attachEventListeners();

        while (attempt < maxRetries) {
            attempt += 1;
            try {
                console.log(`📡 Connecting to MongoDB... (Attempt ${attempt}/${maxRetries})`);
                this.connection = await mongoose.connect(uri, {
                    serverSelectionTimeoutMS: serverSelectionTimeoutMS,
                    maxPoolSize: maxPoolSize
                });
                this.connected = true;
                console.log('✅ MongoDB connected successfully');
                console.log('   URL:', uri.length > 60 ? `${uri.slice(0, 60)}...` : uri);
                console.log('   Database:', (this.connection && this.connection.name) || '(unknown)');
                return true;
            } catch (err) {
                lastErr = err;
                this.connected = false;
                console.error(`❌ MongoDB connection failed (attempt ${attempt}):`, err && err.message ? err.message : err);
                if (attempt >= maxRetries) {
                    console.error('⛔ All MongoDB connection attempts failed.');
                    return false;
                }
                // exponential backoff with jitter
                let backoff = initialDelayMs * Math.pow(2, attempt - 1);
                const jitter = Math.floor(Math.random() * Math.max(1, Math.floor(backoff * 0.2)));
                backoff = Math.random() < 0.5 ? Math.max(0, backoff - jitter) : backoff + jitter;
                console.log(`⏳ Retrying MongoDB connection in ${backoff} ms...`);
                await new Promise((r) => setTimeout(r, backoff));
            }
        }

        // shouldn't reach here, but return false on failure
        console.error('❌ MongoDB initialization failed:', lastErr && lastErr.message ? lastErr.message : lastErr);
        return false;
    }

    _attachEventListeners() {
        if (this._listenersAttached) return;
        this._listenersAttached = true;

        try {
            const conn = mongoose.connection;

            conn.on('connected', () => {
                console.log('🟢 Mongoose event: connected');
                this.connected = true;
            });

            conn.on('reconnected', () => {
                console.log('🔁 Mongoose event: reconnected');
                this.connected = true;
            });

            conn.on('error', (err) => {
                console.error('❗ Mongoose event: error', err && err.message ? err.message : err);
                this.connected = false;
            });

            conn.on('disconnected', () => {
                console.warn('⚠️ Mongoose event: disconnected');
                this.connected = false;
            });

            conn.on('close', () => {
                console.warn('Mongoose event: close');
                this.connected = false;
            });
        } catch (err) {
            console.error('Failed to attach mongoose listeners:', err && err.message ? err.message : err);
        }
    }

    async disconnect() {
        try {
            if (mongoose && mongoose.connection && mongoose.connection.readyState) {
                await mongoose.disconnect();
                this.connected = false;
                console.log('✅ MongoDB disconnected');
                return true;
            }
            return false;
        } catch (err) {
            console.error('❌ MongoDB disconnect error:', err && err.message ? err.message : err);
            return false;
        }
    }

    getStatus() {
        return {
            connected: !!this.connected,
            url: process.env.MONGODB_URL ? 'configured' : 'not configured',
            readyState: (mongoose && mongoose.connection && mongoose.connection.readyState) || 0
        };
    }
}

const mongoDBService = new MongoDBService();

export { mongoDBService, MongoDBService, mongoose };
export default mongoDBService;