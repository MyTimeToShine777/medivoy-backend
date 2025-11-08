// src/middleware/cache.middleware.js
// ESM module providing named export `cacheMiddleware` and default `cache`.
// Safe, production-minded, no optional chaining.

/**
 * Options:
 *  - headerValue: string for Cache-Control (default: 'no-cache, no-store, must-revalidate')
 *  - etagFn: function(req, res) -> string  (optional) - if provided, middleware will set ETag header
 *  - setTTLHeader: boolean (if true set X-Cache-TTL header with TTL seconds)
 *  - ttlSeconds: number (used with setTTLHeader), default 0 (no TTL)
 *
 * Usage:
 *  import { cacheMiddleware } from './middleware/cache.middleware.js';
 *  app.use(cacheMiddleware({ headerValue: 'public, max-age=3600', etagFn: (req,res)=> 'v1' }));
 *
 *  // default export:
 *  import cache from './middleware/cache.middleware.js';
 *  app.use(cache('public, max-age=3600'));
 */

function _normalizeOptions(opts) {
    opts = opts || {};
    return {
        headerValue: typeof opts.headerValue === 'string' ? opts.headerValue : (typeof opts === 'string' ? opts : 'no-cache, no-store, must-revalidate'),
        etagFn: typeof opts.etagFn === 'function' ? opts.etagFn : null,
        setTTLHeader: !!opts.setTTLHeader,
        ttlSeconds: typeof opts.ttlSeconds === 'number' ? Math.max(0, Math.floor(opts.ttlSeconds)) : 0
    };
}

/**
 * Named factory: cacheMiddleware(options)
 * Returns an Express middleware that sets Cache-Control and optional ETag/TTL headers.
 */
export function cacheMiddleware(options) {
    var cfg = _normalizeOptions(options);

    return function(req, res, next) {
        try {
            // Set Cache-Control header
            try { res.setHeader('Cache-Control', cfg.headerValue); } catch (e) { /* best effort */ }

            // If ETag function provided, compute and set ETag
            if (cfg.etagFn) {
                try {
                    var etag = cfg.etagFn(req, res);
                    if (etag) {
                        try { res.setHeader('ETag', String(etag)); } catch (e) { /* ignore */ }
                    }
                } catch (e) {
                    // don't break request if etagFn fails
                    console.error('cache.middleware: etagFn error', e && e.stack ? e.stack : e);
                }
            }

            // Optionally set a TTL header for downstream clients/CDN visibility
            if (cfg.setTTLHeader && cfg.ttlSeconds > 0) {
                try { res.setHeader('X-Cache-TTL', String(cfg.ttlSeconds)); } catch (e) {}
            }

            // If request uses If-None-Match and ETag matches, return 304
            try {
                if (cfg.etagFn) {
                    var clientETag = (req && (req.headers && (req.headers['if-none-match'] || req.headers['If-None-Match']))) || null;
                    if (clientETag) {
                        try {
                            var computed = cfg.etagFn(req, res);
                            if (computed && String(computed) === String(clientETag)) {
                                // ETag matches; short-circuit with 304
                                return res.status(304).end();
                            }
                        } catch (e) { /* ignore */ }
                    }
                }
            } catch (e) { /* ignore */ }

            // Continue to next middleware / handler
            return next();
        } catch (err) {
            console.error('cache.middleware error:', err && err.stack ? err.stack : err);
            try { return next(); } catch (e) { /* nothing */ }
        }
    };
}

// Default export: convenience factory that accepts either options or a simple headerValue string
export default function cache(optionsOrHeader) {
    return cacheMiddleware(optionsOrHeader);
}