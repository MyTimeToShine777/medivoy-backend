// src/middleware/errorHandler.js
// ESM module that exports:
//   - named: errorHandler
//   - default: errorHandler
//
// Central Express error handler. Put this last: app.use(errorHandler);

export function errorHandler(err, req, res, next) {
    try {
        // Log with stack if available
        if (err && err.stack) {
            try { console.error(err.stack); } catch (e) { console.error(String(err)); }
        } else {
            try { console.error('Error:', err); } catch (e) { /* ignore */ }
        }

        // Respect explicit status on error objects, fallback to 500
        var status = 500;
        try { status = (err && typeof err.status === 'number') ? err.status : 500; } catch (e) { status = 500; }

        // Friendly message, but prefer err.message if present (avoid leaking details in production)
        var message = 'Internal server error';
        try { if (err && typeof err.message === 'string') message = err.message; } catch (e) {}

        // Optionally include minimal error code or details for known error shapes
        var payload = { success: false, message: message };

        // If error contains validation details, include them (non-sensitive)
        try {
            if (err && err.details) payload.details = err.details;
            else if (err && err.errors) payload.errors = err.errors;
        } catch (e) { /* ignore */ }

        // Send JSON response; if headers already sent, delegate to next
        try {
            if (res && typeof res.headersSent !== 'undefined' && res.headersSent) {
                return next && next(err);
            }
        } catch (e) { /* ignore */ }

        // Ensure no further exceptions while sending response
        try {
            return res.status(status).json(payload);
        } catch (e) {
            // as a last resort, try to end response
            try { res.status(500).end(); } catch (_) {}
            return;
        }
    } catch (fatal) {
        // If the error handler itself crashes, log and attempt safe termination of response
        try { console.error('Fatal error in errorHandler:', fatal && fatal.stack ? fatal.stack : fatal); } catch (_) {}
        try { if (res && !res.headersSent) res.status(500).end(); } catch (_) {}
        return;
    }
}

export default errorHandler;