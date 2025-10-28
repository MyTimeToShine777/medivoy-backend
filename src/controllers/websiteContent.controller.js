const websiteContentService = require('../services/websiteContent.service');
const { successResponse } = require('../utils/response');

class WebsiteContentController {
  async createContent(req, res, next) {
    try {
      const content = await websiteContentService.createContent(req.body);
      return successResponse(res, content, 'Website content created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getContent(req, res, next) {
    try {
      const content = await websiteContentService.getContentById(req.params.id);
      return successResponse(res, content, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getContentBySlug(req, res, next) {
    try {
      const content = await websiteContentService.getContentBySlug(req.params.slug);
      return successResponse(res, content, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllContent(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await websiteContentService.getAllContent(filters, { page, limit });
      return successResponse(res, result, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getContentByType(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await websiteContentService.getContentByType(req.params.type, { page, limit });
      return successResponse(res, result, 'Website content retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateContent(req, res, next) {
    try {
      const content = await websiteContentService.updateContent(req.params.id, req.body);
      return successResponse(res, content, 'Website content updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async publishContent(req, res, next) {
    try {
      const content = await websiteContentService.publishContent(req.params.id);
      return successResponse(res, content, 'Website content published successfully');
    } catch (error) {
      next(error);
    }
  }

  async unpublishContent(req, res, next) {
    try {
      const content = await websiteContentService.unpublishContent(req.params.id);
      return successResponse(res, content, 'Website content unpublished successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteContent(req, res, next) {
    try {
      const result = await websiteContentService.deleteContent(req.params.id);
      return successResponse(res, result, 'Website content deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WebsiteContentController();
