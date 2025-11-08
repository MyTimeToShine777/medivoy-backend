// src/middleware/permission.middleware.js
// ESM module
// Exports:
//   - named: permissionMiddleware(required, comparator, options)
//   - named: hasPermission(userPermissions, required)
//   - default: permissionMiddleware
//
// Usage (example):
// import { permissionMiddleware } from './middleware/permission.middleware.js';
// app.get('/secure', permissionMiddleware('manage:users'), handler);
// app.post('/multi', permissionMiddleware(['create:post','edit:post']), handler);
// app.get('/custom', permissionMiddleware(requiredPerm, customComparator), handler);

export function hasPermission(userPermissions, required) {
    try {
        // Normalize userPermissions to array of strings
        var perms = [];
        if (Array.isArray(userPermissions)) perms = userPermissions.slice();
        else if (userPermissions === undefined || userPermissions === null) perms = [];
        else perms = [String(userPermissions)];

        // Normalize required into string or array
        var reqs = [];
        if (Array.isArray(required)) reqs = required.slice();
        else if (required === undefined || required === null) reqs = [];
        else reqs = [String(required)];

        if (!reqs || reqs.length === 0) return true; // no requirement means allow

        // simple membership: require all required perms to be present
        for (var i = 0; i < reqs.length; i += 1) {
            var need = String(reqs[i]);
            var found = false;
            for (var j = 0; j < perms.length; j += 1) {
                if (String(perms[j]) === need) { found = true; break; }
            }
            if (!found) return false;
        }
        return true;
    } catch (err) {
        // On error, be conservative and deny
        try { console.error('hasPermission error:', err && err.stack ? err.stack : err); } catch (_) {}
        return false;
    }
}

/**
 * permissionMiddleware(required, comparator, options)
 *
 * - required: string or array of strings (permission keys). If falsy -> allow all.
 * - comparator: optional function(userPerms, required) => boolean | Promise<boolean>
 *      If provided, used to evaluate permission membership. Support async comparator.
 * - options: optional object:
 *      - userLookup: function(req) -> userObject (default reads req.user || req.session.user)
 *      - onDenied: function(req, res) -> void  (optional callback when denied)
 *
 * Returns Express middleware (req, res, next)
 */
export function permissionMiddleware(required, comparator, options) {
    // normalize arguments
    if (typeof comparator === 'object' && comparator !== null && options === undefined) {
        // comparator was omitted and options supplied as second arg
        options = comparator;
        comparator = null;
    }

    options = options || {};
    var userLookup = typeof options.userLookup === 'function' ? options.userLookup : function(req) {
        if (req && req.user) return req.user;
        if (req && req.session && req.session.user) return req.session.user;
        return null;
    };

    // default comparator uses hasPermission (synchronous)
    var comparatorFn;
    if (typeof comparator === 'function') {
        comparatorFn = comparator;
    } else {
        comparatorFn = function(userPerms, reqd) {
            return hasPermission(userPerms, reqd);
        };
    }

    return function(req, res, next) {
        try {
            // find user
            var user = null;
            try { user = userLookup(req); } catch (e) { user = null; }

            if (!user) {
                // unauthenticated
                try { return res.status(401).json({ success: false, message: 'Unauthorized' }); } catch (e) { return next(); }
            }

            var userPerms = user.permissions || [];
            // run comparator (may be sync or return a promise)
            var outcome;
            try {
                outcome = comparatorFn(userPerms, required);
            } catch (syncErr) {
                return next(syncErr);
            }

            if (outcome && typeof outcome.then === 'function') {
                outcome.then(function(allowed) {
                    if (!allowed) {
                        try {
                            if (typeof options.onDenied === 'function') options.onDenied(req, res);
                            return res.status(403).json({ success: false, message: 'Forbidden' });
                        } catch (e) { return next(); }
                    }
                    return next();
                }).catch(function(err) {
                    return next(err);
                });
            } else {
                if (!outcome) {
                    try {
                        if (typeof options.onDenied === 'function') options.onDenied(req, res);
                        return res.status(403).json({ success: false, message: 'Forbidden' });
                    } catch (e) { return next(); }
                }
                return next();
            }
        } catch (err) {
            console.error('permissionMiddleware error:', err && err.stack ? err.stack : err);
            try { return res.status(500).json({ success: false, message: 'Internal server error' }); } catch (_) { return next(err); }
        }
    };
}

// default export
export default permissionMiddleware;