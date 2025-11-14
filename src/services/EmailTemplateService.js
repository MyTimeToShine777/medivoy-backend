'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class EmailTemplateService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EMAIL TEMPLATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createEmailTemplate(templateData) {
        try {
            if (!templateData || !templateData.templateName || !templateData.subject) {
                throw new AppError('Template name and subject required', 400);
            }

            const result = await prisma.$transaction(async(tx) => {
                const existing = await tx.emailTemplate.findFirst({
                    where: { templateCode: templateData.templateCode }
                });

                if (existing) {
                    throw new AppError('Template already exists', 409);
                }

                const template = await tx.emailTemplate.create({
                    data: {
                        templateId: this._generateTemplateId(),
                        templateName: templateData.templateName,
                        templateCode: templateData.templateCode,
                        subject: templateData.subject,
                        bodyHtml: templateData.bodyHtml,
                        bodyText: templateData.bodyText || null,
                        variables: templateData.variables || [],
                        description: templateData.description || null,
                        isActive: true,
                        createdAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'EMAIL_TEMPLATE_CREATED',
                    entityType: 'EmailTemplate',
                    entityId: template.templateId,
                    userId: 'ADMIN',
                    details: { templateName: templateData.templateName }
                });

                return template;
            });

            return {
                success: true,
                message: 'Email template created',
                template: result
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getEmailTemplateById(templateId) {
        try {
            if (!templateId) {
                return { success: false, error: 'Template ID required' };
            }

            const template = await prisma.emailTemplate.findUnique({ where: { templateId } });
            if (!template) {
                return { success: false, error: 'Template not found' };
            }

            return { success: true, template: template };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getEmailTemplateByCode(templateCode) {
        try {
            if (!templateCode) {
                return { success: false, error: 'Template code required' };
            }

            const template = await EmailTemplate.findOne({
                where: { templateCode: templateCode, isActive: true }
            });

            if (!template) {
                return { success: false, error: 'Template not found' };
            }

            return { success: true, template: template };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async listEmailTemplates(filters = {}) {
        try {
            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { isActive: true };

            if (filters && filters.search) {
                where.OR = [{
                        templateName: {
                            contains: "' + filters.search + '"
                        }
                    },
                    {
                        templateCode: {
                            contains: "' + filters.search + '"
                        }
                    }
                ];
            }

            const templates = await prisma.emailTemplate.findMany({
                where: where,
                order: [
                    ['templateName', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await EmailTemplate.count({ where: where });

            return {
                success: true,
                templates: templates,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateEmailTemplate(templateId, updateData) {
        try {
            if (!templateId || !updateData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const result = await prisma.$transaction(async(tx) => {
                const template = await tx.emailTemplate.findUnique({
                    where: { id: templateId }
                });

                if (!template) {
                    throw new AppError('Template not found', 404);
                }

                const allowedFields = ['subject', 'bodyHtml', 'bodyText', 'variables', 'description'];
                const updateFields = {};
                for (const field of allowedFields) {
                    if (updateData[field] !== undefined) {
                        updateFields[field] = updateData[field];
                    }
                }

                const updatedTemplate = await tx.emailTemplate.update({
                    where: { id: templateId },
                    data: updateFields
                });

                await this.auditLogService.logAction({
                    action: 'EMAIL_TEMPLATE_UPDATED',
                    entityType: 'EmailTemplate',
                    entityId: templateId,
                    userId: 'ADMIN',
                    details: {}
                });

                return updatedTemplate;
            });

            return { success: true, message: 'Template updated', template: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteEmailTemplate(templateId) {
        try {
            if (!templateId) {
                return { success: false, error: 'Template ID required' };
            }

            await prisma.$transaction(async(tx) => {
                const template = await tx.emailTemplate.findUnique({
                    where: { id: templateId }
                });

                if (!template) {
                    throw new AppError('Template not found', 404);
                }

                await tx.emailTemplate.delete({
                    where: { id: templateId }
                });

                await this.auditLogService.logAction({
                    action: 'EMAIL_TEMPLATE_DELETED',
                    entityType: 'EmailTemplate',
                    entityId: templateId,
                    userId: 'ADMIN',
                    details: {}
                });
            });

            return { success: true, message: 'Template deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async renderEmailTemplate(templateCode, variables = {}) {
        try {
            if (!templateCode) {
                return { success: false, error: 'Template code required' };
            }

            const template = await EmailTemplate.findOne({
                where: { templateCode: templateCode, isActive: true }
            });

            if (!template) {
                return { success: false, error: 'Template not found' };
            }

            let renderedHtml = template.bodyHtml;
            let renderedText = template.bodyText;
            let renderedSubject = template.subject;

            // Replace variables
            for (const [key, value] of Object.entries(variables)) {
                const regex = new RegExp('{{' + key + '}}', 'g');
                renderedHtml = renderedHtml.replace(regex, value || '');
                if (renderedText) renderedText = renderedText.replace(regex, value || '');
                renderedSubject = renderedSubject.replace(regex, value || '');
            }

            return {
                success: true,
                rendered: {
                    subject: renderedSubject,
                    html: renderedHtml,
                    text: renderedText
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateTemplateId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'ETEMPL-' + ts + rnd;
    }
}

export default new EmailTemplateService();