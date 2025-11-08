'use strict';

import { FAQService } from '../services/FAQService.js';

export class FAQController {
    constructor() {
        this.faqService = new FAQService();
    }

    async createFAQ(req, res) {
        try {
            const faqData = req.body;

            const result = await this.faqService.createFAQ(faqData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'FAQ created successfully',
                data: result.faq
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getFAQById(req, res) {
        try {
            const faqId = req.params.faqId;

            const result = await this.faqService.getFAQById(faqId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.faq
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listFAQs(req, res) {
        try {
            const filters = {
                category: req.query.category,
                search: req.query.search,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.faqService.listFAQs(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.faqs,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async searchFAQs(req, res) {
        try {
            const query = req.query.q;

            const result = await this.faqService.searchFAQs(query);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.faqs,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateFAQ(req, res) {
        try {
            const faqId = req.params.faqId;
            const updateData = req.body;

            const result = await this.faqService.updateFAQ(faqId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'FAQ updated successfully',
                data: result.faq
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteFAQ(req, res) {
        try {
            const faqId = req.params.faqId;

            const result = await this.faqService.deleteFAQ(faqId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'FAQ deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getCategories(req, res) {
        try {
            const result = await this.faqService.getCategories();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.categories
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new FAQController();