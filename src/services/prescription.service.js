const Prescription = require("../models/Prescription.model");
const logger = require("../utils/logger");

class PrescriptionService {
  /**
   * Create a new prescription
   */
  async createPrescription(data) {
    try {
      const prescription = await Prescription.create(data);
      return prescription;
    } catch (error) {
      logger.error("Create prescription service error:", error);
      throw error;
    }
  }

  /**
   * Get prescription by ID
   */
  async getPrescriptionById(id) {
    try {
      const prescription = await Prescription.findByPk(id);
      return prescription;
    } catch (error) {
      logger.error("Get prescription by ID service error:", error);
      throw error;
    }
  }

  /**
   * Update prescription
   */
  async updatePrescription(id, data) {
    try {
      const prescription = await Prescription.findByPk(id);
      if (!prescription) {
        throw new Error("Prescription not found");
      }

      await prescription.update(data);
      return prescription;
    } catch (error) {
      logger.error("Update prescription service error:", error);
      throw error;
    }
  }

  /**
   * Delete prescription
   */
  async deletePrescription(id) {
    try {
      const prescription = await Prescription.findByPk(id);
      if (!prescription) {
        throw new Error("Prescription not found");
      }

      await prescription.destroy();
      return true;
    } catch (error) {
      logger.error("Delete prescription service error:", error);
      throw error;
    }
  }

  /**
   * Get all prescriptions for a patient
   */
  async getPatientPrescriptions(patientId, filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      where.patientId = patientId;

      const prescriptions = await Prescription.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return prescriptions;
    } catch (error) {
      logger.error("Get patient prescriptions service error:", error);
      throw error;
    }
  }
}

module.exports = new PrescriptionService();
