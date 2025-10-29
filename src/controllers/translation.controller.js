const Translation = require('../models/Translation.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class TranslationController {
  /**
   * Create a new translation
   */
  async createTranslation(req, res) {
    try {
      const { key, language, text } = req.body;
      
      // Create translation
      const translation = await Translation.create({
        key,
        language,
        text,
      });
      
      return successResponse(res, {
        message: 'Translation created successfully',
        data: translation,
      }, 201);
    } catch (error) {
      logger.error('Create translation error:', error);
      return errorResponse(res, {
        message: 'Failed to create translation',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get translation by ID
   */
  async getTranslation(req, res) {
    try {
      const { id } = req.params;
      
      // Find translation
      const translation = await Translation.findByPk(id);
      
      if (!translation) {
        return errorResponse(res, {
          message: 'Translation not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Translation retrieved successfully',
        data: translation,
      });
    } catch (error) {
      logger.error('Get translation error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve translation',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update translation
   */
  async updateTranslation(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      
      // Find translation
      const translation = await Translation.findByPk(id);
      
      if (!translation) {
        return errorResponse(res, {
          message: 'Translation not found',
        }, 404);
      }
      
      // Update translation
      await translation.update({ text });
      
      return successResponse(res, {
        message: 'Translation updated successfully',
        data: translation,
      });
    } catch (error) {
      logger.error('Update translation error:', error);
      return errorResponse(res, {
        message: 'Failed to update translation',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete translation
   */
  async deleteTranslation(req, res) {
    try {
      const { id } = req.params;
      
      // Find translation
      const translation = await Translation.findByPk(id);
      
      if (!translation) {
        return errorResponse(res, {
          message: 'Translation not found',
        }, 404);
      }
      
      // Delete translation
      await translation.destroy();
      
      return successResponse(res, {
        message: 'Translation deleted successfully',
      });
    } catch (error) {
      logger.error('Delete translation error:', error);
      return errorResponse(res, {
        message: 'Failed to delete translation',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all translations
   */
  async getAllTranslations(req, res) {
    try {
      const { page = 1, limit = 10, language } = req.query;
      
      // Build where clause
      const where = {};
      if (language) where.language = language;
      
      // Get translations with pagination
      const translations = await Translation.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['key', 'ASC']],
      });
      
      return successResponse(res, {
        message: 'Translations retrieved successfully',
        data: translations.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(translations.count / parseInt(limit, 10)),
          totalRecords: translations.count,
        },
      });
    } catch (error) {
      logger.error('Get all translations error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve translations',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get translation by key and language
   */
  async getTranslationByKey(req, res) {
    try {
      const { key, language } = req.params;
      
      // Find translation
      const translation = await Translation.findOne({
        where: { key, language },
      });
      
      if (!translation) {
        return errorResponse(res, {
          message: 'Translation not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Translation retrieved successfully',
        data: translation,
      });
    } catch (error) {
      logger.error('Get translation by key error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve translation',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Bulk update translations
   */
  async bulkUpdateTranslations(req, res) {
    try {
      const { translations } = req.body;
      
      // Update translations in bulk
      const updatedTranslations = [];
      for (const translationData of translations) {
        const { key, language, text } = translationData;
        
        // Find existing translation or create new one
        const [translation, created] = await Translation.findOrCreate({
          where: { key, language },
          defaults: { key, language, text },
        });
        
        if (!created) {
          // Update existing translation
          await translation.update({ text });
        }
        
        updatedTranslations.push(translation);
      }
      
      return successResponse(res, {
        message: 'Translations updated successfully',
        data: updatedTranslations,
      });
    } catch (error) {
      logger.error('Bulk update translations error:', error);
      return errorResponse(res, {
        message: 'Failed to update translations',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new TranslationController();