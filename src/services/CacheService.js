'use strict';

import { AppError } from '../utils/errors/AppError.js';

export class CacheService {
    constructor() {
        this.cache = new Map();
        this.ttl = new Map();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CACHE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async set(key, value, ttlSeconds = null) {
        try {
            if (!key || value === undefined) {
                return { success: false, error: 'Key and value required' };
            }

            this.cache.set(key, value);

            if (ttlSeconds) {
                const expiresAt = Date.now() + (ttlSeconds * 1000);
                this.ttl.set(key, expiresAt);

                // Auto-delete expired key
                setTimeout(() => {
                    this.cache.delete(key);
                    this.ttl.delete(key);
                }, ttlSeconds * 1000);
            }

            return { success: true, message: 'Value cached' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async get(key) {
        try {
            if (!key) {
                return { success: false, error: 'Key required' };
            }

            // Check if expired
            const expiresAt = this.ttl.get(key);
            if (expiresAt && Date.now() > expiresAt) {
                this.cache.delete(key);
                this.ttl.delete(key);
                return { success: true, value: null };
            }

            const value = this.cache.get(key);
            return { success: true, value: value };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async has(key) {
        try {
            if (!key) {
                return { success: false, error: 'Key required' };
            }

            // Check if expired
            const expiresAt = this.ttl.get(key);
            if (expiresAt && Date.now() > expiresAt) {
                this.cache.delete(key);
                this.ttl.delete(key);
                return { success: true, exists: false };
            }

            const exists = this.cache.has(key);
            return { success: true, exists: exists };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async delete(key) {
        try {
            if (!key) {
                return { success: false, error: 'Key required' };
            }

            this.cache.delete(key);
            this.ttl.delete(key);

            return { success: true, message: 'Cached value deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async clear() {
        try {
            this.cache.clear();
            this.ttl.clear();

            return { success: true, message: 'Cache cleared' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PATTERN-BASED CACHE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async deleteByPattern(pattern) {
        try {
            if (!pattern) {
                return { success: false, error: 'Pattern required' };
            }

            const regex = new RegExp(pattern);
            let deletedCount = 0;

            for (const key of this.cache.keys()) {
                if (regex.test(key)) {
                    this.cache.delete(key);
                    this.ttl.delete(key);
                    deletedCount++;
                }
            }

            return { success: true, message: 'Matched cache cleared', deletedCount: deletedCount };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getByPattern(pattern) {
        try {
            if (!pattern) {
                return { success: false, error: 'Pattern required' };
            }

            const regex = new RegExp(pattern);
            const results = {};

            for (const [key, value] of this.cache.entries()) {
                if (regex.test(key)) {
                    results[key] = value;
                }
            }

            return { success: true, data: results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CACHE STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getStats() {
        try {
            return {
                success: true,
                stats: {
                    totalKeys: this.cache.size,
                    keys: Array.from(this.cache.keys()),
                    memorySizeBytes: JSON.stringify(Object.fromEntries(this.cache)).length
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CACHE WRAPPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getOrSet(key, fetchFn, ttlSeconds = 3600) {
        try {
            if (!key || !fetchFn) {
                return { success: false, error: 'Key and fetch function required' };
            }

            const cached = await this.get(key);
            if (cached.value) {
                return { success: true, value: cached.value, fromCache: true };
            }

            const freshValue = await fetchFn();
            await this.set(key, freshValue, ttlSeconds);

            return { success: true, value: freshValue, fromCache: false };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new CacheService();