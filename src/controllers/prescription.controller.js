const prescriptionService = require('../services/prescription.service');
const { successResponse } = require('../utils/response');

class PrescriptionController {
  async createPrescription(req, res, next) {
    try {
      const prescription = await prescriptionService.createPrescription(req.body);
      return successResponse(res, prescription, 'Prescription created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPrescription(req, res, next) {
    try {
      const prescription = await prescriptionService.getPrescriptionById(req.params.id);
      return successResponse(res, prescription, 'Prescription retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePrescription(req, res, next) {
    try {
      const prescription = await prescriptionService.updatePrescription(req.params.id, req.body);
      return successResponse(res, prescription, 'Prescription updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePrescription(req, res, next) {
    try {
      const result = await prescriptionService.deletePrescription(req.params.id);
      return successResponse(res, result, 'Prescription deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPrescriptions(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await prescriptionService.getAllPrescriptions(filters, { page, limit });
      return successResponse(res, result, 'Prescriptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPatientPrescriptions(req, res, next) {
    try {
      const prescriptions = await prescriptionService.getPatientPrescriptions(req.params.patientId);
      return successResponse(res, prescriptions, 'Patient prescriptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async generatePDF(req, res, next) {
    try {
      const result = await prescriptionService.generatePrescriptionPDF(req.params.id);
      return successResponse(res, result, 'Prescription PDF generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PrescriptionController();
