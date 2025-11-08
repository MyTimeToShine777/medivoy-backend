'use strict';

import ImageKit from 'imagekit';
import fs from 'fs';
import path from 'path';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class StorageService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();

        this.imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });

        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE UPLOAD
    // ═══════════════════════════════════════════════════════════════════════════════

    async uploadFile(fileBuffer, fileData) {
        try {
            if (!fileBuffer || !fileData) {
                return { success: false, error: 'File and metadata required' };
            }

            // Validate file
            const validation = this._validateFile(fileBuffer, fileData);
            if (!validation.isValid) {
                return { success: false, error: validation.error };
            }

            const fileName = this._sanitizeFileName(fileData.fileName);
            const folder = fileData.folder || 'uploads';
            const filePath = folder + '/' + fileName;

            const upload = await this.imagekit.upload({
                file: fileBuffer,
                fileName: fileName,
                folder: folder,
                customMetadata: {
                    uploadedBy: fileData.uploadedBy || 'system',
                    documentType: fileData.documentType || 'general',
                    uploadedAt: new Date().toISOString()
                }
            });

            return {
                success: true,
                file: {
                    fileId: upload.fileId,
                    url: upload.url,
                    name: upload.name,
                    size: upload.size,
                    mimeType: fileData.mimeType,
                    path: filePath,
                    uploadedAt: new Date()
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async uploadMultipleFiles(filesBuffer, folderPath) {
        try {
            if (!filesBuffer || !Array.isArray(filesBuffer) || filesBuffer.length === 0) {
                return { success: false, error: 'Files array required' };
            }

            const uploadResults = [];

            for (const fileBuffer of filesBuffer) {
                try {
                    const fileName = this._sanitizeFileName(fileBuffer.fileName);
                    const upload = await this.imagekit.upload({
                        file: fileBuffer.buffer,
                        fileName: fileName,
                        folder: folderPath || 'uploads'
                    });

                    uploadResults.push({
                        success: true,
                        file: {
                            fileId: upload.fileId,
                            url: upload.url,
                            name: upload.name,
                            size: upload.size
                        }
                    });
                } catch (err) {
                    uploadResults.push({
                        success: false,
                        fileName: fileBuffer.fileName,
                        error: err.message
                    });
                }
            }

            const successCount = uploadResults.filter(r => r.success).length;
            const failureCount = uploadResults.filter(r => !r.success).length;

            return {
                success: true,
                results: uploadResults,
                summary: { successCount: successCount, failureCount: failureCount }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async downloadFile(fileUrl) {
        try {
            if (!fileUrl) {
                return { success: false, error: 'File URL required' };
            }

            // Note: This returns the URL for download, actual download happens on client
            return {
                success: true,
                downloadUrl: fileUrl,
                message: 'Download URL generated'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteFile(fileUrl) {
        try {
            if (!fileUrl) {
                return { success: false, error: 'File URL required' };
            }

            // Extract file ID from URL
            const fileId = this._extractFileIdFromUrl(fileUrl);
            if (!fileId) {
                return { success: false, error: 'Invalid file URL' };
            }

            const result = await this.imagekit.deleteFile(fileId);

            return { success: true, message: 'File deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteMultipleFiles(fileIds) {
        try {
            if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
                return { success: false, error: 'File IDs array required' };
            }

            const results = await this.imagekit.deleteFiles(fileIds);

            return {
                success: true,
                message: 'Files deleted',
                results: results
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // IMAGE TRANSFORMATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async transformImage(fileUrl, transformations = {}) {
        try {
            if (!fileUrl) {
                return { success: false, error: 'File URL required' };
            }

            let transformedUrl = fileUrl;

            // Build transformation query
            const params = [];

            if (transformations.width) {
                params.push('w-' + transformations.width);
            }
            if (transformations.height) {
                params.push('h-' + transformations.height);
            }
            if (transformations.quality) {
                params.push('q-' + transformations.quality);
            }
            if (transformations.crop) {
                params.push('c-' + transformations.crop);
            }
            if (transformations.format) {
                params.push('f-' + transformations.format);
            }

            if (params.length > 0) {
                const queryString = params.join(',');
                transformedUrl = fileUrl + '?tr=' + queryString;
            }

            return {
                success: true,
                url: transformedUrl,
                transformations: transformations
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE METADATA
    // ═══════════════════════════════════════════════════════════════════════════════

    async getFileMetadata(fileUrl) {
        try {
            if (!fileUrl) {
                return { success: false, error: 'File URL required' };
            }

            const fileId = this._extractFileIdFromUrl(fileUrl);
            if (!fileId) {
                return { success: false, error: 'Invalid file URL' };
            }

            const fileDetails = await this.imagekit.getFileDetails(fileId);

            return {
                success: true,
                metadata: {
                    fileId: fileDetails.fileId,
                    name: fileDetails.name,
                    size: fileDetails.size,
                    width: fileDetails.width,
                    height: fileDetails.height,
                    format: fileDetails.format,
                    createdAt: fileDetails.createdAt,
                    url: fileDetails.url
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async listFiles(folderPath = '/') {
        try {
            const files = await this.imagekit.listFiles({
                path: folderPath
            });

            return {
                success: true,
                files: files,
                totalFiles: files.length
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SIGNED URL & AUTHENTICATION
    // ═══════════════════════════════════════════════════════════════════════════════

    async generateSignedUrl(fileUrl, expirySeconds = 3600) {
        try {
            if (!fileUrl) {
                return { success: false, error: 'File URL required' };
            }

            const url = this.imagekit.getSignedUrl({
                url: fileUrl,
                expireSeconds: expirySeconds
            });

            return {
                success: true,
                signedUrl: url,
                expiresIn: expirySeconds
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getAuthenticationParameters() {
        try {
            const authParams = this.imagekit.getAuthenticationParameters();

            return {
                success: true,
                auth: {
                    token: authParams.token,
                    expire: authParams.expire,
                    signature: authParams.signature
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _validateFile(fileBuffer, fileData) {
        if (!fileBuffer) {
            return { isValid: false, error: 'File buffer is empty' };
        }

        if (fileBuffer.length > this.maxFileSize) {
            return { isValid: false, error: 'File size exceeds maximum limit (50MB)' };
        }

        if (!this.allowedMimeTypes.includes(fileData.mimeType)) {
            return { isValid: false, error: 'File type not allowed' };
        }

        if (!fileData.fileName) {
            return { isValid: false, error: 'File name required' };
        }

        return { isValid: true };
    }

    _sanitizeFileName(fileName) {
        // Remove special characters and spaces
        return fileName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    _extractFileIdFromUrl(fileUrl) {
        try {
            // Extract file ID from ImageKit URL
            // Format: https://ik.imagekit.io/[urlEndpoint]/[fileId]
            const urlParts = fileUrl.split('/');
            const fileId = urlParts[urlParts.length - 1];
            return fileId || null;
        } catch (error) {
            return null;
        }
    }

    _generateStoragePath(category, userId) {
        return category + '/' + userId + '/' + Date.now();
    }
}

export default new StorageService();