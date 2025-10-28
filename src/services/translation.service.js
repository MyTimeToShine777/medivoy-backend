const { Translation } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class TranslationService {
  async createTranslation(data) {
    try {
      const translation = await Translation.create(data);
      logger.info(`Translation created: ${translation.id}`);
      return translation;
    } catch (error) {
      logger.error('Error creating translation:', error);
      throw new AppError('Failed to create translation', 500);
    }
  }

  async getTranslationById(id) {
    const translation = await Translation.findByPk(id);
    if (!translation) throw new AppError('Translation not found', 404);
    return translation;
  }

  async getAllTranslations(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Translation.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { translations: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getTranslationByKey(key, language) {
    const translation = await Translation.findOne({
      where: { key, language }
    });
    return translation ? translation.value : key;
  }

  async updateTranslation(id, data) {
    const translation = await this.getTranslationById(id);
    await translation.update(data);
    logger.info(`Translation updated: ${id}`);
    return translation;
  }

  async deleteTranslation(id) {
    const translation = await this.getTranslationById(id);
    await translation.destroy();
    logger.info(`Translation deleted: ${id}`);
    return { message: 'Translation deleted successfully' };
  }

  async bulkCreateTranslations(translations) {
    try {
      const created = await Translation.bulkCreate(translations);
      logger.info(`Bulk translations created: ${created.length}`);
      return created;
    } catch (error) {
      logger.error('Error bulk creating translations:', error);
      throw new AppError('Failed to bulk create translations', 500);
    }
  }
}

module.exports = new TranslationService();
