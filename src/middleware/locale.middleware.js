const { SUPPORTED_LOCALES, DEFAULT_LOCALE } = require("../constants/locales");

/**
 * Locale middleware - Detect and set user language
 */
const localeMiddleware = (req, res, next) => {
  // Check query parameter
  let locale = req.query.lang || req.query.locale;

  // Check header
  if (!locale) {
    const acceptLanguage = req.headers["accept-language"];
    if (acceptLanguage) {
      const languages = acceptLanguage.split(",");
      const primaryLang = languages[0].split("-")[0].split(";")[0];
      locale = primaryLang;
    }
  }

  // Check if locale is supported
  if (!Object.values(SUPPORTED_LOCALES).includes(locale)) {
    locale = DEFAULT_LOCALE;
  }

  // Attach locale to request
  req.locale = locale;

  next();
};

module.exports = localeMiddleware;
