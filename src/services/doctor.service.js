const { Doctor, User, Hospital, Appointment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class DoctorService {
  async createDoctor(doctorData) {
    try {
      const doctor = await Doctor.create(doctorData);
      logger.info(`Doctor created: ${doctor.id}`);
      return doctor;
    } catch (error) {
      logger.error('Error creating doctor:', error);
      throw new AppError('Failed to create doctor', 500);
    }
  }

  async getDoctorById(doctorId) {
    const doctor = await Doctor.findByPk(doctorId, {
      include: [
        { model: User, as: 'user' },
        { model: Hospital, as: 'hospitals', through: { attributes: [] } }
      ]
    });
    
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
    
    return doctor;
  }

  async updateDoctor(doctorId, updateData) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.update(updateData);
    logger.info(`Doctor updated: ${doctorId}`);
    return doctor;
  }

  async deleteDoctor(doctorId) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.destroy();
    logger.info(`Doctor deleted: ${doctorId}`);
    return { message: 'Doctor deleted successfully' };
  }

  async getAllDoctors(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Doctor.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: User, as: 'user' },
        { model: Hospital, as: 'hospitals', through: { attributes: [] } }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      doctors: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateAvailability(doctorId, availabilityData) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.update({ availability: availabilityData });
    logger.info(`Doctor availability updated: ${doctorId}`);
    return doctor;
  }

  async getDoctorAppointments(doctorId, filters = {}) {
    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId, ...filters },
      order: [['appointment_date', 'ASC']]
    });
    return appointments;
  }

  async verifyDoctor(doctorId, verificationData) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.update({
      is_verified: true,
      verification_status: 'verified',
      ...verificationData
    });
    logger.info(`Doctor verified: ${doctorId}`);
    return doctor;
  }
}

module.exports = new DoctorService();
