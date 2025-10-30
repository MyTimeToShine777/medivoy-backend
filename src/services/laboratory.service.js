const Laboratory = require("../models/Laboratory.model");
const logger = require("../utils/logger");

class LaboratoryService {
  /**
   * Create a new laboratory
   */
  async createLaboratory(data) {
    try {
      const laboratory = await Laboratory.create(data);
      return laboratory;
    } catch (error) {
      logger.error("Create laboratory service error:", error);
      throw error;
    }
  }

  /**
   * Get laboratory by ID
   */
  async getLaboratoryById(id) {
    try {
      const laboratory = await Laboratory.findByPk(id);
      return laboratory;
    } catch (error) {
      logger.error("Get laboratory by ID service error:", error);
      throw error;
    }
  }

  /**
   * Update laboratory
   */
  async updateLaboratory(id, data) {
    try {
      const laboratory = await Laboratory.findByPk(id);
      if (!laboratory) {
        throw new Error("Laboratory not found");
      }

      await laboratory.update(data);
      return laboratory;
    } catch (error) {
      logger.error("Update laboratory service error:", error);
      throw error;
    }
  }

  /**
   * Delete laboratory
   */
  async deleteLaboratory(id) {
    try {
      const laboratory = await Laboratory.findByPk(id);
      if (!laboratory) {
        throw new Error("Laboratory not found");
      }

      await laboratory.destroy();
      return true;
    } catch (error) {
      logger.error("Delete laboratory service error:", error);
      throw error;
    }
  }

  /**
   * Get all laboratories
   */
  async getAllLaboratories(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const laboratories = await Laboratory.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return laboratories;
    } catch (error) {
      logger.error("Get all laboratories service error:", error);
      throw error;
    }
  }
}

module.exports = new LaboratoryService();
