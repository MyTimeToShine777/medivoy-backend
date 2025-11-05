const LabTest = require('../models/LabTest.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class LabTestController {
  /**
   * Create a new lab test
   */
  static async createLabTest(req, res) {
    try {
      const { name, description, price, laboratoryId, isActive } = req.body;

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
        201
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to create lab test');
    }
  }

  /**
   * Get lab test by ID
   */
  static async getLabTest(req, res) {
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
          404
        );
      }

      return successResponse(res, {
        message: 'Lab test retrieved successfully',
        data: labTest,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve lab test');
    }
  }

  /**
   * Update lab test
   */
  static async updateLabTest(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, isActive } = req.body;

      // Find lab test
      const labTest = await LabTest.findByPk(id);

      if (!labTest) {
        return errorResponse(
          res,
          {
            message: 'Lab test not found',
          },
          404
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
      return handleDatabaseError(error, res, 'Failed to update lab test');
    }
  }

  /**
   * Delete lab test
   */
  static async deleteLabTest(req, res) {
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
          404
        );
      }

      // Delete lab test
      await labTest.destroy();

      return successResponse(res, {
        message: 'Lab test deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to delete lab test');
    }
  }

  /**
   * Get all lab tests
   */
  static async getAllLabTests(req, res) {
    try {
      const { page = 1, limit = 10, laboratoryId, isActive } = req.query;

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
      return handleDatabaseError(error, res, 'Failed to retrieve lab tests');
    }
  }
}

module.exports = LabTestController;
