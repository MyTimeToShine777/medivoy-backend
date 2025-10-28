const treatmentService = require('../services/treatment.service');
const { successResponse } = require('../utils/response');

class TreatmentController {
  async createTreatment(req, res, next) {
    try {
      const treatment = await treatmentService.createTreatment(req.body);
      return successResponse(res, treatment, 'Treatment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTreatment(req, res, next) {
    try {
      const treatment = await treatmentService.getTreatmentById(req.params.id);
      return successResponse(res, treatment, 'Treatment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTreatment(req, res, next) {
    try {
      const treatment = await treatmentService.updateTreatment(req.params.id, req.body);
      return successResponse(res, treatment, 'Treatment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTreatment(req, res, next) {
    try {
      const result = await treatmentService.deleteTreatment(req.params.id);
      return successResponse(res, result, 'Treatment deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllTreatments(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await treatmentService.getAllTreatments(filters, { page, limit });
      return successResponse(res, result, 'Treatments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTreatmentsByCategory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await treatmentService.getTreatmentsByCategory(req.params.categoryId, { page, limit });
      return successResponse(res, result, 'Treatments by category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTreatmentsBySubcategory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await treatmentService.getTreatmentsBySubcategory(req.params.subcategoryId, { page, limit });
      return successResponse(res, result, 'Treatments by subcategory retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TreatmentController();
