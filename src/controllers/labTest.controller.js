const LabTest = require('../models/LabTest.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class LabTestController {
  /**
   * Create a new lab test
   */
  async createLabTest(req, res) {
    try {
      const {
        name, description, price, laboratoryId, isActive,
      } = req.body;

      // Create lab test
      const labTest = await LabTest.create({
        name,
        description,
        price,
        laboratoryId,
        isActive,
      });

      return successResponse(
        res,
        {
          message: 'Lab test created successfully',
          data: labTest,
        },
        201,
      );
    } catch (error) {
      logger.error('Create lab test error:', error);
      return errorResponse(
        res,
        {
          message: 'Failed to create lab test',
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get lab test by ID
   */
  async getLabTest(req, res) {
    try {
      const { id } = req.params;

      // Find lab test
      const labTest = await LabTest.findByPk(id);

      if (!labTest) {
        return errorResponse(
          res,
          {
            message: 'Lab test not found',
          },
          404,
        );
      }

      return successResponse(res, {
        message: 'Lab test retrieved successfully',
        data: labTest,
      });
    } catch (error) {
      logger.error('Get lab test error:', error);
      return errorResponse(
        res,
        {
          message: 'Failed to retrieve lab test',
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Update lab test
   */
  async updateLabTest(req, res) {
    try {
      const { id } = req.params;
      const {
        name, description, price, isActive,
      } = req.body;

      // Find lab test
      const labTest = await LabTest.findByPk(id);

      if (!labTest) {
        return errorResponse(
          res,
          {
            message: 'Lab test not found',
          },
          404,
        );
      }

      // Update lab test
      await labTest.update({
        name,
        description,
        price,
        isActive,
      });

      return successResponse(res, {
        message: 'Lab test updated successfully',
        data: labTest,
      });
    } catch (error) {
      logger.error('Update lab test error:', error);
      return errorResponse(
        res,
        {
          message: 'Failed to update lab test',
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Delete lab test
   */
  async deleteLabTest(req, res) {
    try {
      const { id } = req.params;

      // Find lab test
      const labTest = await LabTest.findByPk(id);

      if (!labTest) {
        return errorResponse(
          res,
          {
            message: 'Lab test not found',
          },
          404,
        );
      }

      // Delete lab test
      await labTest.destroy();

      return successResponse(res, {
        message: 'Lab test deleted successfully',
      });
    } catch (error) {
      logger.error('Delete lab test error:', error);
      return errorResponse(
        res,
        {
          message: 'Failed to delete lab test',
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get all lab tests
   */
  async getAllLabTests(req, res) {
    try {
      const {
        page = 1, limit = 10, laboratoryId, isActive,
      } = req.query;

      // Build where clause
      const where = {};
      if (laboratoryId) where.laboratoryId = laboratoryId;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get lab tests with pagination
      const labTests = await LabTest.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Lab tests retrieved successfully',
        data: labTests.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(labTests.count / parseInt(limit, 10)),
          totalRecords: labTests.count,
        },
      });
    } catch (error) {
      logger.error('Get all lab tests error:', error);
      return errorResponse(
        res,
        {
          message: 'Failed to retrieve lab tests',
          error: error.message,
        },
        500,
      );
    }
  }
}

module.exports = new LabTestController();
