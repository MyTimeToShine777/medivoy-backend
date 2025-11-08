'use strict';

import { PatientService } from '../services/PatientService.js';

export class PatientController {
    constructor() {
        this.patientService = new PatientService();
    }

    async getPatientProfile(req, res) {
        try {
            const patientId = req.params.patientId;
            const userId = req.user.userId;

            const result = await this.patientService.getPatientProfile(patientId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.patient
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updatePatientProfile(req, res) {
        try {
            const patientId = req.params.patientId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.patientService.updatePatientProfile(patientId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Patient profile updated successfully',
                data: result.patient
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async addPatientMedicalHistory(req, res) {
        try {
            const patientId = req.params.patientId;
            const userId = req.user.userId;
            const historyData = req.body;

            const result = await this.patientService.addPatientMedicalHistory(patientId, userId, historyData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Medical history added successfully',
                data: result.history
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPatientMedicalHistory(req, res) {
        try {
            const patientId = req.params.patientId;
            const userId = req.user.userId;

            const result = await this.patientService.getPatientMedicalHistory(patientId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.history
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async addPatientAllergy(req, res) {
        try {
            const patientId = req.params.patientId;
            const userId = req.user.userId;
            const allergyData = req.body;

            const result = await this.patientService.addPatientAllergy(patientId, userId, allergyData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Allergy added successfully',
                data: result.allergy
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPatientAllergies(req, res) {
        try {
            const patientId = req.params.patientId;
            const userId = req.user.userId;

            const result = await this.patientService.getPatientAllergies(patientId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.allergies
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listPatients(req, res) {
        try {
            const filters = {
                search: req.query.search,
                status: req.query.status,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.patientService.listPatients(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.patients,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPatientStats(req, res) {
        try {
            const patientId = req.params.patientId;

            const result = await this.patientService.getPatientStats(patientId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.stats
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new PatientController();