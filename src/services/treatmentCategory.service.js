const { TreatmentCategory, Treatment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class TreatmentCategoryService {
  async createCategory(data) {
    try {
      const slug = generateSlug(data.name);
      const category = await TreatmentCategory.create({ ...data, slug });
      logger.info(`Treatment category created: ${category.id}`);
      return category;
    } catch (error) {
      logger.error('Error creating treatment category:', error);
      throw new AppError('Failed to create treatment category', 500);
    }
  }

  async getCategoryById(id) {
    const category = await TreatmentCategory.findByPk(id, {
      include: [{ model: Treatment, as: 'treatments' }]
    });
    if (!category) throw new AppError('Treatment category not found', 404);
    return category;
  }

  async getAllCategories(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await TreatmentCategory.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    return { categories: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateCategory(id, data) {
    const category = await this.getCategoryById(id);
    if (data.name) {
      data.slug = generateSlug(data.name);
    }
    await category.update(data);
    logger.info(`Treatment category updated: ${id}`);
    return category;
  }

  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    await category.destroy();
    logger.info(`Treatment category deleted: ${id}`);
    return { message: 'Treatment category deleted successfully' };
  }
}

module.exports = new TreatmentCategoryService();
