const FAQ = require('../models/FAQ.model');
const logger = require('../utils/logger');

class FAQService {
  /**
   * Create a new FAQ
   */
  async createFAQ(data) {
    try {
      const faq = await FAQ.create(data);
      return faq;
    } catch (error) {
      logger.error('Create FAQ service error:', error);
      throw error;
    }
  }

  /**
   * Get FAQ by ID
   */
  async getFAQById(id) {
    try {
      const faq = await FAQ.findByPk(id);
      return faq;
    } catch (error) {
      logger.error('Get FAQ by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update FAQ
   */
  async updateFAQ(id, data) {
    try {
      const faq = await FAQ.findByPk(id);
      if (!faq) {
        throw new Error('FAQ not found');
      }

      await faq.update(data);
      return faq;
    } catch (error) {
      logger.error('Update FAQ service error:', error);
      throw error;
    }
  }

  /**
   * Delete FAQ
   */
  async deleteFAQ(id) {
    try {
      const faq = await FAQ.findByPk(id);
      if (!faq) {
        throw new Error('FAQ not found');
      }

      await faq.destroy();
      return true;
    } catch (error) {
      logger.error('Delete FAQ service error:', error);
      throw error;
    }
  }

  /**
   * Get all FAQs
   */
  async getAllFAQs(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const faqs = await FAQ.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [
          ['sortOrder', 'ASC'],
          ['createdAt', 'DESC'],
        ],
      });

      return faqs;
    } catch (error) {
      logger.error('Get all FAQs service error:', error);
      throw error;
    }
  }

  /**
   * Get FAQs by category
   */
  async getFAQsByCategory(category, filters = {}) {
    try {
      const { page = 1, limit = 10 } = filters;

      const faqs = await FAQ.findAndCountAll({
        where: { category },
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [
          ['sortOrder', 'ASC'],
          ['createdAt', 'DESC'],
        ],
      });

      return faqs;
    } catch (error) {
      logger.error('Get FAQs by category service error:', error);
      throw error;
    }
  }
}

module.exports = new FAQService();
