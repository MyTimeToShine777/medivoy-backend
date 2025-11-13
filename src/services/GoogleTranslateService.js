// Google Translate Service - Language translation
// NO optional chaining - Production Ready
import { Translate } from '@google-cloud/translate/build/src';

class GoogleTranslateService {
    constructor() {
        this.translate = new Translate({
            projectId: process.env.GOOGLE_PROJECT_ID,
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });

        this.supportedLanguages = {
            en: 'English',
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            it: 'Italian',
            pt: 'Portuguese',
            hi: 'Hindi',
            ta: 'Tamil',
            te: 'Telugu',
            ml: 'Malayalam',
            kn: 'Kannada',
            bn: 'Bengali',
            ar: 'Arabic',
            zh: 'Chinese',
            ja: 'Japanese',
        };
    }

    // ========== TRANSLATE TEXT ==========
    async translateText(text, targetLanguage, sourceLanguage = 'en') {
        try {
            if (!text || typeof text !== 'string') {
                return { success: false, error: 'Text must be a non-empty string' };
            }

            if (!this.supportedLanguages[targetLanguage]) {
                return { success: false, error: 'Target language not supported' };
            }

            const translations = await this.translate.translate(text, {
                from: sourceLanguage,
                to: targetLanguage,
            });

            const translatedText = translations[0];

            return {
                success: true,
                data: {
                    originalText: text,
                    translatedText,
                    sourceLanguage,
                    targetLanguage,
                    timestamp: new Date(),
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== TRANSLATE OBJECT ==========
    async translateObject(obj, targetLanguage, fieldsToTranslate = []) {
        try {
            const translated = {...obj };

            for (const field of fieldsToTranslate) {
                if (obj[field] && typeof obj[field] === 'string') {
                    const result = await this.translateText(obj[field], targetLanguage);

                    if (result.success) {
                        translated[field] = result.data.translatedText;
                    }
                }
            }

            return { success: true, data: translated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DETECT LANGUAGE ==========
    async detectLanguage(text) {
        try {
            if (!text || typeof text !== 'string') {
                return { success: false, error: 'Text must be a non-empty string' };
            }

            const detections = await this.translate.detect(text);
            const detection = detections[0];

            return {
                success: true,
                data: {
                    detectedLanguage: detection.language,
                    languageName: this.supportedLanguages[detection.language] || 'Unknown',
                    confidence: (detection.confidence * 100).toFixed(2),
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET SUPPORTED LANGUAGES ==========
    getSupportedLanguages() {
        try {
            const languages = Object.entries(this.supportedLanguages).map(
                ([code, name]) => ({ code, name })
            );

            return { success: true, data: languages };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== BATCH TRANSLATE ==========
    async batchTranslate(texts, targetLanguage) {
        try {
            if (!Array.isArray(texts) || texts.length === 0) {
                return { success: false, error: 'Texts must be a non-empty array' };
            }

            const results = [];

            for (const text of texts) {
                const result = await this.translateText(text, targetLanguage);

                if (result.success) {
                    results.push({
                        original: text,
                        translated: result.data.translatedText,
                    });
                }
            }

            return { success: true, data: results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== AUTO-DETECT AND TRANSLATE ==========
    async autoDetectAndTranslate(text, targetLanguage) {
        try {
            const detection = await this.detectLanguage(text);

            if (!detection.success) {
                return detection;
            }

            const sourceLanguage = detection.data.detectedLanguage;

            if (sourceLanguage === targetLanguage) {
                return {
                    success: true,
                    data: {
                        originalText: text,
                        translatedText: text,
                        message: 'Text is already in target language',
                    },
                };
            }

            return await this.translateText(text, targetLanguage, sourceLanguage);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VALIDATE LANGUAGE CODE ==========
    validateLanguageCode(code) {
        const isValid = code && this.supportedLanguages[code] !== undefined;

        return {
            success: true,
            isValid,
            error: isValid ? null : 'Invalid language code',
        };
    }
}

export default new GoogleTranslateService();