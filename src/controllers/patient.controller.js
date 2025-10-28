const patientService = require('../services/patient.service');
const { successResponse } = require('../utils/response');

class PatientController {
  async createPatient(req, res, next) {
    try {
      const patient = await patientService.createPatient(req.body);
      return successResponse(res, patient, 'Patient created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPatient(req, res, next) {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      return successResponse(res, patient, 'Patient retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePatient(req, res, next) {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      return successResponse(res, patient, 'Patient updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePatient(req, res, next) {
    try {
      const result = await patientService.deletePatient(req.params.id);
      return successResponse(res, result, 'Patient deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPatients(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await patientService.getAllPatients(filters, { page, limit });
      return successResponse(res, result, 'Patients retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateMedicalHistory(req, res, next) {
    try {
      const patient = await patientService.updateMedicalHistory(req.params.id, req.body);
      return successResponse(res, patient, 'Medical history updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAppointments(req, res, next) {
    try {
      const appointments = await patientService.getPatientAppointments(req.params.id, req.query);
      return successResponse(res, appointments, 'Patient appointments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req, res, next) {
    try {
      const bookings = await patientService.getPatientBookings(req.params.id, req.query);
      return successResponse(res, bookings, 'Patient bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PatientController();
