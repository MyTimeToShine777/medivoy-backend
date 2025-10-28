const appointmentService = require('../services/appointment.service');
const { successResponse } = require('../utils/response');

class AppointmentController {
  async createAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      return successResponse(res, appointment, 'Appointment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);
      return successResponse(res, appointment, 'Appointment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
      return successResponse(res, appointment, 'Appointment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAppointmentStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status, notes);
      return successResponse(res, appointment, 'Appointment status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllAppointments(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await appointmentService.getAllAppointments(filters, { page, limit });
      return successResponse(res, result, 'Appointments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelAppointment(req, res, next) {
    try {
      const { reason } = req.body;
      const appointment = await appointmentService.cancelAppointment(req.params.id, reason);
      return successResponse(res, appointment, 'Appointment cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async rescheduleAppointment(req, res, next) {
    try {
      const { newDate, newTime } = req.body;
      const appointment = await appointmentService.rescheduleAppointment(req.params.id, newDate, newTime);
      return successResponse(res, appointment, 'Appointment rescheduled successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();
