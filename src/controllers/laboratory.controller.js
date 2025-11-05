const Laboratory = require('../models/Laboratory.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class LaboratoryController {
  /**
   * Create a new laboratory
   */
  static async createLaboratory(req, res) {
    try {
      const { name, address, phone, email, licenseNumber, isActive } = req.body;

      // Create laboratory
      const laboratory = await Laboratory.create({
        name,
        address,
        phone,
        email,
        licenseNumber,
        isActive,
      });

      return successResponse(
        res,
        {
          message: 'Laboratory created successfully',
          data: laboratory,
        },
        201
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to create laboratory');
    }
  }

  /**
   * Get laboratory by ID
   */
  static async getLaboratory(req, res) {
    try {
      const { id } = req.params;

      // Find laboratory
      const laboratory = await Laboratory.findByPk(id);

      if (!laboratory) {
        return errorResponse(
          res,
          {
            message: 'Laboratory not found',
          },
          404
        );
      }

      return successResponse(res, {
        message: 'Laboratory retrieved successfully',
        data: laboratory,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve laboratory');
    }
  }

  /**
   * Update laboratory
   */
  static async updateLaboratory(req, res) {
    try {
      const { id } = req.params;
      const { name, address, phone, email, licenseNumber, isActive } = req.body;

      // Find laboratory
      const laboratory = await Laboratory.findByPk(id);

      if (!laboratory) {
        return errorResponse(
          res,
          {
            message: 'Laboratory not found',
          },
          404
        );
      }

      // Update laboratory
      await laboratory.update({
        name,
        address,
        phone,
        email,
        licenseNumber,
        isActive,
      });

      return successResponse(res, {
        message: 'Laboratory updated successfully',
        data: laboratory,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to update laboratory');
    }
  }

  /**
   * Delete laboratory
   */
  static async deleteLaboratory(req, res) {
    try {
      const { id } = req.params;

      // Find laboratory
      const laboratory = await Laboratory.findByPk(id);

      if (!laboratory) {
        return errorResponse(
          res,
          {
            message: 'Laboratory not found',
          },
          404
        );
      }

      // Delete laboratory
      await laboratory.destroy();

      return successResponse(res, {
        message: 'Laboratory deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to delete laboratory');
    }
  }

  /**
   * Get all laboratories
   */
  static async getAllLaboratories(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get laboratories with pagination
      const laboratories = await Laboratory.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Laboratories retrieved successfully',
        data: laboratories.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(laboratories.count / parseInt(limit, 10)),
          totalRecords: laboratories.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve laboratories');
    }
  }
}

module.exports = LaboratoryController;
