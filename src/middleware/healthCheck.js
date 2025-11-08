// src/middleware/healthCheck.js
// ESM module
// Exports:
//   - named: healthCheckHandler(options) -> express handler (async)
//   - default: healthCheckHandler (same factory)
//
// The handler runs optional checks (functions returning { ok: boolean, info? } or Promise)
// and returns 200 if all ok, 503 if any fail, 504 on timeout.

function _normalizeOptions(opts) {
    opts = opts || {};
    return {
        checks: Array.isArray(opts.checks) ? opts.checks.slice() : [],
        timeoutMs: typeof opts.timeoutMs === 'number' ? Math.max(0, opts.timeoutMs) : 2000,
        includeDetails: !!opts.includeDetails, // include per-check details in response
        healthyStatus: typeof opts.healthyStatus === 'number' ? opts.healthyStatus : 200,
        unhealthyStatus: typeof opts.unhealthyStatus === 'number' ? opts.unhealthyStatus : 503
    };
}

/**
 * healthCheckHandler(options)
 * options.checks: array of functions () => { ok: boolean, info?: any } | Promise<{ok,info}>
 *
 * Returns an Express handler: (req, res) => { ... }
 */
export function healthCheckHandler(options) {
    var cfg = _normalizeOptions(options);

    // ensure each check is a function
    var checks = cfg.checks.map(function(c) {
        if (typeof c !== 'function') {
            // wrap non-function into a check that returns ok=false with info
            return function() { return { ok: false, info: 'invalid check (not function)' }; };
        }
        return c;
    });

    return async function(req, res) {
        var start = Date.now();

        if (!checks || checks.length === 0) {
            // simple heartbeat
            try {
                return res.status(cfg.healthyStatus).json({
                    success: true,
                    uptime: process.uptime(),
                    timestamp: Date.now(),
                    durationMs: Date.now() - start
                });
            } catch (err) {
                try { return res.status(500).json({ success: false, message: 'Failed to send response' }); } catch (_) {}
            }
            return;
        }

        // Run checks with timeout
        var results = [];
        var timedOut = false;

        // helper to run a single check with its own try/catch
        function runCheckFn(fn) {
            try {
                var out = fn();
                if (out && typeof out.then === 'function') {
                    return out.then(function(r) {
                        return { ok: !!(r && r.ok), info: r && r.info ? r.info : null };
                    }).catch(function(e) {
                        return { ok: false, info: String(e) };
                    });
                }
                // sync return
                return Promise.resolve({ ok: !!(out && out.ok), info: out && out.info ? out.info : null });
            } catch (err) {
                return Promise.resolve({ ok: false, info: String(err) });
            }
        }

        // start all checks
        try {
            var promises = checks.map(function(c) { return runCheckFn(c); });

            // create timeout promise
            var timeoutPromise = new Promise(function(resolve) {
                setTimeout(function() { timedOut = true;
                    resolve({ timeout: true }); }, cfg.timeoutMs);
            });

            var resultsOrTimeout = await Promise.race([Promise.all(promises).then(function(arr) { return { results: arr }; }), timeoutPromise]);

            if (resultsOrTimeout && resultsOrTimeout.timeout) {
                // timed out
                try {
                    return res.status(504).json({ success: false, message: 'Health checks timed out', timeoutMs: cfg.timeoutMs });
                } catch (err) {
                    try { return res.status(500).json({ success: false, message: 'Health check response failed' }); } catch (_) {}
                }
                return;
            }

            results = (resultsOrTimeout && resultsOrTimeout.results) || [];

            // decide aggregated health
            var allOk = true;
            var details = [];
            for (var i = 0; i < results.length; i += 1) {
                var r = results[i] || { ok: false };
                details.push({ ok: !!r.ok, info: r.info || null });
                if (!r.ok) allOk = false;
            }

            var status = allOk ? cfg.healthyStatus : cfg.unhealthyStatus;
            var body = {
                success: !!allOk,
                uptime: process.uptime(),
                timestamp: Date.now(),
                durationMs: Date.now() - start
            };
            if (cfg.includeDetails) body.checks = details;
            // if not including details but unhealthy, add count
            if (!cfg.includeDetails && !allOk) body.failed = details.filter(function(d) { return !d.ok; }).length;

            try {
                return res.status(status).json(body);
            } catch (err) {
                try { return res.status(500).json({ success: false, message: 'Failed to send health response' }); } catch (_) {}
            }
        } catch (err) {
            console.error('healthCheckHandler error:', err && err.stack ? err.stack : err);
            try { return res.status(500).json({ success: false, message: 'Internal server error in health check' }); } catch (_) {}
        }
    };
}

// default export (factory)
export default healthCheckHandler;