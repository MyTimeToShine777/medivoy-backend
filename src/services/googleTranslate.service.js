const { Translate } = require('@google-cloud/translate').v2;
const franc = require('franc');
const logger = require('../utils/logger');

class GoogleTranslateService {
  constructor() {
    // Initialize Google Translate client
    // If credentials are provided via environment variable
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      this.translate = new Translate({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      });
    } else if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      this.translate = new Translate({
        key: process.env.GOOGLE_TRANSLATE_API_KEY
      });
    } else {
      logger.warn('Google Translate credentials not configured. Translation service will not work.');
      this.translate = null;
    }

    this.defaultTargetLanguage = 'en';
    this.supportedLanguages = [
      'en', 'hi', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar'
    ];
  }

  /**
   * Detect language of text
   * @param {string} text - Text to detect language
   * @returns {Promise<string>} - Detected language code
   */
  async detectLanguage(text) {
    try {
      if (!text || typeof text !== 'string') {
        return this.defaultTargetLanguage;
      }

      // Use franc for quick language detection
      const detectedLang = franc(text, { minLength: 3 });
      
      // If franc returns 'und' (undefined), try Google Translate
      if (detectedLang === 'und' && this.translate) {
        const [detection] = await this.translate.detect(text);
        return detection.language || this.defaultTargetLanguage;
      }

      // Convert franc's ISO 639-3 to ISO 639-1
      const langMap = {
        'eng': 'en',
        'hin': 'hi',
        'spa': 'es',
        'fra': 'fr',
        'deu': 'de',
        'ita': 'it',
        'por': 'pt',
        'rus': 'ru',
        'jpn': 'ja',
        'kor': 'ko',
        'cmn': 'zh',
        'ara': 'ar'
      };

      return langMap[detectedLang] || this.defaultTargetLanguage;
    } catch (error) {
      logger.error('Language detection error:', error);
      return this.defaultTargetLanguage;
    }
  }

  /**
   * Translate text to target language
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Object>} - Translation result
   */
  async translateText(text, targetLanguage = 'en', sourceLanguage = null) {
    try {
      if (!this.translate) {
        throw new Error('Translation service not configured');
      }

      if (!text || typeof text !== 'string') {
        return {
          originalText: text,
          translatedText: text,
          sourceLanguage: this.defaultTargetLanguage,
          targetLanguage: targetLanguage,
          isTranslated: false
        };
      }

      // Detect source language if not provided
      if (!sourceLanguage) {
        sourceLanguage = await this.detectLanguage(text);
      }

      // If source and target are the same, no translation needed
      if (sourceLanguage === targetLanguage) {
        return {
          originalText: text,
          translatedText: text,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
          isTranslated: false
        };
      }

      // Perform translation
      const [translation] = await this.translate.translate(text, {
        from: sourceLanguage,
        to: targetLanguage
      });

      return {
        originalText: text,
        translatedText: translation,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        isTranslated: true
      };
    } catch (error) {
      logger.error('Translation error:', error);
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: sourceLanguage || this.defaultTargetLanguage,
        targetLanguage: targetLanguage,
        isTranslated: false,
        error: error.message
      };
    }
  }

  /**
   * Translate multiple texts
   * @param {Array<string>} texts - Array of texts to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Array>} - Array of translation results
   */
  async translateBatch(texts, targetLanguage = 'en', sourceLanguage = null) {
    try {
      if (!this.translate) {
        throw new Error('Translation service not configured');
      }

      if (!Array.isArray(texts) || texts.length === 0) {
        return [];
      }

      // Detect source language if not provided
      if (!sourceLanguage && texts.length > 0) {
        sourceLanguage = await this.detectLanguage(texts[0]);
      }

      // If source and target are the same, no translation needed
      if (sourceLanguage === targetLanguage) {
        return texts.map(text => ({
          originalText: text,
          translatedText: text,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
          isTranslated: false
        }));
      }

      // Perform batch translation
      const [translations] = await this.translate.translate(texts, {
        from: sourceLanguage,
        to: targetLanguage
      });

      return texts.map((text, index) => ({
        originalText: text,
        translatedText: translations[index],
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        isTranslated: true
      }));
    } catch (error) {
      logger.error('Batch translation error:', error);
      return texts.map(text => ({
        originalText: text,
        translatedText: text,
        sourceLanguage: sourceLanguage || this.defaultTargetLanguage,
        targetLanguage: targetLanguage,
        isTranslated: false,
        error: error.message
      }));
    }
  }

  /**
   * Translate object fields
   * @param {Object} obj - Object with fields to translate
   * @param {Array<string>} fields - Fields to translate
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<Object>} - Object with translated fields
   */
  async translateObject(obj, fields, targetLanguage = 'en') {
    try {
      const result = { ...obj };
      const textsToTranslate = [];
      const fieldMap = [];

      // Collect texts to translate
      for (const field of fields) {
        if (obj[field] && typeof obj[field] === 'string') {
          textsToTranslate.push(obj[field]);
          fieldMap.push(field);
        }
      }

      if (textsToTranslate.length === 0) {
        return result;
      }

      // Translate batch
      const translations = await this.translateBatch(textsToTranslate, targetLanguage);

      // Map translations back to fields
      translations.forEach((translation, index) => {
        const field = fieldMap[index];
        result[field] = translation.translatedText;
        result[`${field}_original`] = translation.originalText;
        result[`${field}_language`] = translation.sourceLanguage;
      });

      return result;
    } catch (error) {
      logger.error('Object translation error:', error);
      return obj;
    }
  }

  /**
   * Get supported languages
   * @returns {Promise<Array>} - Array of supported languages
   */
  async getSupportedLanguages() {
    try {
      if (!this.translate) {
        return this.supportedLanguages.map(code => ({ code, name: code }));
      }

      const [languages] = await this.translate.getLanguages();
      return languages;
    } catch (error) {
      logger.error('Get supported languages error:', error);
      return this.supportedLanguages.map(code => ({ code, name: code }));
    }
  }

  /**
   * Check if translation is needed
   * @param {string} text - Text to check
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<boolean>} - True if translation is needed
   */
  async needsTranslation(text, targetLanguage = 'en') {
    try {
      const detectedLanguage = await this.detectLanguage(text);
      return detectedLanguage !== targetLanguage;
    } catch (error) {
      logger.error('Needs translation check error:', error);
      return false;
    }
  }
}

module.exports = new GoogleTranslateService();