const { MedicalRecord, Patient } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class MedicalRecordService {
  async createMedicalRecord(data) {
    try {
      const record = await MedicalRecord.create(data);
      logger.info(`Medical record created: ${record.id}`);
      return record;
    } catch (error) {
      logger.error('Error creating medical record:', error);
      throw new AppError('Failed to create medical record', 500);
    }
  }

  async getMedicalRecordById(id) {
    const record = await MedicalRecord.findByPk(id, {
      include: [{ model: Patient, as: 'patient' }]
    });
    if (!record) throw new AppError('Medical record not found', 404);
    return record;
  }

  async getAllMedicalRecords(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await MedicalRecord.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: Patient, as: 'patient' }],
      order: [['created_at', 'DESC']]
    });
    return { medicalRecords: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getPatientMedicalRecords(patientId) {
    const records = await MedicalRecord.findAll({
      where: { patient_id: patientId },
      order: [['created_at', 'DESC']]
    });
    return records;
  }

  async updateMedicalRecord(id, data) {
    const record = await this.getMedicalRecordById(id);
    await record.update(data);
    logger.info(`Medical record updated: ${id}`);
    return record;
  }

  async deleteMedicalRecord(id) {
    const record = await this.getMedicalRecordById(id);
    await record.destroy();
    logger.info(`Medical record deleted: ${id}`);
    return { message: 'Medical record deleted successfully' };
  }
}

module.exports = new MedicalRecordService();
