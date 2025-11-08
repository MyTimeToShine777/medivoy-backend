// Medical Record Service - Patient medical records
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { MedicalRecord, User, Doctor, Hospital, Appointment } from '../models/index.js';

class MedicalRecordService {
    // ========== CREATE MEDICAL RECORD ==========
    async createMedicalRecord(recordData) {
        try {
            const record = await MedicalRecord.create({
                ...recordData,
                status: 'active',
            });

            return { success: true, data: record };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET RECORD ==========
    async getMedicalRecordById(recordId) {
        try {
            const record = await MedicalRecord.findByPk(recordId, {
                include: [
                    { model: User, as: 'patient' },
                    { model: Doctor, as: 'doctor' },
                    { model: Hospital, as: 'hospital' },
                ],
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

            const records = await MedicalRecord.findAll({
                where,
                order: [
                    ['recordDate', 'DESC']
                ],
                limit: filters.limit || 50,
                offset: filters.offset || 0,
            });

            return { success: true, data: records };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ARCHIVE RECORD ==========
    async archiveRecord(recordId) {
        try {
            const record = await MedicalRecord.findByPk(recordId);
            if (!record) return { success: false, error: 'Not found' };

            record.status = 'archived';
            await record.save();

            return { success: true, data: record };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new MedicalRecordService();