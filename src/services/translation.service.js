const Translation = require('../models/Translation.model');
const logger = require('../utils/logger');

class TranslationService {
  /**
   * Create a new translation
   */
  async createTranslation(data) {
    try {
      const translation = await Translation.create(data);
      return translation;
    } catch (error) {
      logger.error('Create translation service error:', error);
      throw error;
    }
  }

  /**
   * Get translation by ID
   */
  async getTranslationById(id) {
    try {
      const translation = await Translation.findByPk(id);
      return translation;
    } catch (error) {
      logger.error('Get translation by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update translation
   */
  async updateTranslation(id, data) {
    try {
      const translation = await Translation.findByPk(id);
      if (!translation) {
        throw new Error('Translation not found');
      }

      await translation.update(data);
      return translation;
    } catch (error) {
      logger.error('Update translation service error:', error);
      throw error;
    }
  }

  /**
   * Delete translation
   */
  async deleteTranslation(id) {
    try {
      const translation = await Translation.findByPk(id);
      if (!translation) {
        throw new Error('Translation not found');
      }

      await translation.destroy();
      return true;
    } catch (error) {
      logger.error('Delete translation service error:', error);
      throw error;
    }
  }

  /**
   * Get all translations
   */
  async getAllTranslations(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const translations = await Translation.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['key', 'ASC']],
      });

      return translations;
    } catch (error) {
      logger.error('Get all translations service error:', error);
      throw error;
    }
  }

  /**
   * Get translation by key and language
   */
  async getTranslationByKeyAndLanguage(key, language) {
    try {
      const translation = await Translation.findOne({
        where: { key, language },
      });
      return translation;
    } catch (error) {
      logger.error('Get translation by key and language service error:', error);
      throw error;
    }
  }
}

module.exports = new TranslationService();
