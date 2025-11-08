// src/middleware/roleBasedAccess.middleware.js
// ESM module
// Exports:
//   - named: roleBasedAccessMiddleware(allowedRoles, options) -> middleware
//   - named: roleAccessMiddleware    (alias of roleBasedAccessMiddleware)
//   - named: hasRole(userRoleOrRoles, allowedRoles) -> boolean
//   - default: roleBasedAccessMiddleware
//
// Purpose: Protect routes by role. allowedRoles may be string or array; options.userLookup can customize how to get user.

export function hasRole(userRoleOrRoles, allowedRoles) {
    try {
        // Normalize allowedRoles to array of strings
        var allowed = [];
        if (Array.isArray(allowedRoles)) allowed = allowedRoles.map(function(r) { return String(r); });
        else if (allowedRoles === undefined || allowedRoles === null) allowed = [];
        else allowed = [String(allowedRoles)];

        // If no allowed roles declared, treat as open access
        if (!allowed || allowed.length === 0) return true;

        // Normalize userRoleOrRoles to array
        var userRoles = [];
        if (Array.isArray(userRoleOrRoles)) userRoles = userRoleOrRoles.map(function(r) { return String(r); });
        else if (userRoleOrRoles === undefined || userRoleOrRoles === null) userRoles = [];
        else userRoles = [String(userRoleOrRoles)];

        if (!userRoles || userRoles.length === 0) return false;

        // check any match (user has at least one allowed role)
        for (var i = 0; i < allowed.length; i += 1) {
            var a = String(allowed[i]);
            for (var j = 0; j < userRoles.length; j += 1) {
                if (a === String(userRoles[j])) return true;
            }
        }
        return false;
    } catch (err) {
        try { console.error('hasRole error:', err && err.stack ? err.stack : err); } catch (_) {}
        return false;
    }
}

/**
 * Factory: roleBasedAccessMiddleware(allowedRoles, options)
 *
 * allowedRoles: string or array of strings (roles that are allowed)
 * options:
 *   - userLookup(req) -> user object (default: req.user || req.session.user)
 *   - onDenied(req,res) optional callback before responding
 *   - requireUser: boolean (default true) -> respond 401 when no user found
 *
 * Returns Express middleware (req,res,next)
 */
export function roleBasedAccessMiddleware(allowedRoles, options) {
    options = options || {};
    var userLookup = typeof options.userLookup === 'function' ? options.userLookup : function(req) {
        if (req && req.user) return req.user;
        if (req && req.session && req.session.user) return req.session.user;
        return null;
    };
    var onDenied = typeof options.onDenied === 'function' ? options.onDenied : null;
    var requireUser = (typeof options.requireUser === 'boolean') ? !!options.requireUser : true;

    // normalize allowedRoles into array or keep as provided for hasRole
    var allowed = Array.isArray(allowedRoles) ? allowedRoles.slice() : (allowedRoles === undefined || allowedRoles === null ? [] : [String(allowedRoles)]);

    return function(req, res, next) {
        try {
            var user = null;
            try { user = userLookup(req); } catch (e) { user = null; }

            if (!user) {
                if (requireUser) return res.status(401).json({ success: false, message: 'Unauthorized: user required' });
                // no user but not required => treat as not allowed
                if (onDenied) try { onDenied(req, res); } catch (_) {}
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }

            // user may have role or roles
            var userRole = null;
            if (typeof user.role !== 'undefined' && user.role !== null) userRole = user.role;
            else if (typeof user.roles !== 'undefined' && user.roles !== null) userRole = user.roles;
            else userRole = null;

            var allowedFlag = hasRole(userRole, allowed);

            if (!allowedFlag) {
                if (onDenied) {
                    try { onDenied(req, res); } catch (e) { /* ignore */ }
                }
                return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
            }

            // attach currentUser for downstream handlers
            try { req.currentUser = user; } catch (e) { /* ignore */ }
            return next();
        } catch (err) {
            console.error('roleBasedAccessMiddleware error:', err && err.stack ? err.stack : err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };
}

// Provide an alias matching import in code
export const roleAccessMiddleware = roleBasedAccessMiddleware;

// default export
export default roleBasedAccessMiddleware;