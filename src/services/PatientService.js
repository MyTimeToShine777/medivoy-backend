// Patient Service - Patient profile and health management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { Patient, User, Consultation, MedicalRecord } from '../models/index.js';

class PatientService {
    // ========== CREATE PATIENT PROFILE ==========
    async createPatientProfile(userId, patientData) {
        try {
            const patient = await Patient.create({
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
            const patient = await Patient.findOne({
                where: { userId },
                include: [
                    { model: User, as: 'user' },
                ],
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
            const patient = await Patient.findOne({ where: { userId } });
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

            await patient.save();
            return { success: true, data: patient };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT MEDICAL HISTORY ==========
    async getPatientMedicalHistory(userId) {
        try {
            const records = await MedicalRecord.findAll({
                where: { userId },
                order: [
                    ['recordDate', 'DESC']
                ],
            });

            return { success: true, data: records };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PATIENT CONSULTATIONS ==========
    async getPatientConsultations(userId) {
        try {
            const consultations = await Consultation.findAll({
                where: { userId },
                include: [
                    { model: Doctor, as: 'doctor' },
                ],
                order: [
                    ['consultationDate', 'DESC']
                ],
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