'use strict';

import smsTemplateService from '../services/SMSTemplateService.js';

export class SMSTemplateController {
    constructor() {
        this.smsTemplateService = smsTemplateService;
    }

    async createSMSTemplate(req, res) {
        try {
            const templateData = req.body;

            const result = await this.smsTemplateService.createSMSTemplate(templateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'SMS template created',
                data: result.template
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getSMSTemplateById(req, res) {
        try {
            const templateId = req.params.templateId;

            const result = await this.smsTemplateService.getSMSTemplateById(templateId);

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

    async getSMSTemplateByCode(req, res) {
        try {
            const templateCode = req.params.templateCode;

            const result = await this.smsTemplateService.getSMSTemplateByCode(templateCode);

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

    async listSMSTemplates(req, res) {
        try {
            const filters = {
                search: req.query.search,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.smsTemplateService.listSMSTemplates(filters);

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

    async updateSMSTemplate(req, res) {
        try {
            const templateId = req.params.templateId;
            const updateData = req.body;

            const result = await this.smsTemplateService.updateSMSTemplate(templateId, updateData);

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

    async renderSMSTemplate(req, res) {
        try {
            const templateCode = req.body.templateCode;
            const variables = req.body.variables || {};

            const result = await this.smsTemplateService.renderSMSTemplate(templateCode, variables);

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

    async validateSMSTemplate(req, res) {
        try {
            const templateContent = req.body.templateContent;

            const result = await this.smsTemplateService.validateSMSTemplate(templateContent);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new SMSTemplateController();