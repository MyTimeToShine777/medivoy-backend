const translationService = require('../services/translation.service');
const { successResponse } = require('../utils/response');

class TranslationController {
  async createTranslation(req, res, next) {
    try {
      const translation = await translationService.createTranslation(req.body);
      return successResponse(res, translation, 'Translation created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTranslation(req, res, next) {
    try {
      const translation = await translationService.getTranslationById(req.params.id);
      return successResponse(res, translation, 'Translation retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllTranslations(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await translationService.getAllTranslations(filters, { page, limit });
      return successResponse(res, result, 'Translations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTranslationByKey(req, res, next) {
    try {
      const { key, language } = req.query;
      const translation = await translationService.getTranslationByKey(key, language);
      return successResponse(res, { translation }, 'Translation retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTranslation(req, res, next) {
    try {
      const translation = await translationService.updateTranslation(req.params.id, req.body);
      return successResponse(res, translation, 'Translation updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTranslation(req, res, next) {
    try {
      const result = await translationService.deleteTranslation(req.params.id);
      return successResponse(res, result, 'Translation deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async bulkCreateTranslations(req, res, next) {
    try {
      const translations = await translationService.bulkCreateTranslations(req.body.translations);
      return successResponse(res, translations, 'Translations created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TranslationController();
