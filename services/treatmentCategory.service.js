const TreatmentCategory = require('../models/TreatmentCategory.model');
const logger = require('../utils/logger');

class TreatmentCategoryService {
  /**
   * Create a new treatment category
   */
  async createTreatmentCategory(data) {
    try {
      const treatmentCategory = await TreatmentCategory.create(data);
      return treatmentCategory;
    } catch (error) {
      logger.error('Create treatment category service error:', error);
      throw error;
    }
  }

  /**
   * Get treatment category by ID
   */
  async getTreatmentCategoryById(id) {
    try {
      const treatmentCategory = await TreatmentCategory.findByPk(id);
      return treatmentCategory;
    } catch (error) {
      logger.error('Get treatment category by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update treatment category
   */
  async updateTreatmentCategory(id, data) {
    try {
      const treatmentCategory = await TreatmentCategory.findByPk(id);
      if (!treatmentCategory) {
        throw new Error('Treatment category not found');
      }

      await treatmentCategory.update(data);
      return treatmentCategory;
    } catch (error) {
      logger.error('Update treatment category service error:', error);
      throw error;
    }
  }

  /**
   * Delete treatment category
   */
  async deleteTreatmentCategory(id) {
    try {
      const treatmentCategory = await TreatmentCategory.findByPk(id);
      if (!treatmentCategory) {
        throw new Error('Treatment category not found');
      }

      await treatmentCategory.destroy();
      return true;
    } catch (error) {
      logger.error('Delete treatment category service error:', error);
      throw error;
    }
  }

  /**
   * Get all treatment categories
   */
  async getAllTreatmentCategories(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const treatmentCategories = await TreatmentCategory.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      });

      return treatmentCategories;
    } catch (error) {
      logger.error('Get all treatment categories service error:', error);
      throw error;
    }
  }
}

module.exports = new TreatmentCategoryService();
