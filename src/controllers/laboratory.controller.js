const Laboratory = require("../models/Laboratory.model");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

class LaboratoryController {
  /**
   * Create a new laboratory
   */
  async createLaboratory(req, res) {
    try {
      const { name, address, phone, email, licenseNumber, isActive } = req.body;

      // Create laboratory
      const laboratory = await Laboratory.create({
        name,
        address,
        phone,
        email,
        licenseNumber,
        isActive,
      });

      return successResponse(
        res,
        {
          message: "Laboratory created successfully",
          data: laboratory,
        },
        201,
      );
    } catch (error) {
      logger.error("Create laboratory error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to create laboratory",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get laboratory by ID
   */
  async getLaboratory(req, res) {
    try {
      const { id } = req.params;

      // Find laboratory
      const laboratory = await Laboratory.findByPk(id);

      if (!laboratory) {
        return errorResponse(
          res,
          {
            message: "Laboratory not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Laboratory retrieved successfully",
        data: laboratory,
      });
    } catch (error) {
      logger.error("Get laboratory error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to retrieve laboratory",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Update laboratory
   */
  async updateLaboratory(req, res) {
    try {
      const { id } = req.params;
      const { name, address, phone, email, licenseNumber, isActive } = req.body;

      // Find laboratory
      const laboratory = await Laboratory.findByPk(id);

      if (!laboratory) {
        return errorResponse(
          res,
          {
            message: "Laboratory not found",
          },
          404,
        );
      }

      // Update laboratory
      await laboratory.update({
        name,
        address,
        phone,
        email,
        licenseNumber,
        isActive,
      });

      return successResponse(res, {
        message: "Laboratory updated successfully",
        data: laboratory,
      });
    } catch (error) {
      logger.error("Update laboratory error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to update laboratory",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Delete laboratory
   */
  async deleteLaboratory(req, res) {
    try {
      const { id } = req.params;

      // Find laboratory
      const laboratory = await Laboratory.findByPk(id);

      if (!laboratory) {
        return errorResponse(
          res,
          {
            message: "Laboratory not found",
          },
          404,
        );
      }

      // Delete laboratory
      await laboratory.destroy();

      return successResponse(res, {
        message: "Laboratory deleted successfully",
      });
    } catch (error) {
      logger.error("Delete laboratory error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to delete laboratory",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get all laboratories
   */
  async getAllLaboratories(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === "true";

      // Get laboratories with pagination
      const laboratories = await Laboratory.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Laboratories retrieved successfully",
        data: laboratories.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(laboratories.count / parseInt(limit, 10)),
          totalRecords: laboratories.count,
        },
      });
    } catch (error) {
      logger.error("Get all laboratories error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to retrieve laboratories",
          error: error.message,
        },
        500,
      );
    }
  }
}

module.exports = new LaboratoryController();
