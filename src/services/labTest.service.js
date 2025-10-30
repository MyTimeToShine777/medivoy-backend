const LabTest = require("../models/LabTest.model");
const logger = require("../utils/logger");

class LabTestService {
  /**
   * Create a new lab test
   */
  async createLabTest(data) {
    try {
      const labTest = await LabTest.create(data);
      return labTest;
    } catch (error) {
      logger.error("Create lab test service error:", error);
      throw error;
    }
  }

  /**
   * Get lab test by ID
   */
  async getLabTestById(id) {
    try {
      const labTest = await LabTest.findByPk(id);
      return labTest;
    } catch (error) {
      logger.error("Get lab test by ID service error:", error);
      throw error;
    }
  }

  /**
   * Update lab test
   */
  async updateLabTest(id, data) {
    try {
      const labTest = await LabTest.findByPk(id);
      if (!labTest) {
        throw new Error("Lab test not found");
      }

      await labTest.update(data);
      return labTest;
    } catch (error) {
      logger.error("Update lab test service error:", error);
      throw error;
    }
  }

  /**
   * Delete lab test
   */
  async deleteLabTest(id) {
    try {
      const labTest = await LabTest.findByPk(id);
      if (!labTest) {
        throw new Error("Lab test not found");
      }

      await labTest.destroy();
      return true;
    } catch (error) {
      logger.error("Delete lab test service error:", error);
      throw error;
    }
  }

  /**
   * Get all lab tests
   */
  async getAllLabTests(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const labTests = await LabTest.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return labTests;
    } catch (error) {
      logger.error("Get all lab tests service error:", error);
      throw error;
    }
  }
}

module.exports = new LabTestService();
