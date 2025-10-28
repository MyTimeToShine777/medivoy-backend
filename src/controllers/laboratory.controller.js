const laboratoryService = require('../services/laboratory.service');
const { successResponse } = require('../utils/response');

class LaboratoryController {
  async createLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.createLaboratory(req.body);
      return successResponse(res, laboratory, 'Laboratory created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.getLaboratoryById(req.params.id);
      return successResponse(res, laboratory, 'Laboratory retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllLaboratories(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await laboratoryService.getAllLaboratories(filters, { page, limit });
      return successResponse(res, result, 'Laboratories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.updateLaboratory(req.params.id, req.body);
      return successResponse(res, laboratory, 'Laboratory updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLaboratory(req, res, next) {
    try {
      const result = await laboratoryService.deleteLaboratory(req.params.id);
      return successResponse(res, result, 'Laboratory deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LaboratoryController();
