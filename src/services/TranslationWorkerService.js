'use strict';

import prisma from '../config/prisma.js';

const SUPPORTED_LANGUAGES = ['en', 'ar', 'hi', 'es', 'fr', 'de', 'pt'];
const DEFAULT_LANGUAGE = 'en';

export class TranslationWorkerService {
    constructor() {}

    // ═══════════════════════════════════════════════════════════════════════════════
    // WORKER TRIGGER - TRANSLATE NEW LOCALE
    // ═══════════════════════════════════════════════════════════════════════════════

    async triggerTranslationWorker(newLocale) {
        // Using Prisma transaction
        try {
            if (!SUPPORTED_LANGUAGES.includes(newLocale)) {
                throw new Error(`Unsupported language: ${newLocale}`);
            }

            // Get all translations in default language
            const defaultTranslations = await prisma.translation.findMany({
                where: { language: DEFAULT_LANGUAGE, isActive: true },
                transaction: transaction
            });

            if (defaultTranslations.length === 0) {
                
                return { success: false, error: 'No base translations found' };
            }

            // Create translation jobs for new locale
            const translationJobs = defaultTranslations.map(t => ({
                translationId: `${t.key}_${newLocale}`,
                key: t.key,
                language: newLocale,
                value: null, // Will be filled by worker
                sourceValue: t.value,
                module: t.module,
                status: 'pending',
                createdAt: new Date()
            }));

            // Batch insert translation placeholders
            await Translation.bulkCreate(translationJobs);

            // Log the action
            await prisma.translationLog.create({ 
                data: {
                    logId: this._generateLogId(),
                    action: 'TRANSLATION_WORKER_TRIGGERED',
                    language: newLocale,
                    totalItems: defaultTranslations.length,
                    status: 'initiated',
                    createdAt: new Date()
                }
            });

            

            // Emit worker event or trigger async job
            console.log(`✅ Translation worker triggered for language: ${newLocale}`);

            return {
                success: true,
                message: `Translation worker started for ${newLocale}`,
                totalItems: defaultTranslations.length,
                jobId: this._generateJobId()
            };
        } catch (error) {
            
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // WORKER PROCESS - TRANSLATE BATCH
    // ═══════════════════════════════════════════════════════════════════════════════

    async processTranslationBatch(language, batchSize = 100) {
        // Using Prisma transaction
        try {
            // Get pending translations
            const pendingTranslations = await prisma.translation.findMany({
                where: {
                    language: language,
                    status: 'pending'
                },
                limit: batchSize,
                transaction: transaction
            });

            if (pendingTranslations.length === 0) {
                
                return { success: true, message: 'No pending translations', processed: 0 };
            }

            // Translate using external service (Google Translate, etc.)
            const translatedItems = await Promise.all(
                pendingTranslations.map(t => this._translateText(t.sourceValue, language))
            );

            // Update translations
            for (let i = 0; i < pendingTranslations.length; i++) {
                pendingTranslations[i].value = translatedItems[i];
                pendingTranslations[i].status = 'completed';
                await pendingTranslations[i].save({ transaction: transaction });
            }

            // Log completion
            await prisma.translationLog.create({ 
                data: {
                    logId: this._generateLogId(),
                    action: 'TRANSLATION_BATCH_COMPLETED',
                    language: language,
                    processedItems: pendingTranslations.length,
                    status: 'completed',
                    createdAt: new Date()
                }
            });

            

            console.log(`✅ Processed ${pendingTranslations.length} translations for ${language}`);

            return {
                success: true,
                message: 'Translations processed successfully',
                processed: pendingTranslations.length
            };
        } catch (error) {
            
            console.error(`❌ Translation batch error for ${language}:`, error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CRON JOB - MONITOR PENDING TRANSLATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async cronMonitorTranslations() {
        try {
            console.log('🔄 Starting translation monitor CRON job...');

            // Get pending translation counts by language
            const pendingByLanguage = await prisma.translation.findMany({
                attributes: [
                    'language', [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('translationId')), 'count']
                ],
                where: { status: 'pending' },
                group: ['language'],
                raw: true
            });

            // Process each language with pending translations
            for (const item of pendingByLanguage) {
                if (item.count > 0) {
                    console.log(`⏳ Found ${item.count} pending translations for ${item.language}`);
                    await this.processTranslationBatch(item.language, 50);
                }
            }

            console.log('✅ Translation monitor CRON job completed');

            return { success: true, processed: pendingByLanguage.length };
        } catch (error) {
            console.error('❌ CRON job error:', error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VALIDATION & QUALITY CHECK
    // ═══════════════════════════════════════════════════════════════════════════════

    async validateTranslations(language) {
        try {
            const translations = await prisma.translation.findMany({
                where: { language: language, status: 'completed' }
            });

            let validCount = 0;
            let invalidCount = 0;

            for (const t of translations) {
                if (this._isValidTranslation(t.value, t.sourceValue)) {
                    validCount++;
                } else {
                    invalidCount++;
                    t.status = 'review_needed';
                    await t.save();
                }
            }

            return {
                success: true,
                language: language,
                valid: validCount,
                invalid: invalidCount,
                total: translations.length
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    async _translateText(text, targetLanguage) {
        // TODO: Integrate with translation service
        // For now, return placeholder
        console.log(`Translating to ${targetLanguage}: ${text}`);
        return `[${targetLanguage}] ${text}`;
    }

    _isValidTranslation(translatedText, sourceText) {
        // Basic validation
        if (!translatedText || translatedText.length < 3) return false;
        if (translatedText === sourceText) return false; // Check if actually translated
        return true;
    }

    _generateLogId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'TL-' + ts + rnd;
    }

    _generateJobId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 10000).toString(36).toUpperCase();
        return 'JOB-' + ts + rnd;
    }
}

export default new TranslationWorkerService();