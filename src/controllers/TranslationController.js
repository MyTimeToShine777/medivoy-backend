'use strict';

import translationService from '../services/TranslationService.js';

export class TranslationController {
    constructor() {
        this.translationService = translationService;
    }

    async addTranslation(req, res) {
        try {
            const translationData = req.body;

            const result = await this.translationService.addTranslation(translationData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Translation added successfully',
                data: result.translation
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getTranslation(req, res) {
        try {
            const key = req.params.key;
            const language = req.query.language || 'en';

            const result = await this.translationService.getTranslation(key, language);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.translation
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getTranslationsByLanguage(req, res) {
        try {
            const language = req.params.language;
            const filters = {
                category: req.query.category,
                limit: parseInt(req.query.limit) || 100,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.translationService.getTranslationsByLanguage(language, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.translations,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateTranslation(req, res) {
        try {
            const translationId = req.params.translationId;
            const updateData = req.body;

            const result = await this.translationService.updateTranslation(translationId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Translation updated successfully',
                data: result.translation
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteTranslation(req, res) {
        try {
            const translationId = req.params.translationId;

            const result = await this.translationService.deleteTranslation(translationId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Translation deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getSupportedLanguages(req, res) {
        try {
            const result = await this.translationService.getSupportedLanguages();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.languages
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async searchTranslations(req, res) {
        try {
            const query = req.query.q;
            const language = req.query.language || 'en';

            const result = await this.translationService.searchTranslations(query, language);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.translations,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new TranslationController();