const WebsiteContent = require('../models/WebsiteContent.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class WebsiteContentController {
  /**
   * Create a new website content
   */
  async createContent(req, res) {
    try {
      const {
        title, slug, content, contentType, isActive, metaTitle, metaDescription,
      } = req.body;

      // Create website content
      const websiteContent = await WebsiteContent.create({
        title,
        slug,
        content,
        contentType,
        isActive,
        metaTitle,
        metaDescription,
      });

      return successResponse(res, {
        message: 'Website content created successfully',
        data: websiteContent,
      }, 201);
    } catch (error) {
      logger.error('Create website content error:', error);
      return errorResponse(res, {
        message: 'Failed to create website content',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get website content by ID
   */
  async getContent(req, res) {
    try {
      const { id } = req.params;

      // Find website content
      const websiteContent = await WebsiteContent.findByPk(id);

      if (!websiteContent) {
        return errorResponse(res, {
          message: 'Website content not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'Website content retrieved successfully',
        data: websiteContent,
      });
    } catch (error) {
      logger.error('Get website content error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve website content',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update website content
   */
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const {
        title, slug, content, contentType, isActive, metaTitle, metaDescription,
      } = req.body;

      // Find website content
      const websiteContent = await WebsiteContent.findByPk(id);

      if (!websiteContent) {
        return errorResponse(res, {
          message: 'Website content not found',
        }, 404);
      }

      // Update website content
      await websiteContent.update({
        title,
        slug,
        content,
        contentType,
        isActive,
        metaTitle,
        metaDescription,
      });

      return successResponse(res, {
        message: 'Website content updated successfully',
        data: websiteContent,
      });
    } catch (error) {
      logger.error('Update website content error:', error);
      return errorResponse(res, {
        message: 'Failed to update website content',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete website content
   */
  async deleteContent(req, res) {
    try {
      const { id } = req.params;

      // Find website content
      const websiteContent = await WebsiteContent.findByPk(id);

      if (!websiteContent) {
        return errorResponse(res, {
          message: 'Website content not found',
        }, 404);
      }

      // Delete website content
      await websiteContent.destroy();

      return successResponse(res, {
        message: 'Website content deleted successfully',
      });
    } catch (error) {
      logger.error('Delete website content error:', error);
      return errorResponse(res, {
        message: 'Failed to delete website content',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all website content
   */
  async getAllContent(req, res) {
    try {
      const {
        page = 1, limit = 10, contentType, isActive,
      } = req.query;

      // Build where clause
      const where = {};
      if (contentType) where.contentType = contentType;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get website content with pagination
      const contents = await WebsiteContent.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Website content retrieved successfully',
        data: contents.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(contents.count / parseInt(limit, 10)),
          totalRecords: contents.count,
        },
      });
    } catch (error) {
      logger.error('Get all website content error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve website content',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get website content by slug
   */
  async getContentBySlug(req, res) {
    try {
      const { slug } = req.params;

      // Find website content by slug
      const websiteContent = await WebsiteContent.findOne({
        where: { slug },
      });

      if (!websiteContent) {
        return errorResponse(res, {
          message: 'Website content not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'Website content retrieved successfully',
        data: websiteContent,
      });
    } catch (error) {
      logger.error('Get website content by slug error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve website content',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new WebsiteContentController();
