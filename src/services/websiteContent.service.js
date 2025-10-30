const WebsiteContent = require("../models/WebsiteContent.model");
const logger = require("../utils/logger");

class WebsiteContentService {
  /**
   * Create a new website content
   */
  async createContent(data) {
    try {
      const websiteContent = await WebsiteContent.create(data);
      return websiteContent;
    } catch (error) {
      logger.error("Create website content service error:", error);
      throw error;
    }
  }

  /**
   * Get website content by ID
   */
  async getContentById(id) {
    try {
      const websiteContent = await WebsiteContent.findByPk(id);
      return websiteContent;
    } catch (error) {
      logger.error("Get website content by ID service error:", error);
      throw error;
    }
  }

  /**
   * Update website content
   */
  async updateContent(id, data) {
    try {
      const websiteContent = await WebsiteContent.findByPk(id);
      if (!websiteContent) {
        throw new Error("Website content not found");
      }

      await websiteContent.update(data);
      return websiteContent;
    } catch (error) {
      logger.error("Update website content service error:", error);
      throw error;
    }
  }

  /**
   * Delete website content
   */
  async deleteContent(id) {
    try {
      const websiteContent = await WebsiteContent.findByPk(id);
      if (!websiteContent) {
        throw new Error("Website content not found");
      }

      await websiteContent.destroy();
      return true;
    } catch (error) {
      logger.error("Delete website content service error:", error);
      throw error;
    }
  }

  /**
   * Get all website content
   */
  async getAllContent(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const websiteContent = await WebsiteContent.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return websiteContent;
    } catch (error) {
      logger.error("Get all website content service error:", error);
      throw error;
    }
  }

  /**
   * Get content by slug
   */
  async getContentBySlug(slug) {
    try {
      const websiteContent = await WebsiteContent.findOne({
        where: { slug },
      });
      return websiteContent;
    } catch (error) {
      logger.error("Get website content by slug service error:", error);
      throw error;
    }
  }
}

module.exports = new WebsiteContentService();
