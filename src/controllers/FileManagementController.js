'use strict';

import fileManagementService from '../services/FileManagementService.js';

export class FileManagementController {
    constructor() {
        this.fileManagementService = fileManagementService;
    }

    async uploadFile(req, res) {
        try {
            const userId = req.user.userId;
            const fileData = {
                fileName: req.file.originalname,
                mimeType: req.file.mimetype,
                category: req.body.category,
                description: req.body.description,
                tags: req.body.tags
            };
            const fileBuffer = req.file.buffer;

            const result = await this.fileManagementService.uploadFile(userId, fileData, fileBuffer);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'File uploaded',
                data: result.file
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getFileById(req, res) {
        try {
            const fileId = req.params.fileId;
            const userId = req.user.userId;

            const result = await this.fileManagementService.getFileById(fileId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.file
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listUserFiles(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                category: req.query.category,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.fileManagementService.listUserFiles(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.files,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async downloadFile(req, res) {
        try {
            const fileId = req.params.fileId;
            const userId = req.user.userId;

            const result = await this.fileManagementService.downloadFile(fileId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                downloadUrl: result.file.url,
                fileName: result.fileName
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteFile(req, res) {
        try {
            const fileId = req.params.fileId;
            const userId = req.user.userId;

            const result = await this.fileManagementService.deleteFile(fileId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'File deleted'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateFileMetadata(req, res) {
        try {
            const fileId = req.params.fileId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.fileManagementService.updateFileMetadata(fileId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'File metadata updated',
                data: result.file
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserFileStats(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.fileManagementService.getUserFileStats(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.stats
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new FileManagementController();