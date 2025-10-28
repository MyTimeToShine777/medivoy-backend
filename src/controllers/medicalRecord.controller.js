const medicalRecordService = require('../services/medicalRecord.service');
const { successResponse } = require('../utils/response');

class MedicalRecordController {
  async createMedicalRecord(req, res, next) {
    try {
      const record = await medicalRecordService.createMedicalRecord(req.body);
      return successResponse(res, record, 'Medical record created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMedicalRecord(req, res, next) {
    try {
      const record = await medicalRecordService.getMedicalRecordById(req.params.id);
      return successResponse(res, record, 'Medical record retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllMedicalRecords(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await medicalRecordService.getAllMedicalRecords(filters, { page, limit });
      return successResponse(res, result, 'Medical records retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPatientMedicalRecords(req, res, next) {
    try {
      const records = await medicalRecordService.getPatientMedicalRecords(req.params.patientId);
      return successResponse(res, records, 'Patient medical records retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateMedicalRecord(req, res, next) {
    try {
      const record = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
      return successResponse(res, record, 'Medical record updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteMedicalRecord(req, res, next) {
    try {
      const result = await medicalRecordService.deleteMedicalRecord(req.params.id);
      return successResponse(res, result, 'Medical record deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MedicalRecordController();
