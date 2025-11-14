// src/middleware/rateLimit.middleware.js
// ESM module — Redis-backed rate limiter with named exports for many presets.
// Requires: "redis" (node-redis v4). Falls back to in-memory if redis unavailable.

/**
 * Exports:
 *  - default: rateLimit(opts) -> middleware factory
 *  - createRateLimiter(opts) -> same as default (named)
 *  - authRateLimiter, globalRateLimiter, apiRateLimiter, uploadRateLimiter, deleteRateLimiter, searchRateLimiter
 *
 * opts:
 *  - windowMs (number)
 *  - max (number)
 *  - keyGenerator(req) => string
 *  - prefix (string) Redis key prefix
 *  - redisClient: an existing node-redis client instance (optional)
 *  - redisUrl: string (optional) used to create client if redisClient not provided
 */

let _redisModule = null;
async function _tryLoadRedis() {
    if (_redisModule) return _redisModule;
    try {
        _redisModule = await
        import ('redis').then(m => m);
        return _redisModule;
    } catch (e) {
        _redisModule = null;
        return null;
    }
}

// Create or validate a redis client (node-redis v4 client)
async function _getRedisClient(opts) {
    if (opts && opts.redisClient) return opts.redisClient;
    const redisMod = await _tryLoadRedis();
    if (!redisMod) return null;
    // support createClient options via redisUrl
    const url = (opts && opts.redisUrl) || process.env.REDIS_URL || null;
    if (!url) return null; // Don't create client without URL
    const client = redisMod.createClient({ url });
    // connect on first use
    client.on && client.on('error', function(err) { console.error('redis client error', err && err.stack ? err.stack : err); });
    try {
        await client.connect();
    } catch (e) {
        // if connect fails, return null to fall back
        console.error('redis.connect failed (falling back to memory):', e && e.stack ? e.stack : e);
        try { client.quit && client.quit(); } catch (_) {}
        return null;
    }
    return client;
}

// Simple in-memory fallback (per-process)
function _createInMemoryStore(windowMs) {
    const store = new Map(); // key -> { count, ts }
    // Periodic cleanup
    try {
        const interval = setInterval(function() {
            const now = Date.now();
            const cutoff = now - windowMs;
            const toRemove = [];
            store.forEach(function(val, k) {
                if (!val || val.ts <= cutoff) toRemove.push(k);
            });
            toRemove.forEach(k => store.delete(k));
        }, windowMs);
        if (interval && typeof interval.unref === 'function') interval.unref();
    } catch (e) { /* ignore */ }

    return {
        incrAndExpire: async function(key, windowSec) {
            const now = Date.now();
            const cutoffTs = now - (windowSec * 1000);
            const rec = store.get(key);
            if (!rec || rec.ts <= cutoffTs) {
                store.set(key, { count: 1, ts: now });
                return 1;
            } else {
                rec.count += 1;
                rec.ts = now;
                store.set(key, rec);
                return rec.count;
            }
        }
    };
}

/**
 * Core factory - returns an Express middleware
 */
export default function rateLimit(opts) {
    opts = opts || {};
    const windowMs = (typeof opts.windowMs === 'number') ? opts.windowMs : 60 * 1000;
    const windowSec = Math.ceil(windowMs / 1000);
    const max = (typeof opts.max === 'number') ? opts.max : 60;
    const prefix = (typeof opts.prefix === 'string') ? opts.prefix : 'rl:';
    const keyGenerator = (typeof opts.keyGenerator === 'function') ?
        opts.keyGenerator :
        function(req) {
            var ip = 'anon';
            try { if (req) ip = req.ip || (req.connection && req.connection.remoteAddress) || 'anon'; } catch (e) { ip = 'anon'; }
            var path = '/';
            try { if (req) path = req.path || req.url || '/'; } catch (e) { path = '/'; }
            return ip + ':' + path;
        };

    // redis client may be created lazily to avoid connecting at import time
    let redisClientPromise = null;
    if (opts && opts.redisClient) {
        redisClientPromise = Promise.resolve(opts.redisClient);
    } else {
        // lazy create using provided redisUrl or env
        redisClientPromise = _getRedisClient(opts);
    }

    // fallback in-memory store
    const memStore = _createInMemoryStore(windowMs);

    // middleware
    return async function(req, res, next) {
        try {
            var key;
            try { key = keyGenerator(req); } catch (e) { key = 'err:' + (req && (req.ip || 'anon')) + ':' + (req && (req.path || '/')); }

            const rkey = prefix + key;
            // try redis first
            let redis = null;
            try {
                redis = await redisClientPromise;
            } catch (e) {
                redis = null;
            }

            if (redis && typeof redis.incr === 'function') {
                try {
                    // INCR the counter, and if it's 1 set EXPIRE
                    const count = await redis.incr(rkey);
                    if (Number(count) === 1) {
                        // set expiry in seconds
                        try { await redis.expire(rkey, windowSec); } catch (e) { /* best-effort */ }
                    }
                    if (Number(count) > max) {
                        try { res.setHeader('Retry-After', String(windowSec)); } catch (_) {}
                        return res.status(429).json({ success: false, message: 'Too many requests' });
                    }
                    return next();
                } catch (e) {
                    // if redis operation fails, fall back to memory
                    console.error('redis rateLimit error, falling back to memory:', e && e.stack ? e.stack : e);
                }
            }

            // memory fallback
            const memCount = await memStore.incrAndExpire(rkey, windowSec);
            if (memCount > max) {
                try { res.setHeader('Retry-After', String(windowSec)); } catch (_) {}
                return res.status(429).json({ success: false, message: 'Too many requests' });
            }

            return next();
        } catch (err) {
            console.error('rateLimit middleware unexpected error:', err && err.stack ? err.stack : err);
            return next();
        }
    };
}

/* convenience named alias */
export function createRateLimiter(options) { return rateLimit(options); }

/* --------- Pre-configured limiters (named exports your routes expect) --------- */

/* authRateLimiter - for auth endpoints (default stricter) */
export const authRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 10,
    keyGenerator: function(req) {
        var ip = (req && (req.ip || (req.connection && req.connection.remoteAddress))) || 'anon';
        var identifier = (req && req.body && (req.body.email || req.body.username)) || '';
        return ip + ':auth:' + String(identifier || '');
    }
});

/* globalRateLimiter - site-wide (high limit) */
export const globalRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 1000,
    keyGenerator: function(req) {
        return (req && (req.ip || (req.connection && req.connection.remoteAddress))) || 'anon';
    }
});

/* apiRateLimiter - typical API */
export const apiRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 120,
    keyGenerator: function(req) {
        var ip = (req && (req.ip || (req.connection && req.connection.remoteAddress))) || 'anon';
        var path = (req && (req.path || req.url)) || '/';
        return ip + ':api:' + path;
    }
});

/* uploadRateLimiter - file uploads (low threshold) */
export const uploadRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: function(req) {
        return (req && (req.ip || (req.connection && req.connection.remoteAddress))) || 'anon';
    }
});

/* deleteRateLimiter - destructive ops, tie to user if available */
export const deleteRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: function(req) {
        var ip = (req && (req.ip || (req.connection && req.connection.remoteAddress))) || 'anon';
        var userId = (req && req.user && (req.user.id || req.user._id)) || (req && req.session && req.session.user && (req.session.user.id || req.session.user._id)) || '';
        return ip + ':delete:' + String(userId || '');
    }
});

/* searchRateLimiter - protect search endpoints */
export const searchRateLimiter = createRateLimiter({
    windowMs: 30 * 1000,
    max: 30,
    keyGenerator: function(req) {
        return (req && (req.ip || (req.connection && req.connection.remoteAddress))) || 'anon';
    }
});

/* EOF */