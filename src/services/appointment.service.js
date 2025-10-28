const { Appointment, Patient, Doctor, Prescription } = require('../models');
const { AppError } = require('../utils/error-handler');
const { APPOINTMENT_STATUS } = require('../constants/status-codes');
const logger = require('../utils/logger');

class AppointmentService {
  async createAppointment(appointmentData) {
    try {
      const appointment = await Appointment.create({
        ...appointmentData,
        status: APPOINTMENT_STATUS.REQUESTED
      });
      logger.info(`Appointment created: ${appointment.id}`);
      return appointment;
    } catch (error) {
      logger.error('Error creating appointment:', error);
      throw new AppError('Failed to create appointment', 500);
    }
  }

  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' },
        { model: Prescription, as: 'prescriptions' }
      ]
    });
    
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }
    
    return appointment;
  }

  async updateAppointment(appointmentId, updateData) {
    const appointment = await this.getAppointmentById(appointmentId);
    await appointment.update(updateData);
    logger.info(`Appointment updated: ${appointmentId}`);
    return appointment;
  }

  async updateAppointmentStatus(appointmentId, status, notes = null) {
    const appointment = await this.getAppointmentById(appointmentId);
    
    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(appointment.status);
    if (!validTransitions.includes(status)) {
      throw new AppError(`Invalid status transition from ${appointment.status} to ${status}`, 400);
    }
    
    await appointment.update({ status, notes });
    logger.info(`Appointment status updated: ${appointmentId} - ${status}`);
    return appointment;
  }

  getValidStatusTransitions(currentStatus) {
    const transitions = {
      [APPOINTMENT_STATUS.REQUESTED]: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.CANCELLED],
      [APPOINTMENT_STATUS.CONFIRMED]: [APPOINTMENT_STATUS.AWAITING_CONSULTATION, APPOINTMENT_STATUS.CANCELLED],
      [APPOINTMENT_STATUS.AWAITING_CONSULTATION]: [APPOINTMENT_STATUS.IN_PROGRESS],
      [APPOINTMENT_STATUS.IN_PROGRESS]: [APPOINTMENT_STATUS.PRESCRIPTION_PROVIDED],
      [APPOINTMENT_STATUS.PRESCRIPTION_PROVIDED]: [APPOINTMENT_STATUS.FOLLOW_UP_SCHEDULED, APPOINTMENT_STATUS.COMPLETED],
      [APPOINTMENT_STATUS.FOLLOW_UP_SCHEDULED]: [APPOINTMENT_STATUS.COMPLETED],
      [APPOINTMENT_STATUS.COMPLETED]: []
    };
    
    return transitions[currentStatus] || [];
  }

  async getAllAppointments(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Appointment.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ],
      order: [['appointment_date', 'ASC']]
    });

    return {
      appointments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async cancelAppointment(appointmentId, reason) {
    const appointment = await this.getAppointmentById(appointmentId);
    await appointment.update({
      status: APPOINTMENT_STATUS.CANCELLED,
      cancellation_reason: reason
    });
    logger.info(`Appointment cancelled: ${appointmentId}`);
    return appointment;
  }

  async rescheduleAppointment(appointmentId, newDate, newTime) {
    const appointment = await this.getAppointmentById(appointmentId);
    await appointment.update({
      appointment_date: newDate,
      appointment_time: newTime
    });
    logger.info(`Appointment rescheduled: ${appointmentId}`);
    return appointment;
  }
}

module.exports = new AppointmentService();
