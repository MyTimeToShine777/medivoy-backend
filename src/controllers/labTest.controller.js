const labTestService = require('../services/labTest.service');
const { successResponse } = require('../utils/response');

class LabTestController {
  async createLabTest(req, res, next) {
    try {
      const labTest = await labTestService.createLabTest(req.body);
      return successResponse(res, labTest, 'Lab test created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getLabTest(req, res, next) {
    try {
      const labTest = await labTestService.getLabTestById(req.params.id);
      return successResponse(res, labTest, 'Lab test retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllLabTests(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await labTestService.getAllLabTests(filters, { page, limit });
      return successResponse(res, result, 'Lab tests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLabTest(req, res, next) {
    try {
      const labTest = await labTestService.updateLabTest(req.params.id, req.body);
      return successResponse(res, labTest, 'Lab test updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLabTestResults(req, res, next) {
    try {
      const labTest = await labTestService.updateLabTestResults(req.params.id, req.body.results);
      return successResponse(res, labTest, 'Lab test results updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLabTest(req, res, next) {
    try {
      const result = await labTestService.deleteLabTest(req.params.id);
      return successResponse(res, result, 'Lab test deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LabTestController();
