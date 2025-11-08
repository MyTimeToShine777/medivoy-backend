'use strict';

import { Translation, TranslationLog } from '../models/index.js';
import { sequelize } from '../config/database.js';
import { CacheService } from '../services/CacheService.js';

const cacheService = new CacheService();

const SUPPORTED_LANGUAGES = ['en', 'ar', 'hi', 'es', 'fr', 'de', 'pt'];
const DEFAULT_LANGUAGE = 'en';

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATION JOB - WORKER PROCESS
// ═══════════════════════════════════════════════════════════════════════════════

export class TranslationJob {
    constructor() {
        this.isRunning = false;
        this.failedItems = [];
        this.successCount = 0;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MAIN WORKER - PROCESS TRANSLATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async processTranslations(language, batchSize = 100) {
        if (this.isRunning) {
            console.warn('⚠️ Translation job already running');
            return { success: false, error: 'Job already running' };
        }

        this.isRunning = true;
        this.failedItems = [];
        this.successCount = 0;

        const transaction = await sequelize.transaction();
        try {
            console.log(`🔄 Starting translation job for ${language}...`);

            // Get pending translations
            const pendingTranslations = await Translation.findAll({
                where: { language: language, status: 'pending' },
                limit: batchSize,
                transaction: transaction
            });

            if (pendingTranslations.length === 0) {
                console.log(`✅ No pending translations for ${language}`);
                this.isRunning = false;
                await transaction.rollback();
                return { success: true, message: 'No pending translations', processed: 0 };
            }

            console.log(`📝 Found ${pendingTranslations.length} pending translations`);

            // Process each translation
            for (let i = 0; i < pendingTranslations.length; i++) {
                const translation = pendingTranslations[i];

                try {
                    // Translate using external service
                    const translatedValue = await this._translateWithRetry(
                        translation.sourceValue,
                        language,
                        3 // max retries
                    );

                    // Update translation
                    translation.value = translatedValue;
                    translation.status = 'completed';
                    await translation.save({ transaction: transaction });

                    this.successCount++;

                    // Progress logging
                    if ((i + 1) % 10 === 0) {
                        console.log(`📊 Progress: ${i + 1}/${pendingTranslations.length}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to translate: ${translation.key}`, error);
                    this.failedItems.push({
                        key: translation.key,
                        error: error.message
                    });

                    // Mark as review_needed
                    translation.status = 'review_needed';
                    await translation.save({ transaction: transaction });
                }
            }

            // Log job completion
            await TranslationLog.create({
                logId: this._generateLogId(),
                action: 'TRANSLATION_JOB_COMPLETED',
                language: language,
                totalItems: pendingTranslations.length,
                successCount: this.successCount,
                failedCount: this.failedItems.length,
                status: 'completed',
                createdAt: new Date()
            }, { transaction: transaction });

            // Clear translation cache
            await cacheService.delete(`translations_${language}`);

            await transaction.commit();

            console.log(`✅ Translation job completed for ${language}`);
            console.log(`📊 Success: ${this.successCount}, Failed: ${this.failedItems.length}`);

            this.isRunning = false;

            return {
                success: true,
                message: 'Translation job completed',
                totalProcessed: pendingTranslations.length,
                successCount: this.successCount,
                failedCount: this.failedItems.length,
                failedItems: this.failedItems
            };
        } catch (error) {
            await transaction.rollback();
            this.isRunning = false;
            console.error('❌ Translation job error:', error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MONITOR - CHECK ALL LANGUAGES
    // ═══════════════════════════════════════════════════════════════════════════════

    async monitorAllLanguages() {
        try {
            console.log('🔍 Monitoring all languages...');

            // Get pending count by language
            const pendingByLanguage = await Translation.findAll({
                attributes: [
                    'language', [sequelize.fn('COUNT', sequelize.col('translationId')), 'count']
                ],
                where: { status: 'pending' },
                group: ['language'],
                raw: true
            });

            if (pendingByLanguage.length === 0) {
                console.log('✅ No pending translations found');
                return { success: true, pendingLanguages: [] };
            }

            console.log(`📊 Languages with pending translations:`, pendingByLanguage);

            // Auto-process languages with many pending items
            for (const lang of pendingByLanguage) {
                if (lang.count > 50) {
                    console.log(`⚡ Auto-processing ${lang.language} (${lang.count} items)...`);
                    await this.processTranslations(lang.language);
                }
            }

            return { success: true, pendingLanguages: pendingByLanguage };
        } catch (error) {
            console.error('❌ Monitoring error:', error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // RETRY LOGIC - WITH EXPONENTIAL BACKOFF
    // ═══════════════════════════════════════════════════════════════════════════════

    async _translateWithRetry(text, language, maxRetries = 3) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await this._callTranslationAPI(text, language);
                return result;
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Translation attempt ${attempt}/${maxRetries} failed:`, error.message);

                // Exponential backoff
                const delay = Math.pow(2, attempt - 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TRANSLATION API CALL
    // ═══════════════════════════════════════════════════════════════════════════════

    async _callTranslationAPI(text, targetLanguage) {
        try {
            // TODO: Integrate with Google Translate, Azure Translator, or similar
            // Example with Google Cloud Translation API:
            /*
            const translate = require('@google-cloud/translate').v2;
            const projectId = process.env.GCP_PROJECT_ID;
            
            const result = await translate.translate(text, targetLanguage);
            return result[0];
            */

            // Placeholder implementation
            console.log(`🔤 Translating to ${targetLanguage}: "${text}"`);
            return `[${targetLanguage.toUpperCase()}] ${text}`;
        } catch (error) {
            console.error('❌ Translation API error:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateLogId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'TL-' + ts + rnd;
    }

    getJobStatus() {
        return {
            isRunning: this.isRunning,
            successCount: this.successCount,
            failedCount: this.failedItems.length,
            failedItems: this.failedItems
        };
    }
}

export default new TranslationJob();