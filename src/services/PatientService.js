// Patient Service - Patient profile and health management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class PatientService {
    // ========== CREATE PATIENT PROFILE ==========
    async createPatientProfile(userId, patientData) {
        try {
            const patient = await prisma.patients.create({
                data: {
                    userId,
                    ...patientData
                }
            });

            return { success: true, data: patient };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT PROFILE ==========
    async getPatientProfile(userId) {
        try {
            const patient = await prisma.patients.findFirst({
                where: { userId },
                include: {
                    users: true,
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
            const patient = await prisma.patients.findFirst({ where: { userId } });
            if (!patient) return { success: false, error: 'Not found' };

            const updateData = {};
            if (healthData.allergies) updateData.allergies = healthData.allergies;
            if (healthData.chronicConditions) updateData.chronicConditions = healthData.chronicConditions;
            if (healthData.medications) updateData.currentMedications = healthData.medications;

            let height = patient.height;
            let weight = patient.weight;

            if (healthData.height) {
                height = healthData.height;
                updateData.height = height;
            }
            if (healthData.weight) {
                weight = healthData.weight;
                updateData.weight = weight;
            }

            if (healthData.height || healthData.weight) {
                updateData.bmi = this.calculateBMI(height, weight);
            }

            const updatedPatient = await prisma.patients.update({
                where: { userId },
                data: updateData
            });
            return { success: true, data: updatedPatient };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT MEDICAL HISTORY ==========
    async getPatientMedicalHistory(userId) {
        try {
            const records = await prisma.medicalRecord.findMany({
                where: { userId },
                orderBy: {
                    recordDate: 'desc',
                },
            });

            return { success: true, data: records };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT CONSULTATIONS ==========
    async getPatientConsultations(userId) {
        try {
            const consultations = await prisma.consultations.findMany({
                where: { userId },
                include: {
                    doctor: true,
                },
                orderBy: {
                    consultationDate: 'desc',
                },
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

export { PatientService };
export default new PatientService();