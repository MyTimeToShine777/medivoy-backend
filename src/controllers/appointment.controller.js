const Appointment = require('../models/Appointment.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class AppointmentController {
  /**
   * Create a new appointment
   */
  async createAppointment(req, res) {
    try {
      const { patientId, doctorId, hospitalId, scheduledAt, notes } = req.body;
      
      // Create appointment
      const appointment = await Appointment.create({
        patientId,
        doctorId,
        hospitalId,
        scheduledAt,
        notes,
      });
      
      return successResponse(res, {
        message: 'Appointment created successfully',
        data: appointment,
      }, 201);
    } catch (error) {
      logger.error('Create appointment error:', error);
      return errorResponse(res, {
        message: 'Failed to create appointment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(req, res) {
    try {
      const { id } = req.params;
      
      // Find appointment
      const appointment = await Appointment.findByPk(id);
      
      if (!appointment) {
        return errorResponse(res, {
          message: 'Appointment not found',
          code: 'APPOINTMENT_NOT_FOUND',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Appointment retrieved successfully',
        data: appointment,
      });
    } catch (error) {
      logger.error('Get appointment error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve appointment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update appointment
   */
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const { scheduledAt, notes, status } = req.body;
      
      // Find appointment
      const appointment = await Appointment.findByPk(id);
      
      if (!appointment) {
        return errorResponse(res, {
          message: 'Appointment not found',
          code: 'APPOINTMENT_NOT_FOUND',
        }, 404);
      }
      
      // Update appointment
      await appointment.update({
        scheduledAt,
        notes,
        status,
      });
      
      return successResponse(res, {
        message: 'Appointment updated successfully',
        data: appointment,
      });
    } catch (error) {
      logger.error('Update appointment error:', error);
      return errorResponse(res, {
        message: 'Failed to update appointment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Find appointment
      const appointment = await Appointment.findByPk(id);
      
      if (!appointment) {
        return errorResponse(res, {
          message: 'Appointment not found',
          code: 'APPOINTMENT_NOT_FOUND',
        }, 404);
      }
      
      // Update appointment status
      await appointment.update({ status });
      
      return successResponse(res, {
        message: 'Appointment status updated successfully',
        data: appointment,
      });
    } catch (error) {
      logger.error('Update appointment status error:', error);
      return errorResponse(res, {
        message: 'Failed to update appointment status',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all appointments
   */
  async getAllAppointments(req, res) {
    try {
      const { page = 1, limit = 10, status, patientId, doctorId } = req.query;
      
      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (patientId) where.patientId = patientId;
      if (doctorId) where.doctorId = doctorId;
      
      // Get appointments with pagination
      const appointments = await Appointment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return successResponse(res, {
        message: 'Appointments retrieved successfully',
        data: appointments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(appointments.count / parseInt(limit, 10)),
          totalRecords: appointments.count,
        },
      });
    } catch (error) {
      logger.error('Get all appointments error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve appointments',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      
      // Find appointment
      const appointment = await Appointment.findByPk(id);
      
      if (!appointment) {
        return errorResponse(res, {
          message: 'Appointment not found',
          code: 'APPOINTMENT_NOT_FOUND',
        }, 404);
      }
      
      // Update appointment status to cancelled
      await appointment.update({ status: 'cancelled' });
      
      return successResponse(res, {
        message: 'Appointment cancelled successfully',
        data: appointment,
      });
    } catch (error) {
      logger.error('Cancel appointment error:', error);
      return errorResponse(res, {
        message: 'Failed to cancel appointment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(req, res) {
    try {
      const { id } = req.params;
      const { scheduledAt } = req.body;
      
      // Find appointment
      const appointment = await Appointment.findByPk(id);
      
      if (!appointment) {
        return errorResponse(res, {
          message: 'Appointment not found',
          code: 'APPOINTMENT_NOT_FOUND',
        }, 404);
      }
      
      // Update appointment scheduled time
      await appointment.update({ scheduledAt });
      
      return successResponse(res, {
        message: 'Appointment rescheduled successfully',
        data: appointment,
      });
    } catch (error) {
      logger.error('Reschedule appointment error:', error);
      return errorResponse(res, {
        message: 'Failed to reschedule appointment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get patient appointments
   */
  async getPatientAppointments(req, res) {
    try {
      const { patientId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Build where clause
      const where = { patient_id: patientId };
      if (status) where.status = status;

      // Get appointments with pagination
      const appointments = await Appointment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['created_at', 'DESC']],
      });

      return successResponse(res, {
        message: 'Patient appointments retrieved successfully',
        data: appointments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(appointments.count / parseInt(limit, 10)),
          totalRecords: appointments.count,
        },
      });
    } catch (error) {
      logger.error('Get patient appointments error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve patient appointments',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get doctor appointments
   */
  async getDoctorAppointments(req, res) {
    try {
      const { doctorId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Build where clause
      const where = { doctor_id: doctorId };
      if (status) where.status = status;

      // Get appointments with pagination
      const appointments = await Appointment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['created_at', 'DESC']],
      });

      return successResponse(res, {
        message: 'Doctor appointments retrieved successfully',
        data: appointments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(appointments.count / parseInt(limit, 10)),
          totalRecords: appointments.count,
        },
      });
    } catch (error) {
      logger.error('Get doctor appointments error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve doctor appointments',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new AppointmentController();