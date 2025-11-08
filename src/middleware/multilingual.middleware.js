// src/middleware/multilingual.middleware.js
// ESM module - exports named: detectLanguage, loadTranslations, i18nHelper and default -> i18nHelper
// Defensive, no optional chaining, intermediate/production ready.

/**
 * detectLanguage(req) -> string
 * Attempts to detect language from query, header, or req.locale; falls back to 'en'.
 */
export function detectLanguage(req) {
    try {
        if (req && req.query && req.query.lang) {
            var q = String(req.query.lang || '').split(',')[0].trim();
            if (q) return q;
        }
        if (req && req.headers) {
            var al = req.headers['accept-language'] || req.headers['Accept-Language'] || null;
            if (al && typeof al === 'string') {
                var first = String(al).split(',')[0].split(';')[0].trim();
                if (first) {
                    var parts = first.split('-');
                    if (parts && parts.length) return parts[0];
                    return first;
                }
            }
        }
        if (req && req.locale) {
            return String(req.locale);
        }
    } catch (e) {
        try { console.error('detectLanguage error:', e && e.stack ? e.stack : e); } catch (_) {}
    }
    return 'en';
}

/**
 * loadTranslations(pathOrObj) -> Promise<object>
 * If passed an object, resolves immediately. If passed a string path, tries dynamic import and returns
 * the module default or module itself as the translations map. On failure returns {}.
 */
export async function loadTranslations(pathOrObj) {
    try {
        if (!pathOrObj) return {};
        if (typeof pathOrObj === 'object' && !Array.isArray(pathOrObj)) return pathOrObj;
        if (typeof pathOrObj === 'string') {
            try {
                // try dynamic import of provided path (works for relative module paths)
                var mod = await
                import (pathOrObj);
                var exported = mod && (mod.default || mod);
                if (exported && typeof exported === 'object') return exported;
            } catch (e) {
                // dynamic import failed; log and return empty map
                try { console.warn('loadTranslations: dynamic import failed for', pathOrObj, e && e.message ? e.message : e); } catch (_) {}
                return {};
            }
        }
        return {};
    } catch (err) {
        console.error('loadTranslations error:', err && err.stack ? err.stack : err);
        return {};
    }
}

/**
 * i18nHelper(options) -> Express middleware
 * options:
 *  - translations: object or path string (passed to loadTranslations)
 *  - defaultLocale: 'en'
 *  - supported: array of allowed locales (optional)
 *  - attach: property name to attach translator on req (default 't')
 */
export function i18nHelper(options) {
    options = options || {};
    var translationsSource = options.translations || {};
    var defaultLocale = options.defaultLocale || 'en';
    var supported = Array.isArray(options.supported) ? options.supported.slice() : null;
    var attachName = (typeof options.attach === 'string' && options.attach) ? options.attach : 't';

    var translationsCache = null;
    var loadingPromise = null;

    // lazy loader
    function _loadIfNeeded() {
        if (translationsCache) return Promise.resolve(translationsCache);
        if (loadingPromise) return loadingPromise;
        loadingPromise = Promise.resolve(loadTranslations(translationsSource)).then(function(map) {
            translationsCache = map || {};
            loadingPromise = null;
            return translationsCache;
        }).catch(function(e) {
            console.error('i18nHelper loadTranslations failed:', e && e.stack ? e.stack : e);
            translationsCache = {};
            loadingPromise = null;
            return translationsCache;
        });
        return loadingPromise;
    }

    function _makeTranslator(locale, map) {
        return function(key, fallback) {
            try {
                if (!key) return (typeof fallback === 'undefined') ? '' : fallback;
                var langMap = (map && map[locale]) ? map[locale] : ((map && map[defaultLocale]) ? map[defaultLocale] : {});
                var parts = String(key).split('.');
                var cur = langMap;
                for (var i = 0; i < parts.length; i += 1) {
                    if (!cur) break;
                    var k = parts[i];
                    if (Object.prototype.hasOwnProperty.call(cur, k)) cur = cur[k];
                    else { cur = null; break; }
                }
                if (cur === null || typeof cur === 'undefined') {
                    return (typeof fallback === 'undefined') ? String(key) : fallback;
                }
                return cur;
            } catch (e) {
                try { console.error('translator error:', e && e.stack ? e.stack : e); } catch (_) {}
                return (typeof fallback === 'undefined') ? String(key) : fallback;
            }
        };
    }

    // returned middleware
    return async function(req, res, next) {
        try {
            var map = await _loadIfNeeded();
            var candidate = detectLanguage(req) || defaultLocale;
            var normalized = String(candidate).split('-')[0];

            var resolved = defaultLocale;
            if (!supported || supported.length === 0) {
                resolved = normalized;
            } else {
                var found = false;
                for (var j = 0; j < supported.length; j += 1) {
                    if (String(supported[j]) === normalized) { found = true; break; }
                }
                resolved = found ? normalized : defaultLocale;
            }

            try { req.locale = resolved; } catch (_) {}
            try { req[attachName] = _makeTranslator(resolved, map); } catch (_) { req[attachName] = function(k, f) { return (typeof f === 'undefined') ? k : f; }; }

            return next();
        } catch (err) {
            console.error('i18nHelper middleware error:', err && err.stack ? err.stack : err);
            try { req.locale = defaultLocale; } catch (_) {}
            try { req[attachName] = function(k, f) { return (typeof f === 'undefined') ? k : f; }; } catch (_) {}
            return next();
        }
    };
}

// default export same as named
export default i18nHelper;