const TreatmentCategory = require('../models/TreatmentCategory.model');
const { successResponse, errorResponse } = require('../utils/response');
const { generateSlug } = require('../utils/helpers');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class TreatmentCategoryController {
  /**
   * Create a new treatment category
   */
  static async createTreatmentCategory(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get treatment category by ID
   */
  static async getTreatmentCategory(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update treatment category
   */
  static async updateTreatmentCategory(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete treatment category
   */
  static async deleteTreatmentCategory(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all treatment categories
   */
  static async getAllTreatmentCategories(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = TreatmentCategoryController;
