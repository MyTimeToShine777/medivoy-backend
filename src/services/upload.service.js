const Media = require("../models/Media.model");
const logger = require("../utils/logger");

class UploadService {
  /**
   * Create a new media record
   */
  async createMedia(data) {
    try {
      const media = await Media.create(data);
      return media;
    } catch (error) {
      logger.error("Create media service error:", error);
      throw error;
    }
  }

  /**
   * Get media by ID
   */
  async getMediaById(id) {
    try {
      const media = await Media.findByPk(id);
      return media;
    } catch (error) {
      logger.error("Get media by ID service error:", error);
      throw error;
    }
  }

  /**
   * Update media record
   */
  async updateMedia(id, data) {
    try {
      const media = await Media.findByPk(id);
      if (!media) {
        throw new Error("Media not found");
      }

      await media.update(data);
      return media;
    } catch (error) {
      logger.error("Update media service error:", error);
      throw error;
    }
  }

  /**
   * Delete media record
   */
  async deleteMedia(id) {
    try {
      const media = await Media.findByPk(id);
      if (!media) {
        throw new Error("Media not found");
      }

      await media.destroy();
      return true;
    } catch (error) {
      logger.error("Delete media service error:", error);
      throw error;
    }
  }

  /**
   * Get all media for an entity
   */
  async getEntityMedia(entityType, entityId, filters = {}) {
    try {
      const { page = 1, limit = 10 } = filters;

      const media = await Media.findAndCountAll({
        where: {
          entity_type: entityType,
          entity_id: entityId,
        },
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return media;
    } catch (error) {
      logger.error("Get entity media service error:", error);
      throw error;
    }
  }
}

module.exports = new UploadService();
