const hospitalService = require('../services/hospital.service');
const { successResponse } = require('../utils/response');

class HospitalController {
  async createHospital(req, res, next) {
    try {
      const hospital = await hospitalService.createHospital(req.body);
      return successResponse(res, hospital, 'Hospital created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getHospital(req, res, next) {
    try {
      const hospital = await hospitalService.getHospitalById(req.params.id);
      return successResponse(res, hospital, 'Hospital retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateHospital(req, res, next) {
    try {
      const hospital = await hospitalService.updateHospital(req.params.id, req.body);
      return successResponse(res, hospital, 'Hospital updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteHospital(req, res, next) {
    try {
      const result = await hospitalService.deleteHospital(req.params.id);
      return successResponse(res, result, 'Hospital deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllHospitals(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await hospitalService.getAllHospitals(filters, { page, limit });
      return successResponse(res, result, 'Hospitals retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addDoctor(req, res, next) {
    try {
      const { doctorId } = req.body;
      const hospital = await hospitalService.addDoctorToHospital(req.params.id, doctorId);
      return successResponse(res, hospital, 'Doctor added to hospital successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeDoctor(req, res, next) {
    try {
      const result = await hospitalService.removeDoctorFromHospital(req.params.id, req.params.doctorId);
      return successResponse(res, result, 'Doctor removed from hospital successfully');
    } catch (error) {
      next(error);
    }
  }

  async addTreatment(req, res, next) {
    try {
      const { treatmentId } = req.body;
      const hospital = await hospitalService.addTreatmentToHospital(req.params.id, treatmentId);
      return successResponse(res, hospital, 'Treatment added to hospital successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyHospital(req, res, next) {
    try {
      const hospital = await hospitalService.verifyHospital(req.params.id, req.body);
      return successResponse(res, hospital, 'Hospital verified successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HospitalController();
