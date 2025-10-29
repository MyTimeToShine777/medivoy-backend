const Doctor = require('../models/Doctor.model');
const logger = require('../utils/logger');

class DoctorService {
  /**
   * Create a new doctor
   */
  async createDoctor(data) {
    try {
      const doctor = await Doctor.create(data);
      return doctor;
    } catch (error) {
      logger.error('Create doctor service error:', error);
      throw error;
    }
  }

  /**
   * Get doctor by ID
   */
  async getDoctorById(id) {
    try {
      const doctor = await Doctor.findByPk(id);
      return doctor;
    } catch (error) {
      logger.error('Get doctor by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update doctor
   */
  async updateDoctor(id, data) {
    try {
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      await doctor.update(data);
      return doctor;
    } catch (error) {
      logger.error('Update doctor service error:', error);
      throw error;
    }
  }

  /**
   * Delete doctor
   */
  async deleteDoctor(id) {
    try {
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      await doctor.destroy();
      return true;
    } catch (error) {
      logger.error('Delete doctor service error:', error);
      throw error;
    }
  }

  /**
   * Get all doctors
   */
  async getAllDoctors(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const doctors = await Doctor.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return doctors;
    } catch (error) {
      logger.error('Get all doctors service error:', error);
      throw error;
    }
  }

  /**
   * Verify doctor
   */
  async verifyDoctor(id) {
    try {
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      await doctor.update({ isVerified: true });
      return doctor;
    } catch (error) {
      logger.error('Verify doctor service error:', error);
      throw error;
    }
  }
}

module.exports = new DoctorService();
