const { Prescription, Appointment, Doctor, Patient } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class PrescriptionService {
  async createPrescription(prescriptionData) {
    try {
      const prescription = await Prescription.create(prescriptionData);
      logger.info(`Prescription created: ${prescription.id}`);
      return prescription;
    } catch (error) {
      logger.error('Error creating prescription:', error);
      throw new AppError('Failed to create prescription', 500);
    }
  }

  async getPrescriptionById(prescriptionId) {
    const prescription = await Prescription.findByPk(prescriptionId, {
      include: [
        { model: Appointment, as: 'appointment' },
        { model: Doctor, as: 'doctor' },
        { model: Patient, as: 'patient' }
      ]
    });
    
    if (!prescription) {
      throw new AppError('Prescription not found', 404);
    }
    
    return prescription;
  }

  async updatePrescription(prescriptionId, updateData) {
    const prescription = await this.getPrescriptionById(prescriptionId);
    await prescription.update(updateData);
    logger.info(`Prescription updated: ${prescriptionId}`);
    return prescription;
  }

  async deletePrescription(prescriptionId) {
    const prescription = await this.getPrescriptionById(prescriptionId);
    await prescription.destroy();
    logger.info(`Prescription deleted: ${prescriptionId}`);
    return { message: 'Prescription deleted successfully' };
  }

  async getAllPrescriptions(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Prescription.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Appointment, as: 'appointment' },
        { model: Doctor, as: 'doctor' },
        { model: Patient, as: 'patient' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      prescriptions: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getPatientPrescriptions(patientId) {
    const prescriptions = await Prescription.findAll({
      where: { patient_id: patientId },
      include: [
        { model: Doctor, as: 'doctor' },
        { model: Appointment, as: 'appointment' }
      ],
      order: [['created_at', 'DESC']]
    });
    return prescriptions;
  }

  async generatePrescriptionPDF(prescriptionId) {
    const prescription = await this.getPrescriptionById(prescriptionId);
    
    // TODO: Implement PDF generation
    logger.info(`Generating PDF for prescription: ${prescriptionId}`);
    
    return {
      message: 'PDF generation not yet implemented',
      prescription
    };
  }
}

module.exports = new PrescriptionService();
