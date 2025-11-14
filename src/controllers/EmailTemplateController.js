'use strict';

import emailTemplateService from '../services/EmailTemplateService.js';

export class EmailTemplateController {
    constructor() {
        this.emailTemplateService = emailTemplateService;
    }

    async createEmailTemplate(req, res) {
        try {
            const templateData = req.body;

            const result = await this.emailTemplateService.createEmailTemplate(templateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Email template created',
                data: result.template
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getEmailTemplateById(req, res) {
        try {
            const templateId = req.params.templateId;

            const result = await this.emailTemplateService.getEmailTemplateById(templateId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.template
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getEmailTemplateByCode(req, res) {
        try {
            const templateCode = req.params.templateCode;

            const result = await this.emailTemplateService.getEmailTemplateByCode(templateCode);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.template
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listEmailTemplates(req, res) {
        try {
            const filters = {
                search: req.query.search,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.emailTemplateService.listEmailTemplates(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.templates,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateEmailTemplate(req, res) {
        try {
            const templateId = req.params.templateId;
            const updateData = req.body;

            const result = await this.emailTemplateService.updateEmailTemplate(templateId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Template updated',
                data: result.template
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteEmailTemplate(req, res) {
        try {
            const templateId = req.params.templateId;

            const result = await this.emailTemplateService.deleteEmailTemplate(templateId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Template deleted'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async renderEmailTemplate(req, res) {
        try {
            const templateCode = req.body.templateCode;
            const variables = req.body.variables || {};

            const result = await this.emailTemplateService.renderEmailTemplate(templateCode, variables);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.rendered
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new EmailTemplateController();