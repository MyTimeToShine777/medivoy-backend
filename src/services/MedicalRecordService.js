// Medical Record Service - Patient medical records
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class MedicalRecordService {
    // ========== CREATE MEDICAL RECORD ==========
    async createMedicalRecord(recordData) {
        try {
            const record = await prisma.medicalRecord.create({
                data: {
                    ...recordData,
                    status: 'active'
                }
            });

            return { success: true, data: record };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET RECORD ==========
    async getMedicalRecordById(recordId) {
        try {
            const record = await prisma.medicalRecord.findUnique({
                where: { recordId },
                include: {
                    patient: true,
                    doctor: true,
                    hospital: true
                }
            });

            if (!record) return { success: false, error: 'Not found' };
            return { success: true, data: record };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT RECORDS ==========
    async getPatientRecords(userId, filters = {}) {
        try {
            const where = { userId, isActive: true };

            if (filters.recordType) where.recordType = filters.recordType;

            const records = await prisma.medicalRecord.findMany({
                where,
                orderBy: {
                    recordDate: 'desc'
                },
                take: filters.limit || 50,
                skip: filters.offset || 0
            });

            return { success: true, data: records };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ARCHIVE RECORD ==========
    async archiveRecord(recordId) {
        try {
            const record = await prisma.medicalRecord.findUnique({ where: { recordId } });
            if (!record) return { success: false, error: 'Not found' };

            record.status = 'archived';
            await prisma.medicalRecord.update({ where: { recordId }, data: { status: record.status } });

            return { success: true, data: record };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export { MedicalRecordService };
export default new MedicalRecordService();