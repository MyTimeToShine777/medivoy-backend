const faqService = require('../services/faq.service');
const { successResponse } = require('../utils/response');

class FAQController {
  async createFAQ(req, res, next) {
    try {
      const faq = await faqService.createFAQ(req.body);
      return successResponse(res, faq, 'FAQ created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getFAQ(req, res, next) {
    try {
      const faq = await faqService.getFAQById(req.params.id);
      return successResponse(res, faq, 'FAQ retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllFAQs(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await faqService.getAllFAQs(filters, { page, limit });
      return successResponse(res, result, 'FAQs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFAQsByCategory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await faqService.getFAQsByCategory(req.params.category, { page, limit });
      return successResponse(res, result, 'FAQs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateFAQ(req, res, next) {
    try {
      const faq = await faqService.updateFAQ(req.params.id, req.body);
      return successResponse(res, faq, 'FAQ updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteFAQ(req, res, next) {
    try {
      const result = await faqService.deleteFAQ(req.params.id);
      return successResponse(res, result, 'FAQ deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async reorderFAQs(req, res, next) {
    try {
      const result = await faqService.reorderFAQs(req.body.orders);
      return successResponse(res, result, 'FAQs reordered successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FAQController();
