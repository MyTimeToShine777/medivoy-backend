// Document Service - Document upload and management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { Document, User, Booking } from '../models/index.js';
import multer from 'multer';
import path from 'path';

class DocumentService {
    constructor() {
        this.upload = multer({
            dest: 'uploads/documents/',
            limits: { fileSize: 10 * 1024 * 1024 },
        });
    }

    // ========== UPLOAD DOCUMENT ==========
    async uploadDocument(documentData, file) {
        try {
            const document = await Document.create({
                ...documentData,
                filePath: file.path,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype,
            });

            return { success: true, data: document };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET DOCUMENT ==========
    async getDocumentById(documentId) {
        try {
            const document = await Document.findByPk(documentId, {
                include: [
                    { model: User, as: 'uploadedBy' },
                    { model: Booking, as: 'booking' },
                ],
            });

            if (!document) return { success: false, error: 'Not found' };
            return { success: true, data: document };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET USER DOCUMENTS ==========
    async getUserDocuments(userId) {
        try {
            const documents = await Document.findAll({
                where: { userId },
                order: [
                    ['createdAt', 'DESC']
                ],
            });

            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VERIFY DOCUMENT ==========
    async verifyDocument(documentId) {
        try {
            const document = await Document.findByPk(documentId);
            if (!document) return { success: false, error: 'Not found' };

            document.isVerified = true;
            document.verifiedAt = new Date();
            await document.save();

            return { success: true, data: document };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DELETE DOCUMENT ==========
    async deleteDocument(documentId) {
        try {
            const document = await Document.findByPk(documentId);
            if (!document) return { success: false, error: 'Not found' };

            await document.destroy();
            return { success: true, message: 'Document deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new DocumentService();