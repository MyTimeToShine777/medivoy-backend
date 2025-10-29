const Hospital = require('../models/Hospital.model');
const logger = require('../utils/logger');

class HospitalService {
  /**
   * Create a new hospital
   */
  async createHospital(data) {
    try {
      const hospital = await Hospital.create(data);
      return hospital;
    } catch (error) {
      logger.error('Create hospital service error:', error);
      throw error;
    }
  }

  /**
   * Get hospital by ID
   */
  async getHospitalById(id) {
    try {
      const hospital = await Hospital.findByPk(id);
      return hospital;
    } catch (error) {
      logger.error('Get hospital by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update hospital
   */
  async updateHospital(id, data) {
    try {
      const hospital = await Hospital.findByPk(id);
      if (!hospital) {
        throw new Error('Hospital not found');
      }
      
      await hospital.update(data);
      return hospital;
    } catch (error) {
      logger.error('Update hospital service error:', error);
      throw error;
    }
  }

  /**
   * Delete hospital
   */
  async deleteHospital(id) {
    try {
      const hospital = await Hospital.findByPk(id);
      if (!hospital) {
        throw new Error('Hospital not found');
      }
      
      await hospital.destroy();
      return true;
    } catch (error) {
      logger.error('Delete hospital service error:', error);
      throw error;
    }
  }

  /**
   * Get all hospitals
   */
  async getAllHospitals(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      
      const hospitals = await Hospital.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return hospitals;
    } catch (error) {
      logger.error('Get all hospitals service error:', error);
      throw error;
    }
  }

  /**
   * Verify hospital
   */
  async verifyHospital(id) {
    try {
      const hospital = await Hospital.findByPk(id);
      if (!hospital) {
        throw new Error('Hospital not found');
      }
      
      await hospital.update({ isVerified: true });
      return hospital;
    } catch (error) {
      logger.error('Verify hospital service error:', error);
      throw error;
    }
  }
}

module.exports = new HospitalService();