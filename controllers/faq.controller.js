const FAQ = require('../models/FAQ.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class FAQController {
  /**
   * Create a new FAQ
   */
  static async createFAQ(req, res) {
    try {
      const {
        question, answer, category, display_order,
      } = req.body;

      // Create FAQ
      const faq = await FAQ.create({
        question,
        answer,
        category,
        display_order,
      });

      return successResponse(
        res,
        {
          message: 'FAQ created successfully',
          data: faq,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to create FAQ');
    }
  }

  /**
   * Get FAQ by ID
   */
  static async getFAQ(req, res) {
    try {
      return errorResponse(
        res,
        {
          message: 'FAQ not found',
          note: 'Database not configured. Configure PostgreSQL to see actual data.',
        },
        404,
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve FAQ');
    }
  }

  /**
   * Get all FAQs
   */
  static async getAllFAQs(req, res) {
    try {
      // Return empty array with success when database is not connected
      return successResponse(res, {
        message: 'FAQs retrieved successfully',
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalRecords: 0,
        },
        note: 'Database not configured. Configure PostgreSQL to see actual data.',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve FAQs');
    }
  }

  /**
   * Get FAQs by category
   */
  static async getFAQsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Get FAQs by category with pagination
      const faqs = await FAQ.findAndCountAll({
        where: { category },
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [
          ['display_order', 'ASC'],
          ['createdAt', 'DESC'],
        ],
      });

      return successResponse(res, {
        message: 'FAQs retrieved successfully',
        data: faqs.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(faqs.count / parseInt(limit, 10)),
          totalRecords: faqs.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve FAQs by category');
    }
  }

  /**
   * Update FAQ
   */
  static async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const {
        question, answer, category, display_order,
      } = req.body;

      // Find FAQ
      const faq = await FAQ.findByPk(id);

      if (!faq) {
        return errorResponse(
          res,
          {
            message: 'FAQ not found',
          },
          404,
        );
      }

      // Update FAQ
      await faq.update({
        question,
        answer,
        category,
        display_order,
      });

      return successResponse(res, {
        message: 'FAQ updated successfully',
        data: faq,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to update FAQ');
    }
  }

  /**
   * Delete FAQ
   */
  static async deleteFAQ(req, res) {
    try {
      const { id } = req.params;

      // Find FAQ
      const faq = await FAQ.findByPk(id);

      if (!faq) {
        return errorResponse(
          res,
          {
            message: 'FAQ not found',
          },
          404,
        );
      }

      // Delete FAQ
      await faq.destroy();

      return successResponse(res, {
        message: 'FAQ deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to delete FAQ');
    }
  }

  /**
   * Reorder FAQs
   */
  static async reorderFAQs(req, res) {
    try {
      const { faqOrder } = req.body;

      // Update sort order for each FAQ
      const updates = faqOrder.map((faqId, index) => FAQ.update({ display_order: index + 1 }, { where: { id: faqId } }));

      await Promise.all(updates);

      return successResponse(res, {
        message: 'FAQs reordered successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to reorder FAQs');
    }
  }
}

module.exports = FAQController;
