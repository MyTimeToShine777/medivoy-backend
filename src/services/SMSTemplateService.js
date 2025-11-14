'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class SMSTemplateService {
    constructor() {
        this.validationService = validationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SMS TEMPLATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createSMSTemplate(templateData) {
        try {
            if (!templateData || !templateData.templateName || !templateData.messageContent) {
                throw new AppError('Template name and content required', 400);
            }

            if (templateData.messageContent.length > 160) {
                throw new AppError('SMS content must be 160 characters or less', 400);
            }

            const result = await prisma.$transaction(async(tx) => {
                const existing = await tx.sMSTemplate.findFirst({
                    where: { templateCode: templateData.templateCode }
                });

                if (existing) {
                    throw new AppError('Template already exists', 409);
                }

                const template = await tx.sMSTemplate.create({
                    data: {
                        templateId: this._generateTemplateId(),
                        templateName: templateData.templateName,
                        templateCode: templateData.templateCode,
                        messageContent: templateData.messageContent,
                        characterCount: templateData.messageContent.length,
                        variables: templateData.variables || [],
                        description: templateData.description || null,
                        isActive: true,
                        createdAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'SMS_TEMPLATE_CREATED',
                    entityType: 'SMSTemplate',
                    entityId: template.templateId,
                    userId: 'ADMIN',
                    details: { templateName: templateData.templateName }
                });

                return template;
            });

            return {
                success: true,
                message: 'SMS template created',
                template: result
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getSMSTemplateById(templateId) {
        try {
            if (!templateId) {
                return { success: false, error: 'Template ID required' };
            }

            const template = await prisma.sMSTemplate.findUnique({ where: { templateId } });
            if (!template) {
                return { success: false, error: 'Template not found' };
            }

            return { success: true, template: template };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getSMSTemplateByCode(templateCode) {
        try {
            if (!templateCode) {
                return { success: false, error: 'Template code required' };
            }

            const template = await prisma.sMSTemplate.findFirst({
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

    async listSMSTemplates(filters = {}) {
        try {
            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { isActive: true };

            if (filters && filters.search) {
                where.OR = [{
                        templateName: {
                            contains: filters.search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        templateCode: {
                            contains: filters.search,
                            mode: 'insensitive'
                        }
                    }
                ];
            }

            const templates = await prisma.sMSTemplate.findMany({
                where: where,
                orderBy: {
                    templateName: 'asc'
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.sMSTemplate.count({ where: where });

            return {
                success: true,
                templates: templates,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateSMSTemplate(templateId, updateData) {
        try {
            if (!templateId || !updateData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const result = await prisma.$transaction(async(tx) => {
                const template = await tx.sMSTemplate.findUnique({
                    where: { id: templateId }
                });

                if (!template) {
                    throw new AppError('Template not found', 404);
                }

                const updateFields = {};

                if (updateData.messageContent) {
                    if (updateData.messageContent.length > 160) {
                        throw new AppError('SMS content must be 160 characters or less', 400);
                    }
                    updateFields.messageContent = updateData.messageContent;
                    updateFields.characterCount = updateData.messageContent.length;
                }

                if (updateData.description !== undefined) updateFields.description = updateData.description;
                if (updateData.variables !== undefined) updateFields.variables = updateData.variables;

                const updatedTemplate = await tx.sMSTemplate.update({
                    where: { id: templateId },
                    data: updateFields
                });

                await this.auditLogService.logAction({
                    action: 'SMS_TEMPLATE_UPDATED',
                    entityType: 'SMSTemplate',
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

    async renderSMSTemplate(templateCode, variables = {}) {
        try {
            if (!templateCode) {
                return { success: false, error: 'Template code required' };
            }

            const template = await prisma.sMSTemplate.findFirst({
                where: { templateCode: templateCode, isActive: true }
            });

            if (!template) {
                return { success: false, error: 'Template not found' };
            }

            let renderedContent = template.messageContent;

            // Replace variables
            for (const [key, value] of Object.entries(variables)) {
                const regex = new RegExp('{{' + key + '}}', 'g');
                renderedContent = renderedContent.replace(regex, value || '');
            }

            if (renderedContent.length > 160) {
                return { success: false, error: 'Rendered message exceeds 160 characters' };
            }

            return {
                success: true,
                rendered: {
                    message: renderedContent,
                    characterCount: renderedContent.length
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async validateSMSTemplate(templateContent) {
        try {
            if (!templateContent) {
                return { success: false, error: 'Template content required' };
            }

            const charCount = templateContent.length;
            const isValid = charCount <= 160;

            return {
                success: true,
                isValid: isValid,
                characterCount: charCount,
                remainingCharacters: 160 - charCount
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
        return 'STEMPL-' + ts + rnd;
    }
}

export default new SMSTemplateService();