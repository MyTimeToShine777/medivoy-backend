// src/middleware/notFound.js
// ESM module
// Exports:
//  - named: notFoundHandler(req, res, next)
//  - default: notFoundHandler
//
// Use as the last non-error middleware: app.use(notFoundHandler);

export function notFoundHandler(req, res, next) {
    try {
        // Basic info for logs without leaking sensitive data
        try {
            var method = (req && req.method) ? String(req.method) : 'UNKNOWN';
            var url = (req && (req.originalUrl || req.url)) ? String(req.originalUrl || req.url) : '/';
            // Prefer structured logging if available via req.logger
            if (req && req.logger && typeof req.logger.warn === 'function') {
                try { req.logger.warn('not_found', { method: method, url: url, ts: (new Date()).toISOString() }); } catch (e) {}
            } else {
                // light console log if no logger attached
                try { console.warn('[notFound] %s %s', method, url); } catch (e) {}
            }
        } catch (logErr) {
            try { console.warn('notFoundHandler logging error', String(logErr)); } catch (_) {}
        }

        // Respond with JSON 404
        try {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        } catch (sendErr) {
            // If res.json fails, try ending response
            try { res.status(404).end(); } catch (_) {}
            return;
        }
    } catch (err) {
        // If the notFound handler itself fails, delegate to next error handler
        try { return next && next(err); } catch (_) { return; }
    }
}

// default export alias
export default notFoundHandler;