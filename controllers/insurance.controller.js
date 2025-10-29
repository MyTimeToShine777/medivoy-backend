const Insurance = require('../models/Insurance.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class InsuranceController {
  /**
   * Create a new insurance provider
   */
  static async createInsurance(req, res) {
    try {
      const {
        name, description, isActive, coverageDetails,
      } = req.body;

      // Create insurance provider
      const insurance = await Insurance.create({
        name,
        description,
        isActive,
        coverageDetails,
      });

      return successResponse(
        res,
        {
          message: 'Insurance provider created successfully',
          data: insurance,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to create insurance provider');
    }
  }

  /**
   * Get insurance provider by ID
   */
  static async getInsurance(req, res) {
    try {
      const { id } = req.params;

      // Find insurance provider
      const insurance = await Insurance.findByPk(id);

      if (!insurance) {
        return errorResponse(
          res,
          {
            message: 'Insurance provider not found',
          },
          404,
        );
      }

      return successResponse(res, {
        message: 'Insurance provider retrieved successfully',
        data: insurance,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve insurance provider');
    }
  }

  /**
   * Update insurance provider
   */
  static async updateInsurance(req, res) {
    try {
      const { id } = req.params;
      const {
        name, description, isActive, coverageDetails,
      } = req.body;

      // Find insurance provider
      const insurance = await Insurance.findByPk(id);

      if (!insurance) {
        return errorResponse(
          res,
          {
            message: 'Insurance provider not found',
          },
          404,
        );
      }

      // Update insurance provider
      await insurance.update({
        name,
        description,
        isActive,
        coverageDetails,
      });

      return successResponse(res, {
        message: 'Insurance provider updated successfully',
        data: insurance,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to update insurance provider');
    }
  }

  /**
   * Delete insurance provider
   */
  static async deleteInsurance(req, res) {
    try {
      const { id } = req.params;

      // Find insurance provider
      const insurance = await Insurance.findByPk(id);

      if (!insurance) {
        return errorResponse(
          res,
          {
            message: 'Insurance provider not found',
          },
          404,
        );
      }

      // Delete insurance provider
      await insurance.destroy();

      return successResponse(res, {
        message: 'Insurance provider deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to delete insurance provider');
    }
  }

  /**
   * Get all insurance providers
   */
  static async getAllInsurance(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get insurance providers with pagination
      const insurances = await Insurance.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Insurance providers retrieved successfully',
        data: insurances.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(insurances.count / parseInt(limit, 10)),
          totalRecords: insurances.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve insurance providers');
    }
  }

  /**
   * Verify insurance provider
   */
  static async verifyInsurance(req, res) {
    try {
      const { id } = req.params;

      // Find insurance provider
      const insurance = await Insurance.findByPk(id);

      if (!insurance) {
        return errorResponse(
          res,
          {
            message: 'Insurance provider not found',
          },
          404,
        );
      }

      // Update insurance verification status
      await insurance.update({ isVerified: true });

      return successResponse(res, {
        message: 'Insurance provider verified successfully',
        data: insurance,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to verify insurance provider');
    }
  }

  /**
   * Check insurance coverage
   */
  static async checkCoverage(req, res) {
    try {
      const { insuranceId, treatmentId } = req.body;

      // Find insurance provider
      const insurance = await Insurance.findByPk(insuranceId);

      if (!insurance) {
        return errorResponse(
          res,
          {
            message: 'Insurance provider not found',
          },
          404,
        );
      }

      // Check if treatment is covered
      // Note: This would require checking the coverageDetails
      const isCovered = true; // Placeholder logic
      const coveragePercentage = 80; // Placeholder value

      return successResponse(res, {
        message: 'Insurance coverage checked successfully',
        data: {
          insuranceId,
          treatmentId,
          isCovered,
          coveragePercentage,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to check insurance coverage');
    }
  }
}

module.exports = InsuranceController;
