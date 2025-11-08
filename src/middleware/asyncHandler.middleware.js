// src/middleware/asyncHandler.middleware.js
// ESM module
// Exports:
//   - named: asyncHandler
//   - default: asyncHandler (for default import convenience)
//
// Usage:
//   import { asyncHandler } from './middleware/asyncHandler.middleware.js';
//   app.get('/x', asyncHandler(async (req, res) => { ... }));

/**
 * Wraps an async Express handler and forwards rejected promises/errors to next().
 * Works with sync or async handlers.
 *
 * @param {Function} fn - Express handler (req, res, next) => (void|Promise)
 * @returns {Function} middleware function (req, res, next)
 */
export function asyncHandler(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('asyncHandler expects a function');
    }

    return function(req, res, next) {
        try {
            var maybePromise = fn(req, res, next);

            // If handler returned a promise, attach catch to forward errors to next()
            if (maybePromise && typeof maybePromise.then === 'function') {
                maybePromise.catch(function(err) {
                    try { return next(err); } catch (e) { console.error('asyncHandler next error:', e); }
                });
            }
            // if sync, nothing more to do; errors are caught by outer try/catch
        } catch (err) {
            // synchronous error -> forward to express error handler
            return next(err);
        }
    };
}

// default export for convenience
export default asyncHandler;