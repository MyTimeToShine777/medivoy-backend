const Treatment = require('../models/Treatment.model');
const TreatmentCategory = require('../models/TreatmentCategory.model');
const TreatmentSubcategory = require('../models/TreatmentSubcategory.model');
const logger = require('../utils/logger');

class TreatmentService {
  /**
   * Create a new treatment
   */
  async createTreatment(data) {
    try {
      const treatment = await Treatment.create(data);
      return treatment;
    } catch (error) {
      logger.error('Create treatment service error:', error);
      throw error;
    }
  }

  /**
   * Get treatment by ID
   */
  async getTreatmentById(id) {
    try {
      const treatment = await Treatment.findByPk(id, {
        include: [
          {
            model: TreatmentCategory,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
          {
            model: TreatmentSubcategory,
            as: 'subcategory',
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });
      return treatment;
    } catch (error) {
      logger.error('Get treatment by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update treatment
   */
  async updateTreatment(id, data) {
    try {
      const treatment = await Treatment.findByPk(id);
      if (!treatment) {
        throw new Error('Treatment not found');
      }
      
      await treatment.update(data);
      return treatment;
    } catch (error) {
      logger.error('Update treatment service error:', error);
      throw error;
    }
  }

  /**
   * Delete treatment
   */
  async deleteTreatment(id) {
    try {
      const treatment = await Treatment.findByPk(id);
      if (!treatment) {
        throw new Error('Treatment not found');
      }
      
      await treatment.destroy();
      return true;
    } catch (error) {
      logger.error('Delete treatment service error:', error);
      throw error;
    }
  }

  /**
   * Get all treatments
   */
  async getAllTreatments(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      
      const treatments = await Treatment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return treatments;
    } catch (error) {
      logger.error('Get all treatments service error:', error);
      throw error;
    }
  }
}

module.exports = new TreatmentService();