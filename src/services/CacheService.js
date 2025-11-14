'use strict';

/**
 * CacheService - In-memory caching with TTL support
 * Production-ready caching for performance optimization
 */
class CacheService {
    constructor() {
        this.cache = new Map();
        this.ttl = new Map();
    }

    /**
     * Set cache value with optional TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number|null} ttlSeconds - Time to live in seconds
     * @returns {Object} {success: boolean, message: string}
     */
    async set(key, value, ttlSeconds = null) {
        try {
            if (!key || value === undefined) {
                return {
                    success: false,
                    error: 'Key and value are required'
                };
            }

            this.cache.set(key, value);

            if (ttlSeconds && ttlSeconds > 0) {
                const expiresAt = Date.now() + (ttlSeconds * 1000);
                this.ttl.set(key, expiresAt);

                // Auto-expire key
                setTimeout(() => {
                    this.delete(key);
                }, ttlSeconds * 1000);
            }

            return {
                success: true,
                message: 'Value cached successfully'
            };
        } catch (error) {
            console.error('Cache set error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get cached value
     * @param {string} key - Cache key
     * @returns {Object} {success: boolean, value: any}
     */
    async get(key) {
        try {
            if (!key) {
                return {
                    success: false,
                    error: 'Key is required'
                };
            }

            // Check if expired
            const expiresAt = this.ttl.get(key);
            if (expiresAt && Date.now() > expiresAt) {
                this.delete(key);
                return {
                    success: true,
                    value: null
                };
            }

            const value = this.cache.get(key);
            return {
                success: true,
                value: value !== undefined ? value : null
            };
        } catch (error) {
            console.error('Cache get error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {Object} {success: boolean, exists: boolean}
     */
    async has(key) {
        try {
            if (!key) {
                return {
                    success: false,
                    error: 'Key is required'
                };
            }

            // Check if expired
            const expiresAt = this.ttl.get(key);
            if (expiresAt && Date.now() > expiresAt) {
                this.delete(key);
                return {
                    success: true,
                    exists: false
                };
            }

            return {
                success: true,
                exists: this.cache.has(key)
            };
        } catch (error) {
            console.error('Cache has error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete cached value
     * @param {string} key - Cache key
     * @returns {Object} {success: boolean, message: string}
     */
    async delete(key) {
        try {
            if (!key) {
                return {
                    success: false,
                    error: 'Key is required'
                };
            }

            this.cache.delete(key);
            this.ttl.delete(key);

            return {
                success: true,
                message: 'Key deleted successfully'
            };
        } catch (error) {
            console.error('Cache delete error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Clear all cached values
     * @returns {Object} {success: boolean, message: string}
     */
    async clear() {
        try {
            this.cache.clear();
            this.ttl.clear();

            return {
                success: true,
                message: 'Cache cleared successfully'
            };
        } catch (error) {
            console.error('Cache clear error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get all cache keys
     * @returns {Object} {success: boolean, keys: array}
     */
    async keys() {
        try {
            // Remove expired keys first
            const now = Date.now();
            for (const [key, expiresAt] of this.ttl.entries()) {
                if (now > expiresAt) {
                    this.delete(key);
                }
            }

            return {
                success: true,
                keys: Array.from(this.cache.keys())
            };
        } catch (error) {
            console.error('Cache keys error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get cache size
     * @returns {Object} {success: boolean, size: number}
     */
    async size() {
        try {
            return {
                success: true,
                size: this.cache.size
            };
        } catch (error) {
            console.error('Cache size error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export const cacheService = new CacheService();
export default cacheService;
