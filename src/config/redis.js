'use strict';

import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════════
// REDIS CACHE CONFIGURATION - PRODUCTION READY
// ═══════════════════════════════════════════════════════════════════════════════

class CacheService {
    constructor() {
        this.client = null;
        this.subscriber = null;
        this.publisher = null;
        this.connected = false;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // INITIALIZE REDIS CONNECTION
    // ─────────────────────────────────────────────────────────────────────────────

    async initialize() {
        try {
            if (!process.env.REDIS_URL) {
                console.warn(`⚠️ REDIS_URL not provided, Redis disabled`);
                return false;
            }

            this.client = redis.createClient({
                url: process.env.REDIS_URL,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 10) {
                            console.error(`❌ Redis max reconnection attempts exceeded`);
                            return new Error('Redis max reconnection attempts exceeded');
                        }
                        return Math.min(retries * 50, 500);
                    },
                    connectTimeout: 10000,
                    keepAlive: 30000
                }
            });

            // Error handler
            this.client.on('error', (error) => {
                console.error(`❌ Redis error:`, error.message);
                this.connected = false;
            });

            // Connection handler
            this.client.on('connect', () => {
                console.log(`✅ Redis connected successfully`);
                console.log(`   URL: ${process.env.REDIS_URL.substring(0, 50)}...`);
                this.connected = true;
            });

            // Ready handler
            this.client.on('ready', () => {
                console.log(`✅ Redis ready for commands`);
            });

            // Reconnect handler
            this.client.on('reconnecting', () => {
                console.warn(`⚠️ Redis reconnecting...`);
                this.connected = false;
            });

            // Connect
            await this.client.connect();

            // Test connection
            await this.client.ping();
            console.log(`✅ Redis ping successful`);

            // Initialize Pub/Sub
            await this.initializePubSub();

            return true;
        } catch (error) {
            console.error(`❌ Redis initialization failed:`, error.message);
            this.connected = false;
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // INITIALIZE PUB/SUB
    // ─────────────────────────────────────────────────────────────────────────────

    async initializePubSub() {
        try {
            this.subscriber = this.client.duplicate();
            this.publisher = this.client.duplicate();

            await this.subscriber.connect();
            await this.publisher.connect();

            console.log(`✅ Redis Pub/Sub initialized`);
            return true;
        } catch (error) {
            console.error(`❌ Redis Pub/Sub initialization failed:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SET VALUE
    // ─────────────────────────────────────────────────────────────────────────────

    async set(key, value, ttl = null) {
        try {
            if (!this.connected) {
                console.warn(`⚠️ Redis not connected, skipping set`);
                return false;
            }

            const serialized = JSON.stringify(value);

            if (ttl) {
                await this.client.setEx(key, ttl, serialized);
            } else {
                await this.client.set(key, serialized);
            }

            console.log(`✅ Redis set: ${key} (TTL: ${ttl ? ttl + 's' : 'infinite'})`);
            return true;
        } catch (error) {
            console.error(`❌ Redis set error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET VALUE
    // ─────────────────────────────────────────────────────────────────────────────

    async get(key) {
        try {
            if (!this.connected) {
                console.warn(`⚠️ Redis not connected, returning null`);
                return null;
            }

            const value = await this.client.get(key);
            if (value) {
                console.log(`✅ Redis get: ${key}`);
                return JSON.parse(value);
            }

            return null;
        } catch (error) {
            console.error(`❌ Redis get error:`, error.message);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE VALUE
    // ─────────────────────────────────────────────────────────────────────────────

    async delete(key) {
        try {
            if (!this.connected) {
                console.warn(`⚠️ Redis not connected, skipping delete`);
                return false;
            }

            const result = await this.client.del(key);
            console.log(`✅ Redis delete: ${key}`);
            return result > 0;
        } catch (error) {
            console.error(`❌ Redis delete error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // EXISTS KEY
    // ─────────────────────────────────────────────────────────────────────────────

    async exists(key) {
        try {
            if (!this.connected) return false;
            const result = await this.client.exists(key);
            return result > 0;
        } catch (error) {
            console.error(`❌ Redis exists error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // INCREMENT VALUE
    // ─────────────────────────────────────────────────────────────────────────────

    async increment(key, amount = 1) {
        try {
            if (!this.connected) return null;
            const result = await this.client.incrBy(key, amount);
            console.log(`✅ Redis increment: ${key} by ${amount}`);
            return result;
        } catch (error) {
            console.error(`❌ Redis increment error:`, error.message);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DECREMENT VALUE
    // ─────────────────────────────────────────────────────────────────────────────

    async decrement(key, amount = 1) {
        try {
            if (!this.connected) return null;
            const result = await this.client.decrBy(key, amount);
            console.log(`✅ Redis decrement: ${key} by ${amount}`);
            return result;
        } catch (error) {
            console.error(`❌ Redis decrement error:`, error.message);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // APPEND VALUE
    // ─────────────────────────────────────────────────────────────────────────────

    async append(key, value) {
        try {
            if (!this.connected) return false;
            const serialized = JSON.stringify(value);
            await this.client.append(key, serialized);
            console.log(`✅ Redis append: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Redis append error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PUBLISH MESSAGE
    // ─────────────────────────────────────────────────────────────────────────────

    async publish(channel, message) {
        try {
            if (!this.publisher) return false;
            const result = await this.publisher.publish(channel, JSON.stringify(message));
            console.log(`✅ Redis publish: ${channel} (subscribers: ${result})`);
            return result > 0;
        } catch (error) {
            console.error(`❌ Redis publish error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SUBSCRIBE TO CHANNEL
    // ─────────────────────────────────────────────────────────────────────────────

    async subscribe(channel, callback) {
        try {
            if (!this.subscriber) return false;

            await this.subscriber.subscribe(channel, (message) => {
                console.log(`✅ Redis message received on ${channel}`);
                if (callback) callback(JSON.parse(message));
            });

            console.log(`✅ Redis subscribed to: ${channel}`);
            return true;
        } catch (error) {
            console.error(`❌ Redis subscribe error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // FLUSH ALL CACHE
    // ─────────────────────────────────────────────────────────────────────────────

    async flushAll() {
        try {
            if (!this.connected) {
                console.warn(`⚠️ Redis not connected, skipping flush`);
                return false;
            }

            await this.client.flushAll();
            console.log(`✅ Redis cache flushed`);
            return true;
        } catch (error) {
            console.error(`❌ Redis flush error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET REDIS INFO
    // ─────────────────────────────────────────────────────────────────────────────

    async getInfo() {
        try {
            if (!this.connected) return null;
            const info = await this.client.info();
            console.log(`✅ Redis info retrieved`);
            return info;
        } catch (error) {
            console.error(`❌ Redis info error:`, error.message);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DISCONNECT
    // ─────────────────────────────────────────────────────────────────────────────

    async disconnect() {
        try {
            if (this.subscriber) await this.subscriber.quit();
            if (this.publisher) await this.publisher.quit();
            if (this.client) await this.client.quit();

            this.connected = false;
            console.log(`✅ Redis disconnected`);
            return true;
        } catch (error) {
            console.error(`❌ Redis disconnect error:`, error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET STATUS
    // ─────────────────────────────────────────────────────────────────────────────

    getStatus() {
        return {
            connected: this.connected,
            ready: this.client ? !this.client.isOpen : false
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const cacheService = new CacheService();

export { cacheService, CacheService };
export default cacheService;