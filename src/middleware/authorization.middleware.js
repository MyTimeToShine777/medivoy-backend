// src/middleware/authorization.middleware.js
// ESM module
// Exports:
//   - named: verifyRoleAccess(reqRoles, userRoles) -> boolean
//   - named: authorizationMiddleware(checkFn) -> middleware
//   - default: authorizationMiddleware

/**
 * verifyRoleAccess
 * Simple helper to check role membership.
 * - reqRoles: string | string[]  (allowed roles)
 * - userRoles: string | string[] | null
 * Returns true if any allowed role matches a user role.
 */
export function verifyRoleAccess(reqRoles, userRoles) {
    // normalize
    var allowed = [];
    if (Array.isArray(reqRoles)) allowed = reqRoles.slice();
    else if (reqRoles === undefined || reqRoles === null) allowed = [];
    else allowed = [String(reqRoles)];

    var uroles = [];
    if (Array.isArray(userRoles)) uroles = userRoles.slice();
    else if (userRoles === undefined || userRoles === null) uroles = [];
    else uroles = [String(userRoles)];

    if (allowed.length === 0) return true; // no restriction means allow
    if (uroles.length === 0) return false;

    for (var i = 0; i < allowed.length; i += 1) {
        var ar = String(allowed[i]);
        for (var j = 0; j < uroles.length; j += 1) {
            if (ar === String(uroles[j])) return true;
        }
    }
    return false;
}

/**
 * authorizationMiddleware
 * Factory that accepts a checkFn or allowedRoles and returns Express middleware.
 *
 * Usage:
 *   import { authorizationMiddleware } from './middleware/authorization.middleware.js';
 *   // approach A: pass a check function
 *   app.get('/x', authorizationMiddleware((req,user) => { return user && user.id === req.params.id; }), handler);
 *
 *   // approach B: pass allowed roles (string or array)
 *   app.get('/admin', authorizationMiddleware(['admin','superuser']), handler);
 *
 * The checkFn may return boolean or Promise<boolean>.
 */
export function authorizationMiddleware(check) {
    // If check is an array or string, convert to role-checking function
    var checkFn;
    if (Array.isArray(check) || typeof check === 'string') {
        var allowedRoles = Array.isArray(check) ? check.slice() : [String(check)];
        checkFn = function(req, user) {
            var userRole = null;
            if (user && (typeof user.role !== 'undefined')) userRole = user.role;
            else if (req && req.user && (typeof req.user.role !== 'undefined')) userRole = req.user.role;
            else if (req && req.session && req.session.user && (typeof req.session.user.role !== 'undefined')) userRole = req.session.user.role;
            return verifyRoleAccess(allowedRoles, userRole);
        };
    } else if (typeof check === 'function') {
        checkFn = check;
    } else {
        // default: allow all
        checkFn = function() { return true; };
    }

    return function(req, res, next) {
        try {
            var user = null;
            if (req && req.user) user = req.user;
            else if (req && req.session && req.session.user) user = req.session.user;

            // run the check function (might be sync or return a promise)
            var result;
            try {
                result = checkFn(req, user);
            } catch (syncErr) {
                return next(syncErr);
            }

            if (result && typeof result.then === 'function') {
                result.then(function(allowed) {
                    if (!allowed) return res.status(403).json({ success: false, message: 'Forbidden' });
                    return next();
                }).catch(function(err) {
                    return next(err);
                });
            } else {
                if (!result) return res.status(403).json({ success: false, message: 'Forbidden' });
                return next();
            }
        } catch (err) {
            console.error('authorizationMiddleware error:', err && err.stack ? err.stack : err);
            return res.status(500).json({ success: false, message: 'Internal server error in authorization' });
        }
    };
}

// default export
export default authorizationMiddleware;