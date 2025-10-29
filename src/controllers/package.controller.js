const Package = require('../models/Package.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class PackageController {
  /**
   * Create a new package
   */
  async createPackage(req, res) {
    try {
      const {
        name, description, treatmentId, hospitalId, duration, price, currency, isActive,
      } = req.body;

      // Create package
      const pkg = await Package.create({
        name,
        description,
        treatmentId,
        hospitalId,
        duration,
        price,
        currency,
        isActive,
      });

      return successResponse(res, {
        message: 'Package created successfully',
        data: pkg,
      }, 201);
    } catch (error) {
      logger.error('Create package error:', error);
      return errorResponse(res, {
        message: 'Failed to create package',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get package by ID
   */
  async getPackage(req, res) {
    try {
      const { id } = req.params;

      // Find package
      const pkg = await Package.findByPk(id);

      if (!pkg) {
        return errorResponse(res, {
          message: 'Package not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'Package retrieved successfully',
        data: pkg,
      });
    } catch (error) {
      logger.error('Get package error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve package',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update package
   */
  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const {
        name, description, duration, price, currency, isActive,
      } = req.body;

      // Find package
      const pkg = await Package.findByPk(id);

      if (!pkg) {
        return errorResponse(res, {
          message: 'Package not found',
        }, 404);
      }

      // Update package
      await pkg.update({
        name,
        description,
        duration,
        price,
        currency,
        isActive,
      });

      return successResponse(res, {
        message: 'Package updated successfully',
        data: pkg,
      });
    } catch (error) {
      logger.error('Update package error:', error);
      return errorResponse(res, {
        message: 'Failed to update package',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete package
   */
  async deletePackage(req, res) {
    try {
      const { id } = req.params;

      // Find package
      const pkg = await Package.findByPk(id);

      if (!pkg) {
        return errorResponse(res, {
          message: 'Package not found',
        }, 404);
      }

      // Delete package
      await pkg.destroy();

      return successResponse(res, {
        message: 'Package deleted successfully',
      });
    } catch (error) {
      logger.error('Delete package error:', error);
      return errorResponse(res, {
        message: 'Failed to delete package',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all packages
   */
  async getAllPackages(req, res) {
    try {
      const {
        page = 1, limit = 10, treatmentId, hospitalId, isActive,
      } = req.query;

      // Build where clause
      const where = {};
      if (treatmentId) where.treatmentId = treatmentId;
      if (hospitalId) where.hospitalId = hospitalId;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get packages with pagination
      const packages = await Package.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Packages retrieved successfully',
        data: packages.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(packages.count / parseInt(limit, 10)),
          totalRecords: packages.count,
        },
      });
    } catch (error) {
      logger.error('Get all packages error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve packages',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new PackageController();
