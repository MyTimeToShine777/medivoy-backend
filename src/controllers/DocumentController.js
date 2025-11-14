'use strict';

import documentService from '../services/DocumentService.js';
import { AppError } from '../utils/errors/AppError.js';

export class DocumentController {
    constructor() {
        this.documentService = documentService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MEDICAL DOCUMENTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async uploadMedicalDocument(req, res) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.bookingId;
            const documentData = req.body;
            const fileBuffer = req.file.buffer;

            const result = await this.documentService.uploadMedicalDocument(userId, bookingId, documentData, fileBuffer);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Medical document uploaded',
                data: result.document
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getMedicalDocuments(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;

            const result = await this.documentService.getMedicalDocuments(bookingId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.documents,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async verifyMedicalDocument(req, res) {
        try {
            const documentId = req.params.documentId;
            const verificationData = req.body;

            const result = await this.documentService.verifyMedicalDocument(documentId, verificationData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Document verified',
                data: result.document
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteMedicalDocument(req, res) {
        try {
            const documentId = req.params.documentId;
            const userId = req.user.userId;

            const result = await this.documentService.deleteMedicalDocument(documentId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Document deleted'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PATIENT DOCUMENTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async uploadPatientDocument(req, res) {
        try {
            const userId = req.user.userId;
            const documentData = req.body;
            const fileBuffer = req.file.buffer;

            const result = await this.documentService.uploadPatientDocument(userId, documentData, fileBuffer);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Patient document uploaded',
                data: result.document
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getPatientDocuments(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.documentService.getPatientDocuments(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.documents,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async updatePatientDocument(req, res) {
        try {
            const documentId = req.params.documentId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.documentService.updatePatientDocument(documentId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Document updated',
                data: result.document
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async deletePatientDocument(req, res) {
        try {
            const documentId = req.params.documentId;
            const userId = req.user.userId;

            const result = await this.documentService.deletePatientDocument(documentId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Document deleted'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // COMMON DOCUMENT ENDPOINTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async downloadDocument(req, res) {
        try {
            const documentId = req.params.documentId;
            const userId = req.user.userId;

            const result = await this.documentService.downloadDocument(documentId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                downloadUrl: result.file.url,
                fileName: result.fileName
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getDocumentsByType(req, res) {
        try {
            const userId = req.user.userId;
            const documentType = req.params.documentType;
            const ownership = req.query.ownership;

            const result = await this.documentService.getDocumentsByType(userId, documentType, ownership);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.documents,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getDocumentStats(req, res) {
        try {
            const result = await this.documentService.getDocumentStats();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.stats
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new DocumentController();