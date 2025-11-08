'use strict';

import { CacheService } from '../services/CacheService.js';

export class CacheController {
    constructor() {
        this.cacheService = new CacheService();
    }

    async setCacheValue(req, res) {
        try {
            const key = req.body.key;
            const value = req.body.value;
            const ttlSeconds = req.body.ttlSeconds || null;

            const result = await this.cacheService.set(key, value, ttlSeconds);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Value cached'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getCacheValue(req, res) {
        try {
            const key = req.params.key;

            const result = await this.cacheService.get(key);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.value
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async hasCacheKey(req, res) {
        try {
            const key = req.params.key;

            const result = await this.cacheService.has(key);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                exists: result.exists
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteCacheKey(req, res) {
        try {
            const key = req.params.key;

            const result = await this.cacheService.delete(key);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Cache cleared'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async clearAllCache(req, res) {
        try {
            const result = await this.cacheService.clear();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'All cache cleared'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteByPattern(req, res) {
        try {
            const pattern = req.body.pattern;

            const result = await this.cacheService.deleteByPattern(pattern);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Cache cleared',
                deletedCount: result.deletedCount
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getByPattern(req, res) {
        try {
            const pattern = req.query.pattern;

            const result = await this.cacheService.getByPattern(pattern);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getCacheStats(req, res) {
        try {
            const result = await this.cacheService.getStats();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.stats
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getOrSetCacheValue(req, res) {
        try {
            const key = req.body.key;
            const fetchFn = req.body.fetchFn;
            const ttlSeconds = req.body.ttlSeconds || 3600;

            const result = await this.cacheService.getOrSet(key, fetchFn, ttlSeconds);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.value,
                fromCache: result.fromCache
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new CacheController();