const Package = require('../models/Package.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class PackageController {
  /**
   * Create a new package
   */
  static async createPackage(req, res) {
    try {
      const {
        name,
        description,
        treatmentId,
        hospitalId,
        duration,
        price,
        currency,
        isActive,
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

      return successResponse(
        res,
        {
          message: 'Package created successfully',
          data: pkg,
        },
        201
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get package by ID
   */
  static async getPackage(req, res) {
    try {
      const { id } = req.params;

      // Find package
      const pkg = await Package.findByPk(id);

      if (!pkg) {
        return errorResponse(
          res,
          {
            message: 'Package not found',
          },
          404
        );
      }

      return successResponse(res, {
        message: 'Package retrieved successfully',
        data: pkg,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update package
   */
  static async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const { name, description, duration, price, currency, isActive } =
        req.body;

      // Find package
      const pkg = await Package.findByPk(id);

      if (!pkg) {
        return errorResponse(
          res,
          {
            message: 'Package not found',
          },
          404
        );
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete package
   */
  static async deletePackage(req, res) {
    try {
      const { id } = req.params;

      // Find package
      const pkg = await Package.findByPk(id);

      if (!pkg) {
        return errorResponse(
          res,
          {
            message: 'Package not found',
          },
          404
        );
      }

      // Delete package
      await pkg.destroy();

      return successResponse(res, {
        message: 'Package deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all packages
   */
  static async getAllPackages(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        treatmentId,
        hospitalId,
        isActive,
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
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = PackageController;
