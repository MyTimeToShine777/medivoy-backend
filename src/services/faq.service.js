const { FAQ } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class FAQService {
  async createFAQ(data) {
    try {
      const faq = await FAQ.create(data);
      logger.info(`FAQ created: ${faq.id}`);
      return faq;
    } catch (error) {
      logger.error('Error creating FAQ:', error);
      throw new AppError('Failed to create FAQ', 500);
    }
  }

  async getFAQById(id) {
    const faq = await FAQ.findByPk(id);
    if (!faq) throw new AppError('FAQ not found', 404);
    return faq;
  }

  async getAllFAQs(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await FAQ.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    return { faqs: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getFAQsByCategory(category, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await FAQ.findAndCountAll({
      where: { category, is_active: true },
      limit,
      offset,
      order: [['sort_order', 'ASC']]
    });
    return { faqs: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateFAQ(id, data) {
    const faq = await this.getFAQById(id);
    await faq.update(data);
    logger.info(`FAQ updated: ${id}`);
    return faq;
  }

  async deleteFAQ(id) {
    const faq = await this.getFAQById(id);
    await faq.destroy();
    logger.info(`FAQ deleted: ${id}`);
    return { message: 'FAQ deleted successfully' };
  }

  async reorderFAQs(orders) {
    try {
      for (const order of orders) {
        await FAQ.update(
          { sort_order: order.sort_order },
          { where: { id: order.id } }
        );
      }
      logger.info('FAQs reordered successfully');
      return { message: 'FAQs reordered successfully' };
    } catch (error) {
      logger.error('Error reordering FAQs:', error);
      throw new AppError('Failed to reorder FAQs', 500);
    }
  }
}

module.exports = new FAQService();
