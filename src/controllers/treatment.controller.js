const { Treatment, TreatmentCategory, TreatmentSubcategory } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { Sequelize } = require('sequelize');

class TreatmentController {
  /**
   * Create a new treatment
   */
  async createTreatment(req, res) {
    try {
      const { name, description, categoryId, subcategoryId, price, duration, isActive } = req.body;
      
      // Create treatment
      const treatment = await Treatment.create({
        name,
        description,
        categoryId,
        subcategoryId,
        price,
        duration,
        isActive,
      });
      
      return successResponse(res, {
        message: 'Treatment created successfully',
        data: treatment,
      }, 201);
    } catch (error) {
      logger.error('Create treatment error:', error);
      return errorResponse(res, {
        message: 'Failed to create treatment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get treatment by ID
   */
  async getTreatment(req, res) {
    try {
      const { id } = req.params;
      
      // Find treatment with associated category and subcategory
      const treatment = await Treatment.findByPk(id, {
        include: [
          {
            model: TreatmentCategory,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
          {
            model: TreatmentSubcategory,
            as: 'subcategory',
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });
      
      if (!treatment) {
        return errorResponse(res, {
          message: 'Treatment not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Treatment retrieved successfully',
        data: treatment,
      });
    } catch (error) {
      logger.error('Get treatment error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve treatment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update treatment
   */
  async updateTreatment(req, res) {
    try {
      const { id } = req.params;
      const { name, description, categoryId, subcategoryId, price, duration, isActive } = req.body;
      
      // Find treatment
      const treatment = await Treatment.findByPk(id);
      
      if (!treatment) {
        return errorResponse(res, {
          message: 'Treatment not found',
        }, 404);
      }
      
      // Update treatment
      await treatment.update({
        name,
        description,
        categoryId,
        subcategoryId,
        price,
        duration,
        isActive,
      });
      
      return successResponse(res, {
        message: 'Treatment updated successfully',
        data: treatment,
      });
    } catch (error) {
      logger.error('Update treatment error:', error);
      return errorResponse(res, {
        message: 'Failed to update treatment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete treatment
   */
  async deleteTreatment(req, res) {
    try {
      const { id } = req.params;
      
      // Find treatment
      const treatment = await Treatment.findByPk(id);
      
      if (!treatment) {
        return errorResponse(res, {
          message: 'Treatment not found',
        }, 404);
      }
      
      // Delete treatment
      await treatment.destroy();
      
      return successResponse(res, {
        message: 'Treatment deleted successfully',
      });
    } catch (error) {
      logger.error('Delete treatment error:', error);
      return errorResponse(res, {
        message: 'Failed to delete treatment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all treatments
   */
  async getAllTreatments(req, res) {
    try {
      const { page = 1, limit = 10, categoryId, subcategoryId, isActive, search } = req.query;
      
      // Build where clause
      const where = {};
      if (categoryId) where.categoryId = categoryId;
      if (subcategoryId) where.subcategoryId = subcategoryId;
      if (isActive !== undefined) where.isActive = isActive === 'true';
      if (search) where.name = { [Sequelize.Op.iLike]: `%${search}%` };
      
      // Get treatments with pagination and associated category/subcategory
      const treatments = await Treatment.findAndCountAll({
        where,
        include: [
          {
            model: TreatmentCategory,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
          {
            model: TreatmentSubcategory,
            as: 'subcategory',
            attributes: ['id', 'name', 'slug'],
          },
        ],
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['name', 'ASC']],
      });
      
      return successResponse(res, {
        message: 'Treatments retrieved successfully',
        data: treatments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(treatments.count / parseInt(limit, 10)),
          totalRecords: treatments.count,
        },
      });
    } catch (error) {
      logger.error('Get all treatments error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve treatments',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get treatments by category
   */
  async getTreatmentsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 10, isActive } = req.query;
      
      // Build where clause
      const where = { categoryId };
      if (isActive !== undefined) where.isActive = isActive === 'true';
      
      // Get treatments with pagination
      const treatments = await Treatment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['name', 'ASC']],
      });
      
      return successResponse(res, {
        message: 'Treatments retrieved successfully',
        data: treatments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(treatments.count / parseInt(limit, 10)),
          totalRecords: treatments.count,
        },
      });
    } catch (error) {
      logger.error('Get treatments by category error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve treatments',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get treatments by subcategory
   */
  async getTreatmentsBySubcategory(req, res) {
    try {
      const { subcategoryId } = req.params;
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = { subcategory_id: subcategoryId };
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get treatments with pagination
      const treatments = await Treatment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['name', 'ASC']],
      });

      return successResponse(res, {
        message: 'Treatments retrieved successfully',
        data: treatments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(treatments.count / parseInt(limit, 10)),
          totalRecords: treatments.count,
        },
      });
    } catch (error) {
      logger.error('Get treatments by subcategory error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve treatments',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new TreatmentController();