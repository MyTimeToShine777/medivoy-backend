'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSULTATION SERVICE - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class ConsultationService {
    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async createConsultation(patientId, doctorId, consultationType, symptoms, notes) {
        try {
            if (!patientId || !doctorId || !consultationType) {
                return { success: false, error: 'Patient ID, doctor ID and consultation type required' };
            }

            const consultation = await prisma.consultation.create({
                data: {
                patientId: patientId,
                doctorId: doctorId,
                consultationType: consultationType,
                symptoms: symptoms || '',
                notes: notes || '',
                status: 'pending',
                createdAt: new Date()
            });

            await cacheService.delete(`consultations_${patientId}`);
            console.log(`✅ Consultation created: ${consultation.consultationId}`);

            return { success: true, data: consultation };
        } catch (error) {
            console.error('❌ Create consultation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET PATIENT CONSULTATIONS
    // ─────────────────────────────────────────────────────────────────────────────

    async getPatientConsultations(patientId) {
        try {
            if (!patientId) {
                return { success: false, error: 'Patient ID required' };
            }

            const cacheKey = `consultations_${patientId}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: cached };

            const consultations = await prisma.consultation.findMany({
                where: { patientId: patientId },
                include: {
                    doctor: {
                        select: { firstName: true, lastName: true, specialization: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            await cacheService.set(cacheKey, consultations, 86400);
            console.log(`✅ Consultations retrieved: ${patientId}`);

            return { success: true, data: consultations };
        } catch (error) {
            console.error('❌ Get consultations error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async updateConsultation(consultationId, diagnosis, treatment, status) {
        try {
            if (!consultationId) {
                return { success: false, error: 'Consultation ID required' };
            }

            const consultation = await prisma.consultation.findUnique({ where: { consultationId } });

            if (!consultation) {
                return { success: false, error: 'Consultation not found', code: 'NOT_FOUND' };
            }

            const updated = await prisma.consultation.update({ where: { consultationId }, data: {
                diagnosis: diagnosis !== undefined ? diagnosis : consultation.diagnosis,
                treatment: treatment !== undefined ? treatment : consultation.treatment,
                status: status !== undefined ? status : consultation.status,
                updatedAt: new Date()
            });

            await cacheService.delete(`consultations_${consultation.patientId}`);
            console.log(`✅ Consultation updated: ${consultationId}`);

            return { success: true, data: consultation };
        } catch (error) {
            console.error('❌ Update consultation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET CONSULTATION BY ID
    // ─────────────────────────────────────────────────────────────────────────────

    async getConsultationById(consultationId) {
        try {
            if (!consultationId) {
                return { success: false, error: 'Consultation ID required' };
            }

            const consultation = await prisma.consultation.findUnique({
                where: { consultationId: consultationId },
                include: {
                    doctor: {
                        select: { firstName: true, lastName: true, specialization: true }
                    },
                    patient: {
                        select: { firstName: true, lastName: true, email: true }
                    }
                }
            });

            if (!consultation) {
                return { success: false, error: 'Consultation not found', code: 'NOT_FOUND' };
            }

            return { success: true, data: consultation };
        } catch (error) {
            console.error('❌ Get consultation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async deleteConsultation(consultationId) {
        try {
            if (!consultationId) {
                return { success: false, error: 'Consultation ID required' };
            }

            const consultation = await prisma.consultation.findUnique({ where: { consultationId } });

            if (!consultation) {
                return { success: false, error: 'Consultation not found', code: 'NOT_FOUND' };
            }

            await prisma.consultation.delete({
                where: { consultationId: consultation.consultationId }
            });
            await cacheService.delete(`consultations_${consultation.patientId}`);
            console.log(`✅ Consultation deleted: ${consultationId}`);

            return { success: true, message: 'Consultation deleted successfully' };
        } catch (error) {
            console.error('❌ Delete consultation error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const consultationService = new ConsultationService();
export default consultationService;