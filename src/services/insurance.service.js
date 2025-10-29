const Insurance = require('../models/Insurance.model');
const logger = require('../utils/logger');

class InsuranceService {
  /**
   * Create a new insurance provider
   */
  async createInsurance(data) {
    try {
      const insurance = await Insurance.create(data);
      return insurance;
    } catch (error) {
      logger.error('Create insurance service error:', error);
      throw error;
    }
  }

  /**
   * Get insurance provider by ID
   */
  async getInsuranceById(id) {
    try {
      const insurance = await Insurance.findByPk(id);
      return insurance;
    } catch (error) {
      logger.error('Get insurance by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update insurance provider
   */
  async updateInsurance(id, data) {
    try {
      const insurance = await Insurance.findByPk(id);
      if (!insurance) {
        throw new Error('Insurance provider not found');
      }

      await insurance.update(data);
      return insurance;
    } catch (error) {
      logger.error('Update insurance service error:', error);
      throw error;
    }
  }

  /**
   * Delete insurance provider
   */
  async deleteInsurance(id) {
    try {
      const insurance = await Insurance.findByPk(id);
      if (!insurance) {
        throw new Error('Insurance provider not found');
      }

      await insurance.destroy();
      return true;
    } catch (error) {
      logger.error('Delete insurance service error:', error);
      throw error;
    }
  }

  /**
   * Get all insurance providers
   */
  async getAllInsurances(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const insurances = await Insurance.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return insurances;
    } catch (error) {
      logger.error('Get all insurances service error:', error);
      throw error;
    }
  }
}

module.exports = new InsuranceService();
