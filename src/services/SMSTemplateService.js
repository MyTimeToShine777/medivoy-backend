'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class SMSTemplateService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SMS TEMPLATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createSMSTemplate(templateData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!templateData || !templateData.templateName || !templateData.messageContent) {
                throw new AppError('Template name and content required', 400);
            }

            if (templateData.messageContent.length > 160) {
                throw new AppError('SMS content must be 160 characters or less', 400);
            }

            const existing = await tx.sMSTemplate.findFirst({
                where: { templateCode: templateData.templateCode },
                transaction: transaction
            });

            if (existing) {
                await transaction.rollback();
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
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'SMS_TEMPLATE_CREATED',
                entityType: 'SMSTemplate',
                entityId: template.templateId,
                userId: 'ADMIN',
                details: { templateName: templateData.templateName }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'SMS template created',
                template: template
            };
        } catch (error) {
            await transaction.rollback();
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

            const template = await SMSTemplate.findOne({
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
                where.OR = [
                    { templateName: {
                            contains: "' + filters.search + '" } },
                    { templateCode: {
                            contains: "' + filters.search + '" } }
                ];
            }

            const templates = await prisma.sMSTemplate.findMany({
                where: where,
                order: [
                    ['templateName', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await SMSTemplate.count({ where: where });

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
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!templateId || !updateData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const template = await SMSTemplate.findByPk(templateId, { transaction: transaction });
            if (!template) {
                await transaction.rollback();
                return { success: false, error: 'Template not found' };
            }

            if (updateData.messageContent) {
                if (updateData.messageContent.length > 160) {
                    await transaction.rollback();
                    return { success: false, error: 'SMS content must be 160 characters or less' };
                }
                template.messageContent = updateData.messageContent;
                template.characterCount = updateData.messageContent.length;
            }

            if (updateData.description !== undefined) template.description = updateData.description;
            if (updateData.variables !== undefined) template.variables = updateData.variables;

            await template.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'SMS_TEMPLATE_UPDATED',
                entityType: 'SMSTemplate',
                entityId: templateId,
                userId: 'ADMIN',
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Template updated', template: template };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    async renderSMSTemplate(templateCode, variables = {}) {
        try {
            if (!templateCode) {
                return { success: false, error: 'Template code required' };
            }

            const template = await SMSTemplate.findOne({
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