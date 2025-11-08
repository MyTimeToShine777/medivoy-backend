// src/middleware/auth.middleware.js
// ESM module that exports:
//   - named: authenticateToken (middleware: non-configured, uses process.env.JWT_SECRET)
//   - named: authMiddleware (factory: authMiddleware(options) -> middleware)
//   - default: authMiddleware (same as named factory)
//
// Notes:
//  - Uses jsonwebtoken if installed; otherwise you must pass verifyFn option.
//  - No optional chaining is used.

let jwt = null;
try {
    // top-level await is supported in Node 14+ when using ESM; this will attempt to import jsonwebtoken if installed.
    // If it fails (not installed), jwt remains null and verifyFn must be provided when using factory with config.
    const mod = await
    import ('jsonwebtoken').then(m => m.default || m).catch(() => null);
    jwt = mod;
} catch (e) {
    jwt = null;
}

/**
 * Internal: verify token using jwt or a custom verifyFn.
 * Returns payload or throws.
 */
async function _verifyToken(token, options) {
    options = options || {};
    if (typeof options.verifyFn === 'function') {
        return await Promise.resolve(options.verifyFn(token));
    }
    if (!jwt) {
        throw new Error('jsonwebtoken package not found and no verifyFn provided');
    }
    // Wrap jwt.verify in a Promise
    return new Promise(function(resolve, reject) {
        try {
            jwt.verify(token, options.tokenSecret, function(err, decoded) {
                if (err) return reject(err);
                return resolve(decoded);
            });
        } catch (err) {
            return reject(err);
        }
    });
}

/**
 * Named middleware: authenticateToken
 * - Non-configured convenience middleware: uses process.env.JWT_SECRET
 * - Non-blocking by default: if no token present it calls next()
 * To force require token, use the factory `authMiddleware({ required: true })`
 */
export async function authenticateToken(req, res, next) {
    const options = { tokenSecret: process.env.JWT_SECRET, verifyFn: null, cookieName: null, required: false };

    try {
        var token = null;

        // Authorization header
        if (req && req.headers) {
            var hdr = req.headers.authorization || req.headers.Authorization || null;
            if (hdr) {
                var parts = String(hdr).split(' ');
                if (parts.length === 2 && /^Bearer$/i.test(parts[0])) token = parts[1];
            }
        }

        // cookie fallback (if cookie parser used)
        if (!token && options.cookieName && req && req.cookies && req.cookies[options.cookieName]) {
            token = req.cookies[options.cookieName];
        }

        if (!token) {
            if (options.required) return res.status(401).json({ success: false, message: 'Authentication required' });
            return next();
        }

        try {
            var payload = await _verifyToken(token, options);
            if (!req.user) req.user = payload;
            return next();
        } catch (verr) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    } catch (err) {
        console.error('authenticateToken error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ success: false, message: 'Internal server error in authentication' });
    }
}

/**
 * Named factory: authMiddleware(options)
 * Options:
 *   - tokenSecret: JWT secret (string)
 *   - verifyFn: function(token) -> payload | Promise
 *   - cookieName: optional cookie name to check
 *   - required: boolean (if true, missing token => 401)
 *
 * Example:
 *   import { authMiddleware } from './middleware/auth.middleware.js';
 *   app.use(authMiddleware({ tokenSecret: process.env.JWT_SECRET, required: true }));
 */
export function authMiddleware(options) {
    options = options || {};
    const cfg = {
        tokenSecret: options.tokenSecret || process.env.JWT_SECRET,
        verifyFn: options.verifyFn || null,
        cookieName: options.cookieName || null,
        required: !!options.required
    };

    // Return an async middleware
    return async function(req, res, next) {
        try {
            var token = null;

            if (req && req.headers) {
                var hdr = req.headers.authorization || req.headers.Authorization || null;
                if (hdr) {
                    var parts = String(hdr).split(' ');
                    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) token = parts[1];
                }
            }

            if (!token && cfg.cookieName && req && req.cookies && req.cookies[cfg.cookieName]) {
                token = req.cookies[cfg.cookieName];
            }

            if (!token) {
                if (cfg.required) return res.status(401).json({ success: false, message: 'Authentication required' });
                return next();
            }

            try {
                var payload = await _verifyToken(token, cfg);
                if (!req.user) req.user = payload;
                return next();
            } catch (verr) {
                return res.status(401).json({ success: false, message: 'Invalid or expired token' });
            }
        } catch (err) {
            console.error('authMiddleware error:', err && err.stack ? err.stack : err);
            return res.status(500).json({ success: false, message: 'Internal server error in authentication' });
        }
    };
}

// default export points to factory for convenience
export default authMiddleware;