const doctorService = require('../services/doctor.service');
const { successResponse } = require('../utils/response');

class DoctorController {
  async createDoctor(req, res, next) {
    try {
      const doctor = await doctorService.createDoctor(req.body);
      return successResponse(res, doctor, 'Doctor created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getDoctor(req, res, next) {
    try {
      const doctor = await doctorService.getDoctorById(req.params.id);
      return successResponse(res, doctor, 'Doctor retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateDoctor(req, res, next) {
    try {
      const doctor = await doctorService.updateDoctor(req.params.id, req.body);
      return successResponse(res, doctor, 'Doctor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctor(req, res, next) {
    try {
      const result = await doctorService.deleteDoctor(req.params.id);
      return successResponse(res, result, 'Doctor deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllDoctors(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await doctorService.getAllDoctors(filters, { page, limit });
      return successResponse(res, result, 'Doctors retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(req, res, next) {
    try {
      const doctor = await doctorService.updateAvailability(req.params.id, req.body);
      return successResponse(res, doctor, 'Doctor availability updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAppointments(req, res, next) {
    try {
      const appointments = await doctorService.getDoctorAppointments(req.params.id, req.query);
      return successResponse(res, appointments, 'Doctor appointments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyDoctor(req, res, next) {
    try {
      const doctor = await doctorService.verifyDoctor(req.params.id, req.body);
      return successResponse(res, doctor, 'Doctor verified successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoctorController();
