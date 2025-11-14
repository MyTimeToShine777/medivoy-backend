'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';
import { imagekitService } from '../config/imagekit.js';

export class InsuranceDocumentService {
    async upload(userId, insuranceId, file, type, meta) {
        if (!userId || !insuranceId || !file || !type) {
            return { success: false, error: 'Required fields missing' };
        }
        try {
            const insurance = await prisma.insurance.findUnique({
                where: { insuranceId }
            });
            if (!insurance) return { success: false, error: 'Insurance not found' };

            const uploadResult = await imagekitService.uploadFile(file, `insurance_doc_${Date.now()}`);
            if (!uploadResult.success) return { success: false, error: 'File upload failed' };

            const document = await prisma.insuranceDocument.create({
                data: {
                    userId,
                    insuranceId,
                    documentType: type,
                    fileUrl: uploadResult.url,
                    fileId: uploadResult.fileId,
                    fileName: file.originalname,
                    fileSize: file.size,
                    meta: meta || {},
                    isVerified: false,
                    uploadedAt: new Date()
                }
            });

            await cacheService.delete(`insurance_documents_${userId}`);
            return { success: true, data: document };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserDocuments(userId) {
        try {
            let cached = await cacheService.get(`insurance_documents_${userId}`);
            if (cached) return { success: true, data: JSON.parse(cached) };

            const documents = await prisma.insuranceDocument.findMany({
                where: { userId },
                include: {
                    insurance: {
                        select: { insuranceName: true, provider: true }
                    }
                },
                orderBy: {
                    uploadedAt: 'desc'
                }
            });

            await cacheService.set(`insurance_documents_${userId}`, JSON.stringify(documents), 86400);
            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async verify(documentId, status) {
        try {
            const document = await prisma.insuranceDocument.findUnique({
                where: { documentId }
            });
            if (!document) return { success: false, error: 'Not found' };

            const updated = await prisma.insuranceDocument.update({
                where: { documentId },
                data: {
                    isVerified: status === 'approved',
                    verificationStatus: status,
                    verificationDate: new Date()
                }
            });

            await cacheService.delete(`insurance_documents_${document.userId}`);
            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async adminDelete(documentId) {
        try {
            const document = await prisma.insuranceDocument.findUnique({
                where: { documentId }
            });
            if (!document) return { success: false, error: 'Not found' };

            if (document.fileId) await imagekitService.deleteFile(document.fileId);
            await prisma.insuranceDocument.delete({
                where: { documentId }
            });
            await cacheService.delete(`insurance_documents_${document.userId}`);
            return { success: true, message: 'Deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export const insuranceDocumentService = new InsuranceDocumentService();
export default new InsuranceDocumentService();