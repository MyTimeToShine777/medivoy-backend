const MedicalRecord = require('../models/MedicalRecord.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class MedicalRecordController {
  /**
   * Create a new medical record
   */
  async createMedicalRecord(req, res) {
    try {
      const {
        patientId, doctorId, hospitalId, recordType, recordDate, notes, fileUrl,
      } = req.body;

      // Create medical record
      const medicalRecord = await MedicalRecord.create({
        patientId,
        doctorId,
        hospitalId,
        recordType,
        recordDate,
        notes,
        fileUrl,
      });

      return successResponse(res, {
        message: 'Medical record created successfully',
        data: medicalRecord,
      }, 201);
    } catch (error) {
      logger.error('Create medical record error:', error);
      return errorResponse(res, {
        message: 'Failed to create medical record',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get medical record by ID
   */
  async getMedicalRecord(req, res) {
    try {
      const { id } = req.params;

      // Find medical record
      const medicalRecord = await MedicalRecord.findByPk(id);

      if (!medicalRecord) {
        return errorResponse(res, {
          message: 'Medical record not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'Medical record retrieved successfully',
        data: medicalRecord,
      });
    } catch (error) {
      logger.error('Get medical record error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve medical record',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update medical record
   */
  async updateMedicalRecord(req, res) {
    try {
      const { id } = req.params;
      const {
        recordType, recordDate, notes, fileUrl,
      } = req.body;

      // Find medical record
      const medicalRecord = await MedicalRecord.findByPk(id);

      if (!medicalRecord) {
        return errorResponse(res, {
          message: 'Medical record not found',
        }, 404);
      }

      // Update medical record
      await medicalRecord.update({
        recordType,
        recordDate,
        notes,
        fileUrl,
      });

      return successResponse(res, {
        message: 'Medical record updated successfully',
        data: medicalRecord,
      });
    } catch (error) {
      logger.error('Update medical record error:', error);
      return errorResponse(res, {
        message: 'Failed to update medical record',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete medical record
   */
  async deleteMedicalRecord(req, res) {
    try {
      const { id } = req.params;

      // Find medical record
      const medicalRecord = await MedicalRecord.findByPk(id);

      if (!medicalRecord) {
        return errorResponse(res, {
          message: 'Medical record not found',
        }, 404);
      }

      // Delete medical record
      await medicalRecord.destroy();

      return successResponse(res, {
        message: 'Medical record deleted successfully',
      });
    } catch (error) {
      logger.error('Delete medical record error:', error);
      return errorResponse(res, {
        message: 'Failed to delete medical record',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all medical records for a patient
   */
  async getPatientMedicalRecords(req, res) {
    try {
      const { patientId } = req.params;
      const { page = 1, limit = 10, recordType } = req.query;

      // Build where clause
      const where = { patientId };
      if (recordType) where.recordType = recordType;

      // Get medical records with pagination
      const medicalRecords = await MedicalRecord.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['recordDate', 'DESC']],
      });

      return successResponse(res, {
        message: 'Medical records retrieved successfully',
        data: medicalRecords.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(medicalRecords.count / parseInt(limit, 10)),
          totalRecords: medicalRecords.count,
        },
      });
    } catch (error) {
      logger.error('Get patient medical records error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve medical records',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new MedicalRecordController();
