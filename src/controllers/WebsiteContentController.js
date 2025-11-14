'use strict';

import websiteContentService from '../services/WebsiteContentService.js';

export class WebsiteContentController {
    constructor() {
        this.websiteContentService = websiteContentService;
    }

    async createContent(req, res) {
        try {
            const contentData = req.body;

            const result = await this.websiteContentService.createContent(contentData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Website content created successfully',
                data: result.content
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getContentById(req, res) {
        try {
            const contentId = req.params.contentId;

            const result = await this.websiteContentService.getContentById(contentId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.content
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getContentBySlug(req, res) {
        try {
            const slug = req.params.slug;

            const result = await this.websiteContentService.getContentBySlug(slug);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.content
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listContent(req, res) {
        try {
            const filters = {
                type: req.query.type,
                status: req.query.status,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.websiteContentService.listContent(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.contents,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateContent(req, res) {
        try {
            const contentId = req.params.contentId;
            const updateData = req.body;

            const result = await this.websiteContentService.updateContent(contentId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Website content updated successfully',
                data: result.content
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async publishContent(req, res) {
        try {
            const contentId = req.params.contentId;

            const result = await this.websiteContentService.publishContent(contentId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Website content published successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async unpublishContent(req, res) {
        try {
            const contentId = req.params.contentId;

            const result = await this.websiteContentService.unpublishContent(contentId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Website content unpublished successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteContent(req, res) {
        try {
            const contentId = req.params.contentId;

            const result = await this.websiteContentService.deleteContent(contentId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Website content deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new WebsiteContentController();