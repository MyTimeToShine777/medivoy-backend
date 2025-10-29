const MedicalRecord = require('../models/MedicalRecord.model');
const logger = require('../utils/logger');

class MedicalRecordService {
  /**
   * Create a new medical record
   */
  async createMedicalRecord(data) {
    try {
      const medicalRecord = await MedicalRecord.create(data);
      return medicalRecord;
    } catch (error) {
      logger.error('Create medical record service error:', error);
      throw error;
    }
  }

  /**
   * Get medical record by ID
   */
  async getMedicalRecordById(id) {
    try {
      const medicalRecord = await MedicalRecord.findByPk(id);
      return medicalRecord;
    } catch (error) {
      logger.error('Get medical record by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update medical record
   */
  async updateMedicalRecord(id, data) {
    try {
      const medicalRecord = await MedicalRecord.findByPk(id);
      if (!medicalRecord) {
        throw new Error('Medical record not found');
      }
      
      await medicalRecord.update(data);
      return medicalRecord;
    } catch (error) {
      logger.error('Update medical record service error:', error);
      throw error;
    }
  }

  /**
   * Delete medical record
   */
  async deleteMedicalRecord(id) {
    try {
      const medicalRecord = await MedicalRecord.findByPk(id);
      if (!medicalRecord) {
        throw new Error('Medical record not found');
      }
      
      await medicalRecord.destroy();
      return true;
    } catch (error) {
      logger.error('Delete medical record service error:', error);
      throw error;
    }
  }

  /**
   * Get all medical records for a patient
   */
  async getPatientMedicalRecords(patientId, filters = {}) {
    try {
      const { page = 1, limit = 10 } = filters;
      
      const medicalRecords = await MedicalRecord.findAndCountAll({
        where: { patientId },
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return medicalRecords;
    } catch (error) {
      logger.error('Get patient medical records service error:', error);
      throw error;
    }
  }
}

module.exports = new MedicalRecordService();