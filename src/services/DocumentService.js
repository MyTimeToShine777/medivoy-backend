// Document Service - Document upload and management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';
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
            const document = await prisma.document.create({
                data: {
                    ...documentData,
                    filePath: file.path,
                    fileName: file.originalname,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                }
            });

            return { success: true, data: document };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET DOCUMENT ==========
    async getDocumentById(documentId) {
        try {
            const document = await prisma.document.findUnique({
                where: { documentId },
                include: {
                    uploadedBy: true,
                    booking: true
                }
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
            const documents = await prisma.document.findMany({
                where: { userId },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VERIFY DOCUMENT ==========
    async verifyDocument(documentId) {
        try {
            const document = await prisma.document.findUnique({
                where: { documentId }
            });
            if (!document) return { success: false, error: 'Not found' };

            const updated = await prisma.document.update({
                where: { documentId },
                data: {
                    isVerified: true,
                    verifiedAt: new Date()
                }
            });

            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DELETE DOCUMENT ==========
    async deleteDocument(documentId) {
        try {
            const document = await prisma.document.findUnique({
                where: { documentId }
            });
            if (!document) return { success: false, error: 'Not found' };

            await prisma.document.delete({
                where: { documentId }
            });
            return { success: true, message: 'Document deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export { DocumentService };
export default new DocumentService();