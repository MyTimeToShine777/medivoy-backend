// src/middleware/validation.middleware.js
// ESM module
// Named exports:
//   - validateLogin(req,res,next)
//   - validateRegister(req,res,next)
//   - validatePagination(req,res,next)
//   - validationMiddleware(validateFn) -> middleware
// Default export: validationMiddleware

let Joi = null;
async function _tryLoadJoi() {
    if (Joi) return Joi;
    try {
        const mod = await
        import ('joi').then(m => m.default || m).catch(() => null);
        Joi = mod;
    } catch (e) {
        Joi = null;
    }
    return Joi;
}

/**
 * Generic factory - accepts a validateFn(req) -> { error, value } or Promise thereof.
 * Returns middleware that responds 422 on error, attaches validated value to req.validated.
 */
export function validationMiddleware(validateFn) {
    if (typeof validateFn !== 'function') {
        throw new TypeError('validationMiddleware expects a function');
    }

    return function(req, res, next) {
        try {
            var result = validateFn(req);

            if (result && typeof result.then === 'function') {
                result.then(function(r) {
                    if (r && r.error) {
                        return res.status(422).json({ success: false, message: r.error.message || 'Validation failed', details: r.error });
                    }
                    if (r && r.value) req.validated = r.value;
                    return next();
                }).catch(function(e) {
                    console.error('validationMiddleware async error:', e && e.stack ? e.stack : e);
                    return res.status(500).json({ success: false, message: 'Validation error' });
                });
                return;
            }

            if (result && result.error) {
                return res.status(422).json({ success: false, message: result.error.message || 'Validation failed', details: result.error });
            }
            if (result && result.value) req.validated = result.value;
            return next();
        } catch (err) {
            console.error('validationMiddleware error:', err && err.stack ? err.stack : err);
            try { return res.status(500).json({ success: false, message: 'Internal server error during validation' }); } catch (_) { return; }
        }
    };
}

// Default export (same as named)
export default validationMiddleware;

/* -------------------------
   validateLogin
   ------------------------- */
/**
 * Expects body: { email, password }
 * - email must contain '@'
 * - password min 6 chars
 */
export async function validateLogin(req, res, next) {
    try {
        const useJoi = !!(await _tryLoadJoi());
        if (useJoi) {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
            }).options({ abortEarly: false, allowUnknown: false });

            const { error, value } = schema.validate(req.body || {});
            if (error) return res.status(422).json({ success: false, message: 'Validation failed', details: error.details });
            req.validated = value;
            return next();
        }

        // fallback manual checks
        var body = req.body || {};
        if (!body.email || typeof body.email !== 'string' || body.email.indexOf('@') === -1) {
            return res.status(422).json({ success: false, message: 'Validation failed', details: { field: 'email', reason: 'Invalid or missing email' } });
        }
        if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
            return res.status(422).json({ success: false, message: 'Validation failed', details: { field: 'password', reason: 'Password required (min 6 chars)' } });
        }
        req.validated = { email: body.email, password: body.password };
        return next();
    } catch (err) {
        console.error('validateLogin error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ success: false, message: 'Internal server error in validation' });
    }
}

/* -------------------------
   validateRegister
   ------------------------- */
/**
 * Expects body: { name, email, password, phone? }
 */
export async function validateRegister(req, res, next) {
    try {
        const useJoi = !!(await _tryLoadJoi());
        if (useJoi) {
            const schema = Joi.object({
                firstName: Joi.string().min(2).max(100).required(),
                lastName: Joi.string().min(2).max(100).required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
                phone: Joi.string().optional()
            }).options({ abortEarly: false, allowUnknown: true });

            const { error, value } = schema.validate(req.body || {});
            if (error) return res.status(422).json({ success: false, message: 'Validation failed', details: error.details });
            req.validated = value;
            return next();
        }

        // fallback manual
        var body = req.body || {};
        if (!body.firstName || typeof body.firstName !== 'string' || body.firstName.trim().length < 2) {
            return res.status(422).json({ success: false, message: 'Validation failed', details: { field: 'firstName', reason: 'First name required (min 2 chars)' } });
        }
        if (!body.lastName || typeof body.lastName !== 'string' || body.lastName.trim().length < 2) {
            return res.status(422).json({ success: false, message: 'Validation failed', details: { field: 'lastName', reason: 'Last name required (min 2 chars)' } });
        }
        if (!body.email || typeof body.email !== 'string' || body.email.indexOf('@') === -1) {
            return res.status(422).json({ success: false, message: 'Validation failed', details: { field: 'email', reason: 'Invalid or missing email' } });
        }
        if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
            return res.status(422).json({ success: false, message: 'Validation failed', details: { field: 'password', reason: 'Password required (min 6 chars)' } });
        }
        req.validated = { firstName: body.firstName, lastName: body.lastName, email: body.email, password: body.password, phone: body.phone || null };
        return next();
    } catch (err) {
        console.error('validateRegister error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ success: false, message: 'Internal server error in validation' });
    }
}

/* -------------------------
   validatePagination
   ------------------------- */
/**
 * Expects query params: page, limit, sort, order
 * Normalizes and attaches req.validated = { page, limit, skip, sort, order }
 */
export async function validatePagination(req, res, next) {
    try {
        // prefer numbers, provide defaults
        var q = req.query || {};
        var rawPage = (typeof q.page !== 'undefined') ? q.page : (typeof q.p !== 'undefined' ? q.p : undefined);
        var rawLimit = (typeof q.limit !== 'undefined') ? q.limit : (typeof q.size !== 'undefined' ? q.size : undefined);
        var rawSort = (typeof q.sort !== 'undefined') ? q.sort : null;
        var rawOrder = (typeof q.order !== 'undefined') ? q.order : (typeof q.direction !== 'undefined' ? q.direction : 'desc');

        var page = 1;
        var limit = 20;

        if (typeof rawPage !== 'undefined' && rawPage !== null && rawPage !== '') {
            var pnum = Number(rawPage);
            if (!isNaN(pnum) && isFinite(pnum) && pnum >= 1) page = Math.floor(pnum);
        }

        if (typeof rawLimit !== 'undefined' && rawLimit !== null && rawLimit !== '') {
            var lnum = Number(rawLimit);
            if (!isNaN(lnum) && isFinite(lnum) && lnum >= 1) limit = Math.min(Math.max(1, Math.floor(lnum)), 1000);
        }

        var sort = null;
        if (rawSort && typeof rawSort === 'string' && rawSort.trim() !== '') sort = rawSort.trim();

        var order = String(rawOrder || 'desc').toLowerCase();
        if (order !== 'asc' && order !== 'desc') order = 'desc';

        var skip = (page - 1) * limit;

        req.validated = { page: page, limit: limit, skip: skip, sort: sort, order: order, raw: { page: rawPage, limit: rawLimit, sort: rawSort, order: rawOrder } };
        return next();
    } catch (err) {
        console.error('validatePagination error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ success: false, message: 'Internal server error in pagination validation' });
    }
}