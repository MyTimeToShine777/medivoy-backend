const Patient = require('../models/Patient.model');
const logger = require('../utils/logger');

class PatientService {
  /**
   * Create a new patient
   */
  async createPatient(data) {
    try {
      const patient = await Patient.create(data);
      return patient;
    } catch (error) {
      logger.error('Create patient service error:', error);
      throw error;
    }
  }

  /**
   * Get patient by ID
   */
  async getPatientById(id) {
    try {
      const patient = await Patient.findByPk(id);
      return patient;
    } catch (error) {
      logger.error('Get patient by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update patient
   */
  async updatePatient(id, data) {
    try {
      const patient = await Patient.findByPk(id);
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      await patient.update(data);
      return patient;
    } catch (error) {
      logger.error('Update patient service error:', error);
      throw error;
    }
  }

  /**
   * Delete patient
   */
  async deletePatient(id) {
    try {
      const patient = await Patient.findByPk(id);
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      await patient.destroy();
      return true;
    } catch (error) {
      logger.error('Delete patient service error:', error);
      throw error;
    }
  }

  /**
   * Get all patients
   */
  async getAllPatients(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      
      const patients = await Patient.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return patients;
    } catch (error) {
      logger.error('Get all patients service error:', error);
      throw error;
    }
  }
}

module.exports = new PatientService();