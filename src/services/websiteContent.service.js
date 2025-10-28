const { WebsiteContent } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class WebsiteContentService {
  async createContent(data) {
    try {
      const slug = generateSlug(data.title);
      const content = await WebsiteContent.create({ ...data, slug });
      logger.info(`Website content created: ${content.id}`);
      return content;
    } catch (error) {
      logger.error('Error creating website content:', error);
      throw new AppError('Failed to create website content', 500);
    }
  }

  async getContentById(id) {
    const content = await WebsiteContent.findByPk(id);
    if (!content) throw new AppError('Website content not found', 404);
    return content;
  }

  async getContentBySlug(slug) {
    const content = await WebsiteContent.findOne({ where: { slug, is_published: true } });
    if (!content) throw new AppError('Website content not found', 404);
    return content;
  }

  async getAllContent(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await WebsiteContent.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { content: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getContentByType(type, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await WebsiteContent.findAndCountAll({
      where: { type, is_published: true },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { content: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateContent(id, data) {
    const content = await this.getContentById(id);
    if (data.title) {
      data.slug = generateSlug(data.title);
    }
    await content.update(data);
    logger.info(`Website content updated: ${id}`);
    return content;
  }

  async publishContent(id) {
    const content = await this.getContentById(id);
    await content.update({ is_published: true, published_at: new Date() });
    logger.info(`Website content published: ${id}`);
    return content;
  }

  async unpublishContent(id) {
    const content = await this.getContentById(id);
    await content.update({ is_published: false });
    logger.info(`Website content unpublished: ${id}`);
    return content;
  }

  async deleteContent(id) {
    const content = await this.getContentById(id);
    await content.destroy();
    logger.info(`Website content deleted: ${id}`);
    return { message: 'Website content deleted successfully' };
  }
}

module.exports = new WebsiteContentService();
