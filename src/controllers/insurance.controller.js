const insuranceService = require('../services/insurance.service');
const { successResponse } = require('../utils/response');

class InsuranceController {
  async createInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.createInsurance(req.body);
      return successResponse(res, insurance, 'Insurance created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.getInsuranceById(req.params.id);
      return successResponse(res, insurance, 'Insurance retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.updateInsurance(req.params.id, req.body);
      return successResponse(res, insurance, 'Insurance updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteInsurance(req, res, next) {
    try {
      const result = await insuranceService.deleteInsurance(req.params.id);
      return successResponse(res, result, 'Insurance deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllInsurance(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await insuranceService.getAllInsurance(filters, { page, limit });
      return successResponse(res, result, 'Insurance retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.verifyInsurance(req.params.id, req.body);
      return successResponse(res, insurance, 'Insurance verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async checkCoverage(req, res, next) {
    try {
      const { treatmentId } = req.body;
      const coverage = await insuranceService.checkCoverage(req.params.id, treatmentId);
      return successResponse(res, coverage, 'Coverage checked successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InsuranceController();
