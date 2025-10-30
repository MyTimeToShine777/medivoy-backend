const Package = require("../models/Package.model");
const logger = require("../utils/logger");

class PackageService {
  /**
   * Create a new package
   */
  async createPackage(data) {
    try {
      const packageData = await Package.create(data);
      return packageData;
    } catch (error) {
      logger.error("Create package service error:", error);
      throw error;
    }
  }

  /**
   * Get package by ID
   */
  async getPackageById(id) {
    try {
      const packageData = await Package.findByPk(id);
      return packageData;
    } catch (error) {
      logger.error("Get package by ID service error:", error);
      throw error;
    }
  }

  /**
   * Update package
   */
  async updatePackage(id, data) {
    try {
      const packageData = await Package.findByPk(id);
      if (!packageData) {
        throw new Error("Package not found");
      }

      await packageData.update(data);
      return packageData;
    } catch (error) {
      logger.error("Update package service error:", error);
      throw error;
    }
  }

  /**
   * Delete package
   */
  async deletePackage(id) {
    try {
      const packageData = await Package.findByPk(id);
      if (!packageData) {
        throw new Error("Package not found");
      }

      await packageData.destroy();
      return true;
    } catch (error) {
      logger.error("Delete package service error:", error);
      throw error;
    }
  }

  /**
   * Get all packages
   */
  async getAllPackages(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const packages = await Package.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return packages;
    } catch (error) {
      logger.error("Get all packages service error:", error);
      throw error;
    }
  }
}

module.exports = new PackageService();
