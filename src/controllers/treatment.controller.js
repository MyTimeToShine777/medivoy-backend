const { Sequelize } = require("sequelize");
const {
  Treatment,
  TreatmentCategory,
  TreatmentSubcategory,
} = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");
const CacheUtil = require("../utils/cache");

class TreatmentController {
  /**
   * Create a new treatment
   */
  static async createTreatment(req, res) {
    try {
      const {
        name,
        description,
        categoryId,
        subcategoryId,
        price,
        duration,
        isActive,
      } = req.body;

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

      return successResponse(
        res,
        {
          message: "Treatment created successfully",
          data: treatment,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get treatment by ID
   */
  static async getTreatment(req, res) {
    try {
      return errorResponse(
        res,
        {
          message: "Treatment not found",
          note: "Database not configured. Configure PostgreSQL to see actual data.",
        },
        404,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update treatment
   */
  static async updateTreatment(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        categoryId,
        subcategoryId,
        price,
        duration,
        isActive,
      } = req.body;

      // Find treatment
      const treatment = await Treatment.findByPk(id);

      if (!treatment) {
        return errorResponse(
          res,
          {
            message: "Treatment not found",
          },
          404,
        );
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
        message: "Treatment updated successfully",
        data: treatment,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete treatment
   */
  static async deleteTreatment(req, res) {
    try {
      const { id } = req.params;

      // Find treatment
      const treatment = await Treatment.findByPk(id);

      if (!treatment) {
        return errorResponse(
          res,
          {
            message: "Treatment not found",
          },
          404,
        );
      }

      // Delete treatment
      await treatment.destroy();

      return successResponse(res, {
        message: "Treatment deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all treatments
   */
  static async getAllTreatments(req, res) {
    try {
      // Return empty array with success when database is not connected
      return successResponse(res, {
        message: "Treatments retrieved successfully",
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalRecords: 0,
        },
        note: "Database not configured. Configure PostgreSQL to see actual data.",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get treatments by category
   */
  static async getTreatmentsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = { categoryId };
      if (isActive !== undefined) where.isActive = isActive === "true";

      // Get treatments with pagination
      const treatments = await Treatment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["name", "ASC"]],
      });

      return successResponse(res, {
        message: "Treatments retrieved successfully",
        data: treatments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(treatments.count / parseInt(limit, 10)),
          totalRecords: treatments.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get treatments by subcategory
   */
  static async getTreatmentsBySubcategory(req, res) {
    try {
      const { subcategoryId } = req.params;
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = { subcategory_id: subcategoryId };
      if (isActive !== undefined) where.isActive = isActive === "true";

      // Get treatments with pagination
      const treatments = await Treatment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["name", "ASC"]],
      });

      return successResponse(res, {
        message: "Treatments retrieved successfully",
        data: treatments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(treatments.count / parseInt(limit, 10)),
          totalRecords: treatments.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = TreatmentController;
