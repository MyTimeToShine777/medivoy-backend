'use strict';

import { Op, sequelize } from 'sequelize';
import { File, AuditLog } from '../models/index.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { StorageService } from './StorageService.js';
import { AppError } from '../utils/errors/AppError.js';

export class FileManagementService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
        this.storageService = new StorageService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE UPLOAD & STORAGE
    // ═══════════════════════════════════════════════════════════════════════════════

    async uploadFile(userId, fileData, fileBuffer) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !fileData || !fileBuffer) {
                throw new AppError('Required parameters missing', 400);
            }

            const errors = this.validationService.validateFileUpload(fileData, fileBuffer);
            if (errors.length) {
                throw new AppError(errors.join(', '), 400);
            }

            const uploadedFile = await this.storageService.uploadFile(fileBuffer, {
                folder: fileData.category || 'files',
                fileName: fileData.fileName,
                mimeType: fileData.mimeType
            });

            const file = await File.create({
                fileId: this._generateFileId(),
                userId: userId,
                fileName: fileData.fileName,
                fileUrl: uploadedFile.url,
                fileMimeType: uploadedFile.mimeType,
                fileSize: uploadedFile.size,
                category: fileData.category || 'general',
                description: fileData.description || null,
                tags: fileData.tags || [],
                uploadedAt: new Date()
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'FILE_UPLOADED',
                entityType: 'File',
                entityId: file.fileId,
                userId: userId,
                details: { fileName: fileData.fileName, size: uploadedFile.size }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'File uploaded', file: file };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    async getFileById(fileId, userId) {
        try {
            if (!fileId || !userId) {
                return { success: false, error: 'Required parameters missing' };
            }

            const file = await File.findOne({
                where: { fileId: fileId, userId: userId }
            });

            if (!file) {
                return { success: false, error: 'File not found' };
            }

            return { success: true, file: file };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async listUserFiles(userId, filters = {}) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID required' };
            }

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { userId: userId };

            if (filters && filters.category) {
                where.category = filters.category;
            }

            const files = await File.findAll({
                where: where,
                order: [
                    ['uploadedAt', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await File.count({ where: where });

            return {
                success: true,
                files: files,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async downloadFile(fileId, userId) {
        try {
            if (!fileId || !userId) {
                return { success: false, error: 'Required parameters missing' };
            }

            const file = await File.findOne({
                where: { fileId: fileId, userId: userId }
            });

            if (!file) {
                return { success: false, error: 'File not found' };
            }

            const fileData = await this.storageService.downloadFile(file.fileUrl);

            return { success: true, file: fileData, fileName: file.fileName };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async deleteFile(fileId, userId) {
        const transaction = await sequelize.transaction();
        try {
            if (!fileId || !userId) {
                return { success: false, error: 'Required parameters missing' };
            }

            const file = await File.findOne({
                where: { fileId: fileId, userId: userId },
                transaction: transaction
            });

            if (!file) {
                await transaction.rollback();
                return { success: false, error: 'File not found' };
            }

            await this.storageService.deleteFile(file.fileUrl);
            await file.destroy({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'FILE_DELETED',
                entityType: 'File',
                entityId: fileId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'File deleted' };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    async updateFileMetadata(fileId, userId, updateData) {
        const transaction = await sequelize.transaction();
        try {
            if (!fileId || !userId || !updateData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const file = await File.findOne({
                where: { fileId: fileId, userId: userId },
                transaction: transaction
            });

            if (!file) {
                await transaction.rollback();
                return { success: false, error: 'File not found' };
            }

            if (updateData.description) file.description = updateData.description;
            if (updateData.tags) file.tags = updateData.tags;

            await file.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'FILE_METADATA_UPDATED',
                entityType: 'File',
                entityId: fileId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'File metadata updated', file: file };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserFileStats(userId) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID required' };
            }

            const totalFiles = await File.count({ where: { userId: userId } });
            const totalSize = await File.sum('fileSize', { where: { userId: userId } });

            const filesByCategory = await File.findAll({
                where: { userId: userId },
                attributes: ['category', [sequelize.fn('COUNT', sequelize.col('fileId')), 'count']],
                group: ['category'],
                raw: true
            });

            return {
                success: true,
                stats: {
                    totalFiles: totalFiles,
                    totalSizeMB: ((totalSize || 0) / (1024 * 1024)).toFixed(2),
                    filesByCategory: filesByCategory
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateFileId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 10000).toString(36).toUpperCase();
        return 'FILE-' + ts + rnd;
    }
}

export default new FileManagementService();