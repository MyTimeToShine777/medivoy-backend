const treatmentCategoryService = require('../services/treatmentCategory.service');
const { successResponse } = require('../utils/response');

class TreatmentCategoryController {
  async createCategory(req, res, next) {
    try {
      const category = await treatmentCategoryService.createCategory(req.body);
      return successResponse(res, category, 'Treatment category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req, res, next) {
    try {
      const category = await treatmentCategoryService.getCategoryById(req.params.id);
      return successResponse(res, category, 'Treatment category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await treatmentCategoryService.getAllCategories(filters, { page, limit });
      return successResponse(res, result, 'Treatment categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await treatmentCategoryService.updateCategory(req.params.id, req.body);
      return successResponse(res, category, 'Treatment category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const result = await treatmentCategoryService.deleteCategory(req.params.id);
      return successResponse(res, result, 'Treatment category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TreatmentCategoryController();
