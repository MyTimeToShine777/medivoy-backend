const Appointment = require('../models/Appointment.model');
const logger = require('../utils/logger');

class AppointmentService {
  /**
   * Create a new appointment
   */
  async createAppointment(data) {
    try {
      const appointment = await Appointment.create(data);
      return appointment;
    } catch (error) {
      logger.error('Create appointment service error:', error);
      throw error;
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id) {
    try {
      const appointment = await Appointment.findByPk(id);
      return appointment;
    } catch (error) {
      logger.error('Get appointment by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update appointment
   */
  async updateAppointment(id, data) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      await appointment.update(data);
      return appointment;
    } catch (error) {
      logger.error('Update appointment service error:', error);
      throw error;
    }
  }

  /**
   * Delete appointment
   */
  async deleteAppointment(id) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      await appointment.destroy();
      return true;
    } catch (error) {
      logger.error('Delete appointment service error:', error);
      throw error;
    }
  }

  /**
   * Get all appointments
   */
  async getAllAppointments(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const appointments = await Appointment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return appointments;
    } catch (error) {
      logger.error('Get all appointments service error:', error);
      throw error;
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(id, status) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      await appointment.update({ status });
      return appointment;
    } catch (error) {
      logger.error('Update appointment status service error:', error);
      throw error;
    }
  }
}

module.exports = new AppointmentService();
