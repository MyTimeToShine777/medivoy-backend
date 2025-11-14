// Patient Service - Patient profile and health management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class PatientService {
    // ========== CREATE PATIENT PROFILE ==========
    async createPatientProfile(userId, patientData) {
        try {
            const patient = await prisma.patient.create({
                data: {
                userId,
                ...patientData,
            });

            return { success: true, data: patient };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT PROFILE ==========
    async getPatientProfile(userId) {
        try {
            const patient = await prisma.patient.findFirst({
                where: { userId },
                include: {
                    user: true
                },
            });

            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            return { success: true, data: patient };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE PATIENT HEALTH INFO ==========
    async updateHealthInfo(userId, healthData) {
        try {
            const patient = await prisma.patient.findFirst({ where: { userId } });
            if (!patient) return { success: false, error: 'Not found' };

            if (healthData.allergies) patient.allergies = healthData.allergies;
            if (healthData.chronicConditions) patient.chronicConditions = healthData.chronicConditions;
            if (healthData.medications) patient.currentMedications = healthData.medications;
            if (healthData.height) {
                patient.height = healthData.height;
                patient.bmi = this.calculateBMI(healthData.height, patient.weight);
            }
            if (healthData.weight) {
                patient.weight = healthData.weight;
                patient.bmi = this.calculateBMI(patient.height, healthData.weight);
            }

            await prisma.patient.update({ where: { userId }, data: { allergies: patient.allergies, chronicConditions: patient.chronicConditions, currentMedications: patient.currentMedications, height: patient.height, weight: patient.weight, bmi: patient.bmi } });
            return { success: true, data: patient };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT MEDICAL HISTORY ==========
    async getPatientMedicalHistory(userId) {
        try {
            const records = await prisma.medicalRecord.findMany({
                where: { userId },
                orderBy: { recordDate: 'desc' },
            });

            return { success: true, data: records };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT CONSULTATIONS ==========
    async getPatientConsultations(userId) {
        try {
            const consultations = await prisma.consultation.findMany({
                where: { userId },
                include: {
                    doctor: true
                },
                orderBy: { consultationDate: 'desc' },
            });

            return { success: true, data: consultations };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    calculateBMI(height, weight) {
        if (!height || !weight) return null;
        const heightInM = height / 100;
        return (weight / (heightInM * heightInM)).toFixed(2);
    }
}

export default new PatientService();