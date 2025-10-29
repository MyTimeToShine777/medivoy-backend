const Insurance = require('../models/Insurance.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class InsuranceController {
  /**
   * Create a new insurance provider
   */
  async createInsurance(req, res) {
    try {
      const { name, description, isActive, coverageDetails } = req.body;
      
      // Create insurance provider
      const insurance = await Insurance.create({
        name,
        description,
        isActive,
        coverageDetails,
      });
      
      return successResponse(res, {
        message: 'Insurance provider created successfully',
        data: insurance,
      }, 201);
    } catch (error) {
      logger.error('Create insurance error:', error);
      return errorResponse(res, {
        message: 'Failed to create insurance provider',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get insurance provider by ID
   */
  async getInsurance(req, res) {
    try {
      const { id } = req.params;
      
      // Find insurance provider
      const insurance = await Insurance.findByPk(id);
      
      if (!insurance) {
        return errorResponse(res, {
          message: 'Insurance provider not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Insurance provider retrieved successfully',
        data: insurance,
      });
    } catch (error) {
      logger.error('Get insurance error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve insurance provider',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update insurance provider
   */
  async updateInsurance(req, res) {
    try {
      const { id } = req.params;
      const { name, description, isActive, coverageDetails } = req.body;
      
      // Find insurance provider
      const insurance = await Insurance.findByPk(id);
      
      if (!insurance) {
        return errorResponse(res, {
          message: 'Insurance provider not found',
        }, 404);
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
      logger.error('Update insurance error:', error);
      return errorResponse(res, {
        message: 'Failed to update insurance provider',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete insurance provider
   */
  async deleteInsurance(req, res) {
    try {
      const { id } = req.params;
      
      // Find insurance provider
      const insurance = await Insurance.findByPk(id);
      
      if (!insurance) {
        return errorResponse(res, {
          message: 'Insurance provider not found',
        }, 404);
      }
      
      // Delete insurance provider
      await insurance.destroy();
      
      return successResponse(res, {
        message: 'Insurance provider deleted successfully',
      });
    } catch (error) {
      logger.error('Delete insurance error:', error);
      return errorResponse(res, {
        message: 'Failed to delete insurance provider',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all insurance providers
   */
  async getAllInsurance(req, res) {
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
      logger.error('Get all insurance error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve insurance providers',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Verify insurance provider
   */
  async verifyInsurance(req, res) {
    try {
      const { id } = req.params;
      
      // Find insurance provider
      const insurance = await Insurance.findByPk(id);
      
      if (!insurance) {
        return errorResponse(res, {
          message: 'Insurance provider not found',
        }, 404);
      }
      
      // Update insurance verification status
      await insurance.update({ isVerified: true });
      
      return successResponse(res, {
        message: 'Insurance provider verified successfully',
        data: insurance,
      });
    } catch (error) {
      logger.error('Verify insurance error:', error);
      return errorResponse(res, {
        message: 'Failed to verify insurance provider',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Check insurance coverage
   */
  async checkCoverage(req, res) {
    try {
      const { insuranceId, treatmentId } = req.body;
      
      // Find insurance provider
      const insurance = await Insurance.findByPk(insuranceId);
      
      if (!insurance) {
        return errorResponse(res, {
          message: 'Insurance provider not found',
        }, 404);
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
      logger.error('Check insurance coverage error:', error);
      return errorResponse(res, {
        message: 'Failed to check insurance coverage',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new InsuranceController();