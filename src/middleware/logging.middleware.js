// src/middleware/logging.middleware.js
// ESM module
// Exports:
//   - named: loggingMiddleware(options)
//   - default: loggingMiddleware
//
// Options:
//  - logger: object with methods info(msg, meta), warn(msg, meta), error(msg, meta)  (default: console JSON logger)
//  - includeBody: boolean (default false) - include small request body snapshot
//  - maxBodyLength: number (default 1000)
//  - attachRequestId: boolean (default true)
//  - requestIdHeader: string (header name to read incoming request id, default 'x-request-id')

function _makeDefaultLogger() {
    return {
        info: function(msg, meta) {
            try { console.log(JSON.stringify(Object.assign({ level: 'info', message: msg, ts: (new Date()).toISOString() }, { meta: meta || {} }))); } catch (e) { console.log('info', msg, meta); }
        },
        warn: function(msg, meta) {
            try { console.warn(JSON.stringify(Object.assign({ level: 'warn', message: msg, ts: (new Date()).toISOString() }, { meta: meta || {} }))); } catch (e) { console.warn('warn', msg, meta); }
        },
        error: function(msg, meta) {
            try { console.error(JSON.stringify(Object.assign({ level: 'error', message: msg, ts: (new Date()).toISOString() }, { meta: meta || {} }))); } catch (e) { console.error('error', msg, meta); }
        }
    };
}

/**
 * loggingMiddleware(options)
 * Returns an Express middleware that logs request start and finish with duration.
 */
export function loggingMiddleware(options) {
    options = options || {};
    var logger = options.logger || _makeDefaultLogger();
    var includeBody = !!options.includeBody;
    var maxBodyLength = (typeof options.maxBodyLength === 'number') ? Math.max(0, options.maxBodyLength) : 1000;
    var attachRequestId = (typeof options.attachRequestId === 'boolean') ? options.attachRequestId : true;
    var requestIdHeader = (typeof options.requestIdHeader === 'string' && options.requestIdHeader) ? options.requestIdHeader : 'x-request-id';

    return function(req, res, next) {
        var start = Date.now();
        try {
            // request id: reuse header if provided; otherwise generate
            try {
                if (attachRequestId) {
                    var incomingId = null;
                    try { incomingId = req && req.headers && (req.headers[requestIdHeader] || req.headers[requestIdHeader.toLowerCase()]) || null; } catch (e) { incomingId = null; }
                    if (incomingId) req.requestId = String(incomingId);
                    else if (!req.requestId) req.requestId = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
                } else if (!req.requestId) {
                    req.requestId = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
                }
            } catch (e) { /* ignore */ }

            var method = (req && req.method) ? String(req.method) : 'UNKNOWN';
            var url = (req && (req.originalUrl || req.url)) ? String(req.originalUrl || req.url) : '/';
            var ip = 'unknown';
            try { ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown'; } catch (e) {}

            // optionally capture small body snapshot
            var bodySnapshot = null;
            try {
                if (includeBody && req && req.body) {
                    try {
                        var s = (typeof req.body === 'string') ? req.body : JSON.stringify(req.body);
                        if (s && s.length > maxBodyLength) s = s.slice(0, maxBodyLength) + '...';
                        bodySnapshot = s;
                    } catch (e) { bodySnapshot = null; }
                }
            } catch (e) { bodySnapshot = null; }

            // log request start
            try {
                logger.info('request_start', {
                    method: method,
                    url: url,
                    ip: ip,
                    requestId: req.requestId,
                    body: bodySnapshot,
                    ts: (new Date()).toISOString()
                });
            } catch (err) { /* ignore logging errors */ }

            // on finish, log end info
            res.on && res.on('finish', function() {
                try {
                    var duration = Date.now() - start;
                    var status = res.statusCode || 0;
                    var meta = {
                        method: method,
                        url: url,
                        status: status,
                        durationMs: duration,
                        requestId: req.requestId,
                        ts: (new Date()).toISOString()
                    };
                    logger.info('request_end', meta);
                } catch (err) {
                    try { logger.error('loggingMiddleware finish error', { err: String(err), requestId: req.requestId }); } catch (_) {}
                }
            });
        } catch (err) {
            try { logger.error('loggingMiddleware error', { err: String(err), requestId: (req && req.requestId) ? req.requestId : null }); } catch (_) {}
        }
        try { return next(); } catch (e) { return next(e); }
    };
}

// default export convenience
export default loggingMiddleware;