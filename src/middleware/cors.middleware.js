// src/middleware/cors.middleware.js
// ESM module
// Exports:
//   - named: corsMiddleware(options)
//   - default: cors(options)  (alias to corsMiddleware)
//
// Usage:
//   import { corsMiddleware } from './middleware/cors.middleware.js';
//   app.use(corsMiddleware({ allowedOrigins: ['https://example.com'], allowCredentials: true }));

/**
 * Normalize options for the CORS middleware
 * options:
 *  - allowedOrigins: array of allowed origin strings (empty => allow all)
 *  - allowCredentials: boolean
 *  - methods: string (comma-separated) default: 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
 *  - allowedHeaders: string default: 'Content-Type,Authorization'
 *  - preflightStatus: number (default 204)
 */
function _normalizeOptions(options) {
    options = options || {};
    return {
        allowedOrigins: Array.isArray(options.allowedOrigins) ? options.allowedOrigins : [],
        allowCredentials: !!options.allowCredentials,
        methods: typeof options.methods === 'string' ? options.methods : 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        allowedHeaders: typeof options.allowedHeaders === 'string' ? options.allowedHeaders : 'Content-Type,Authorization',
        preflightStatus: typeof options.preflightStatus === 'number' ? options.preflightStatus : 204
    };
}

/**
 * Named factory: corsMiddleware
 */
export function corsMiddleware(options) {
    var cfg = _normalizeOptions(options);

    return function(req, res, next) {
        try {
            var origin = null;
            try {
                if (req && req.headers) origin = req.headers.origin || req.headers.Origin || null;
            } catch (e) {
                origin = null;
            }

            // If no origin (server-to-server request), allow by default
            if (!origin) return next();

            var allowed = false;
            if (!cfg.allowedOrigins || cfg.allowedOrigins.length === 0) {
                // empty list means allow any origin
                allowed = true;
            } else {
                for (var i = 0; i < cfg.allowedOrigins.length; i += 1) {
                    if (cfg.allowedOrigins[i] === origin) {
                        allowed = true;
                        break;
                    }
                }
            }

            if (allowed) {
                try { res.setHeader('Access-Control-Allow-Origin', origin); } catch (e) {}
                try { res.setHeader('Access-Control-Allow-Methods', cfg.methods); } catch (e) {}
                try { res.setHeader('Access-Control-Allow-Headers', cfg.allowedHeaders); } catch (e) {}
                if (cfg.allowCredentials) {
                    try { res.setHeader('Access-Control-Allow-Credentials', 'true'); } catch (e) {}
                }
            }

            // Handle preflight
            var method = (req && req.method) ? String(req.method).toUpperCase() : '';
            if (method === 'OPTIONS') {
                try { return res.status(cfg.preflightStatus).end(); } catch (e) { return res.end(); }
            }

            return next();
        } catch (err) {
            try { console.error('cors.middleware error:', err && err.stack ? err.stack : err); } catch (_) {}
            return next();
        }
    };
}

// default export alias
export default function cors(options) {
    return corsMiddleware(options);
}