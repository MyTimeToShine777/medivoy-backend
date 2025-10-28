const { Hospital, Doctor, Treatment, HospitalDoctor, HospitalTreatment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class HospitalService {
  async createHospital(hospitalData) {
    try {
      const slug = generateSlug(hospitalData.name);
      const hospital = await Hospital.create({ ...hospitalData, slug });
      logger.info(`Hospital created: ${hospital.id}`);
      return hospital;
    } catch (error) {
      logger.error('Error creating hospital:', error);
      throw new AppError('Failed to create hospital', 500);
    }
  }

  async getHospitalById(hospitalId) {
    const hospital = await Hospital.findByPk(hospitalId, {
      include: [
        { model: Doctor, as: 'doctors', through: { attributes: [] } },
        { model: Treatment, as: 'treatments', through: { attributes: [] } }
      ]
    });
    
    if (!hospital) {
      throw new AppError('Hospital not found', 404);
    }
    
    return hospital;
  }

  async updateHospital(hospitalId, updateData) {
    const hospital = await this.getHospitalById(hospitalId);
    
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }
    
    await hospital.update(updateData);
    logger.info(`Hospital updated: ${hospitalId}`);
    return hospital;
  }

  async deleteHospital(hospitalId) {
    const hospital = await this.getHospitalById(hospitalId);
    await hospital.destroy();
    logger.info(`Hospital deleted: ${hospitalId}`);
    return { message: 'Hospital deleted successfully' };
  }

  async getAllHospitals(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Hospital.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Doctor, as: 'doctors', through: { attributes: [] } },
        { model: Treatment, as: 'treatments', through: { attributes: [] } }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      hospitals: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async addDoctorToHospital(hospitalId, doctorId) {
    const hospital = await this.getHospitalById(hospitalId);
    await HospitalDoctor.create({ hospital_id: hospitalId, doctor_id: doctorId });
    logger.info(`Doctor ${doctorId} added to hospital ${hospitalId}`);
    return hospital;
  }

  async removeDoctorFromHospital(hospitalId, doctorId) {
    await HospitalDoctor.destroy({
      where: { hospital_id: hospitalId, doctor_id: doctorId }
    });
    logger.info(`Doctor ${doctorId} removed from hospital ${hospitalId}`);
    return { message: 'Doctor removed from hospital' };
  }

  async addTreatmentToHospital(hospitalId, treatmentId) {
    const hospital = await this.getHospitalById(hospitalId);
    await HospitalTreatment.create({ hospital_id: hospitalId, treatment_id: treatmentId });
    logger.info(`Treatment ${treatmentId} added to hospital ${hospitalId}`);
    return hospital;
  }

  async verifyHospital(hospitalId, verificationData) {
    const hospital = await this.getHospitalById(hospitalId);
    await hospital.update({
      is_verified: true,
      verification_status: 'verified',
      ...verificationData
    });
    logger.info(`Hospital verified: ${hospitalId}`);
    return hospital;
  }
}

module.exports = new HospitalService();
