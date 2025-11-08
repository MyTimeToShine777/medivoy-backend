// src/middleware/logger.js
// ESM module that exports:
//   - named: requestLogger   (Express middleware to log incoming requests & response summary)
//   - named: errorLogger     (Express error-logging middleware to log unhandled errors)
//   - default: an object { requestLogger, errorLogger } for convenience
//
// This implementation logs JSON lines to console by default but accepts a custom logger object
// with methods: info(msg, meta), warn(msg, meta), error(msg, meta) for integration with pino/winston/etc.

/**
 * Default lightweight logger adapter that writes JSON to console.
 * You can pass your own logger object via options.logger
 */
function _defaultLogger() {
    return {
        info: function(msg, meta) {
            try { console.log(JSON.stringify({ level: 'info', message: msg, meta: meta || {}, ts: (new Date()).toISOString() })); } catch (e) { console.log('info', msg, meta); }
        },
        warn: function(msg, meta) {
            try { console.warn(JSON.stringify({ level: 'warn', message: msg, meta: meta || {}, ts: (new Date()).toISOString() })); } catch (e) { console.warn('warn', msg, meta); }
        },
        error: function(msg, meta) {
            try { console.error(JSON.stringify({ level: 'error', message: msg, meta: meta || {}, ts: (new Date()).toISOString() })); } catch (e) { console.error('error', msg, meta); }
        }
    };
}

/**
 * requestLogger(options)
 * Options:
 *  - logger: optional logger object with info/warn/error methods
 *  - getMeta: optional function(req,res) -> meta object
 *  - includeBody: boolean (default false) - include small request body in logs (use carefully)
 *  - maxBodyLength: number (chars) - truncate body when included
 */
export function requestLogger(options) {
    options = options || {};
    var logger = options.logger || _defaultLogger();
    var getMeta = typeof options.getMeta === 'function' ? options.getMeta : function(req, res) {
        return {};
    };
    var includeBody = !!options.includeBody;
    var maxBodyLength = (typeof options.maxBodyLength === 'number') ? options.maxBodyLength : 1000;

    return function(req, res, next) {
        var start = Date.now();
        try {
            // assign request id if not present
            try {
                if (!req.requestId) req.requestId = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
            } catch (e) { /* ignore */ }

            var method = (req && req.method) ? String(req.method) : 'UNKNOWN';
            var url = (req && (req.originalUrl || req.url)) ? String(req.originalUrl || req.url) : '/';
            var ip = 'unknown';
            try { ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown'; } catch (e) {}

            // compute small snapshot of body only if explicitly enabled
            var bodySnapshot = null;
            try {
                if (includeBody && req && req.body) {
                    try {
                        var s = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
                        if (s && s.length > maxBodyLength) s = s.slice(0, maxBodyLength) + '...';
                        bodySnapshot = s;
                    } catch (e) { bodySnapshot = null; }
                }
            } catch (e) { bodySnapshot = null; }

            // log request arrival
            try {
                logger.info('request_start', {
                    method: method,
                    url: url,
                    ip: ip,
                    requestId: req.requestId,
                    body: bodySnapshot,
                    ts: (new Date()).toISOString()
                });
            } catch (e) {}

            // after response finished, log status and timings
            res.on && res.on('finish', function() {
                try {
                    var duration = Date.now() - start;
                    var status = res.statusCode || 0;
                    var meta = getMeta(req, res) || {};
                    // include essential meta
                    meta.method = method;
                    meta.url = url;
                    meta.status = status;
                    meta.durationMs = duration;
                    meta.requestId = req.requestId;
                    logger.info('request_end', meta);
                } catch (e) {
                    try { logger.error('requestLogger finish error', { err: String(e) }); } catch (_) {}
                }
            });
        } catch (err) {
            try { logger.error('requestLogger error', { err: String(err) }); } catch (_) {}
        }
        try { return next(); } catch (e) { return next(e); }
    };
}

/**
 * errorLogger(options)
 * Express error-logging middleware. Signature: (err, req, res, next)
 * Options:
 *  - logger: optional logger object with error() method.
 *  - levelMapper: optional function(err) -> level string ('error'/'warn' etc)
 *  - rethrow: boolean (if true, rethrow/forward error after logging)
 */
export function errorLogger(options) {
    options = options || {};
    var logger = options.logger || _defaultLogger();
    var levelMapper = typeof options.levelMapper === 'function' ? options.levelMapper : function(err) {
        // Map client errors (<500) as warn, others as error
        try {
            var status = (err && typeof err.status === 'number') ? err.status : (err && err.statusCode) || 500;
            return status >= 500 ? 'error' : 'warn';
        } catch (e) { return 'error'; }
    };
    var rethrow = !!options.rethrow;

    return function(err, req, res, next) {
        try {
            var level = levelMapper(err) || 'error';
            var meta = {
                message: (err && err.message) ? err.message : String(err),
                stack: (err && err.stack) ? err.stack : null,
                requestId: (req && req.requestId) ? req.requestId : null,
                url: (req && (req.originalUrl || req.url)) ? (req.originalUrl || req.url) : null,
                method: (req && req.method) ? req.method : null,
                ts: (new Date()).toISOString()
            };
            // prefer logger.error for exceptions; allow custom logger methods if present
            try {
                if (level === 'warn' && typeof logger.warn === 'function') logger.warn('request_error', meta);
                else if (typeof logger.error === 'function') logger.error('request_error', meta);
                else logger.info('request_error', meta);
            } catch (e) { console.error('logger invocation failed', e); }

        } catch (logErr) {
            try { console.error('errorLogger failure', logErr); } catch (_) {}
        }
        // continue to next error handler (do not swallow)
        if (rethrow) {
            // If rethrow requested, pass the error down
            return next(err);
        }
        return next(err);
    };
}

// default export convenience object
export default { requestLogger: requestLogger, errorLogger: errorLogger };