'use strict';

import { StorageService } from '../services/StorageService.js';

export class StorageController {
    constructor() {
        this.storageService = new StorageService();
    }

    async uploadFile(req, res) {
        try {
            const fileBuffer = req.file.buffer;
            const fileData = {
                fileName: req.file.originalname,
                mimeType: req.file.mimetype,
                folder: req.body.folder,
                uploadedBy: req.user.userId,
                documentType: req.body.documentType
            };

            const result = await this.storageService.uploadFile(fileBuffer, fileData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'File uploaded to ImageKit',
                data: result.file
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async uploadMultipleFiles(req, res) {
        try {
            const filesBuffer = req.files.map(file => ({
                buffer: file.buffer,
                fileName: file.originalname
            }));
            const folderPath = req.body.folder || 'uploads';

            const result = await this.storageService.uploadMultipleFiles(filesBuffer, folderPath);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                results: result.results,
                summary: result.summary
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async downloadFile(req, res) {
        try {
            const fileUrl = req.body.fileUrl;

            const result = await this.storageService.downloadFile(fileUrl);

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

    async deleteFile(req, res) {
        try {
            const fileUrl = req.body.fileUrl;

            const result = await this.storageService.deleteFile(fileUrl);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'File deleted from ImageKit'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteMultipleFiles(req, res) {
        try {
            const fileIds = req.body.fileIds;

            const result = await this.storageService.deleteMultipleFiles(fileIds);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Files deleted',
                results: result.results
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async transformImage(req, res) {
        try {
            const fileUrl = req.body.fileUrl;
            const transformations = req.body.transformations;

            const result = await this.storageService.transformImage(fileUrl, transformations);

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

    async getFileMetadata(req, res) {
        try {
            const fileUrl = req.body.fileUrl;

            const result = await this.storageService.getFileMetadata(fileUrl);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.metadata
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listFiles(req, res) {
        try {
            const folderPath = req.query.folder || '/';

            const result = await this.storageService.listFiles(folderPath);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.files,
                totalFiles: result.totalFiles
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async generateSignedUrl(req, res) {
        try {
            const fileUrl = req.body.fileUrl;
            const expirySeconds = req.body.expirySeconds || 3600;

            const result = await this.storageService.generateSignedUrl(fileUrl, expirySeconds);

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

    async getAuthenticationParameters(req, res) {
        try {
            const result = await this.storageService.getAuthenticationParameters();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.auth
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new StorageController();