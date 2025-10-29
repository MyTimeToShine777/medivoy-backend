const TreatmentCategory = require('../models/TreatmentCategory.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { generateSlug } = require('../utils/helpers');

class TreatmentCategoryController {
  /**
   * Create a new treatment category
   */
  async createTreatmentCategory(req, res) {
    try {
      const {
        name, description, icon, sort_order, isActive,
      } = req.body;

      // Generate slug from name
      const slug = generateSlug(name);

      // Create treatment category
      const treatmentCategory = await TreatmentCategory.create({
        name,
        description,
        icon,
        slug,
        sort_order,
        isActive,
      });

      return successResponse(res, {
        message: 'Treatment category created successfully',
        data: treatmentCategory,
      }, 201);
    } catch (error) {
      logger.error('Create treatment category error:', error);
      return errorResponse(res, {
        message: 'Failed to create treatment category',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get treatment category by ID
   */
  async getTreatmentCategory(req, res) {
    try {
      const { id } = req.params;

      // Find treatment category
      const treatmentCategory = await TreatmentCategory.findByPk(id);

      if (!treatmentCategory) {
        return errorResponse(res, {
          message: 'Treatment category not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'Treatment category retrieved successfully',
        data: treatmentCategory,
      });
    } catch (error) {
      logger.error('Get treatment category error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve treatment category',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update treatment category
   */
  async updateTreatmentCategory(req, res) {
    try {
      const { id } = req.params;
      const {
        name, description, icon, sort_order, isActive,
      } = req.body;

      // Find treatment category
      const treatmentCategory = await TreatmentCategory.findByPk(id);

      if (!treatmentCategory) {
        return errorResponse(res, {
          message: 'Treatment category not found',
        }, 404);
      }

      // Generate slug from name if name is provided
      const updateData = {
        name, description, icon, sort_order, isActive,
      };
      if (name) {
        updateData.slug = generateSlug(name);
      }

      // Update treatment category
      await treatmentCategory.update(updateData);

      return successResponse(res, {
        message: 'Treatment category updated successfully',
        data: treatmentCategory,
      });
    } catch (error) {
      logger.error('Update treatment category error:', error);
      return errorResponse(res, {
        message: 'Failed to update treatment category',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete treatment category
   */
  async deleteTreatmentCategory(req, res) {
    try {
      const { id } = req.params;

      // Find treatment category
      const treatmentCategory = await TreatmentCategory.findByPk(id);

      if (!treatmentCategory) {
        return errorResponse(res, {
          message: 'Treatment category not found',
        }, 404);
      }

      // Delete treatment category
      await treatmentCategory.destroy();

      return successResponse(res, {
        message: 'Treatment category deleted successfully',
      });
    } catch (error) {
      logger.error('Delete treatment category error:', error);
      return errorResponse(res, {
        message: 'Failed to delete treatment category',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all treatment categories
   */
  async getAllTreatmentCategories(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get treatment categories with pagination
      const treatmentCategories = await TreatmentCategory.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
      });

      return successResponse(res, {
        message: 'Treatment categories retrieved successfully',
        data: treatmentCategories.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(treatmentCategories.count / parseInt(limit, 10)),
          totalRecords: treatmentCategories.count,
        },
      });
    } catch (error) {
      logger.error('Get all treatment categories error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve treatment categories',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new TreatmentCategoryController();
