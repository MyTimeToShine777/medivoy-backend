const { Patient, User, MedicalRecord, Appointment, Booking } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class PatientService {
  async createPatient(patientData) {
    try {
      const patient = await Patient.create(patientData);
      logger.info(`Patient created: ${patient.id}`);
      return patient;
    } catch (error) {
      logger.error('Error creating patient:', error);
      throw new AppError('Failed to create patient', 500);
    }
  }

  async getPatientById(patientId) {
    const patient = await Patient.findByPk(patientId, {
      include: [
        { model: User, as: 'user' },
        { model: MedicalRecord, as: 'medical_records' }
      ]
    });
    
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    
    return patient;
  }

  async updatePatient(patientId, updateData) {
    const patient = await this.getPatientById(patientId);
    await patient.update(updateData);
    logger.info(`Patient updated: ${patientId}`);
    return patient;
  }

  async deletePatient(patientId) {
    const patient = await this.getPatientById(patientId);
    await patient.destroy();
    logger.info(`Patient deleted: ${patientId}`);
    return { message: 'Patient deleted successfully' };
  }

  async getAllPatients(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Patient.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']]
    });

    return {
      patients: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateMedicalHistory(patientId, medicalHistoryData) {
    const patient = await this.getPatientById(patientId);
    await patient.update({ medical_history: medicalHistoryData });
    logger.info(`Patient medical history updated: ${patientId}`);
    return patient;
  }

  async getPatientAppointments(patientId, filters = {}) {
    const appointments = await Appointment.findAll({
      where: { patient_id: patientId, ...filters },
      order: [['appointment_date', 'DESC']]
    });
    return appointments;
  }

  async getPatientBookings(patientId, filters = {}) {
    const bookings = await Booking.findAll({
      where: { patient_id: patientId, ...filters },
      order: [['created_at', 'DESC']]
    });
    return bookings;
  }
}

module.exports = new PatientService();
