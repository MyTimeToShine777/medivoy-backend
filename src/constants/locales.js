/**
 * Supported locales/languages
 */

const SUPPORTED_LOCALES = {
  EN: 'en',
  AR: 'ar',
  HI: 'hi',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  ZH: 'zh',
  JA: 'ja',
  RU: 'ru',
  PT: 'pt'
};

const LOCALE_NAMES = {
  [SUPPORTED_LOCALES.EN]: 'English',
  [SUPPORTED_LOCALES.AR]: 'العربية',
  [SUPPORTED_LOCALES.HI]: 'हिन्दी',
  [SUPPORTED_LOCALES.ES]: 'Español',
  [SUPPORTED_LOCALES.FR]: 'Français',
  [SUPPORTED_LOCALES.DE]: 'Deutsch',
  [SUPPORTED_LOCALES.ZH]: '中文',
  [SUPPORTED_LOCALES.JA]: '日本語',
  [SUPPORTED_LOCALES.RU]: 'Русский',
  [SUPPORTED_LOCALES.PT]: 'Português'
};

const DEFAULT_LOCALE = SUPPORTED_LOCALES.EN;

const RTL_LOCALES = [SUPPORTED_LOCALES.AR];

module.exports = {
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  DEFAULT_LOCALE,
  RTL_LOCALES
};