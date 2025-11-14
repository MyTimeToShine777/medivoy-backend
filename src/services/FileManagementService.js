'use strict';

import prisma from '../config/prisma.js';
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

            const file = await prisma.$transaction(async (tx) => {
                const newFile = await tx.file.create({
                    data: {
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
                    }
                });

                await this.auditLogService.logAction({
                    action: 'FILE_UPLOADED',
                    entityType: 'File',
                    entityId: newFile.fileId,
                    userId: userId,
                    details: { fileName: fileData.fileName, size: uploadedFile.size }
                }, tx);

                return newFile;
            });

            return { success: true, message: 'File uploaded', file: file };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getFileById(fileId, userId) {
        try {
            if (!fileId || !userId) {
                return { success: false, error: 'Required parameters missing' };
            }

            const file = await prisma.file.findFirst({
                where: { fileId, userId }
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

            const [files, total] = await Promise.all([
                prisma.file.findMany({
                    where,
                    orderBy: { uploadedAt: 'desc' },
                    take: limit,
                    skip: offset
                }),
                prisma.file.count({ where })
            ]);

            return {
                success: true,
                files: files,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
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

            const file = await prisma.file.findFirst({
                where: { fileId, userId }
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
        try {
            if (!fileId || !userId) {
                return { success: false, error: 'Required parameters missing' };
            }

            await prisma.$transaction(async (tx) => {
                const file = await tx.file.findFirst({
                    where: { fileId, userId }
                });

                if (!file) {
                    throw new AppError('File not found', 404);
                }

                await this.storageService.deleteFile(file.fileUrl);
                await tx.file.delete({ where: { fileId } });

                await this.auditLogService.logAction({
                    action: 'FILE_DELETED',
                    entityType: 'File',
                    entityId: fileId,
                    userId: userId,
                    details: {}
                }, tx);
            });

            return { success: true, message: 'File deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateFileMetadata(fileId, userId, updateData) {
        try {
            if (!fileId || !userId || !updateData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const file = await prisma.$transaction(async (tx) => {
                const existingFile = await tx.file.findFirst({
                    where: { fileId, userId }
                });

                if (!existingFile) {
                    throw new AppError('File not found', 404);
                }

                const updatedFile = await tx.file.update({
                    where: { fileId },
                    data: {
                        description: updateData.description || existingFile.description,
                        tags: updateData.tags || existingFile.tags
                    }
                });

                await this.auditLogService.logAction({
                    action: 'FILE_METADATA_UPDATED',
                    entityType: 'File',
                    entityId: fileId,
                    userId: userId,
                    details: {}
                }, tx);

                return updatedFile;
            });

            return { success: true, message: 'File metadata updated', file: file };
        } catch (error) {
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

            const totalFiles = await prisma.file.count({ where: { userId } });
            const totalSizeResult = await prisma.file.aggregate({
                where: { userId },
                _sum: { fileSize: true }
            });

            const filesByCategory = await prisma.file.groupBy({
                by: ['category'],
                where: { userId },
                _count: { fileId: true }
            });

            return {
                success: true,
                stats: {
                    totalFiles: totalFiles,
                    totalSizeMB: ((totalSizeResult._sum.fileSize || 0) / (1024 * 1024)).toFixed(2),
                    filesByCategory: filesByCategory.map(item => ({
                        category: item.category,
                        count: item._count.fileId
                    }))
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