'use strict';

import prescriptionService from '../services/PrescriptionService.js';

export class PrescriptionController {
    constructor() {
        this.prescriptionService = prescriptionService;
    }

    async createPrescription(req, res) {
        try {
            const appointmentId = req.params.appointmentId;
            const prescriptionData = req.body;
            prescriptionData.doctorId = req.user.userId;

            const result = await this.prescriptionService.createPrescription(appointmentId, prescriptionData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Prescription created successfully',
                data: result.prescription
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPrescriptionById(req, res) {
        try {
            const prescriptionId = req.params.prescriptionId;
            const userId = req.user.userId;

            const result = await this.prescriptionService.getPrescriptionById(prescriptionId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.prescription
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserPrescriptions(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                status: req.query.status,
                doctorId: req.query.doctorId,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.prescriptionService.getUserPrescriptions(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.prescriptions,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getDoctorPrescriptions(req, res) {
        try {
            const doctorId = req.user.userId;
            const filters = {
                patientId: req.query.patientId,
                status: req.query.status,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.prescriptionService.getDoctorPrescriptions(doctorId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.prescriptions,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updatePrescription(req, res) {
        try {
            const prescriptionId = req.params.prescriptionId;
            const doctorId = req.user.userId;
            const updateData = req.body;

            const result = await this.prescriptionService.updatePrescription(prescriptionId, updateData, doctorId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Prescription updated successfully',
                data: result.prescription
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async revokePrescription(req, res) {
        try {
            const prescriptionId = req.params.prescriptionId;
            const doctorId = req.user.userId;
            const reason = req.body.reason;

            const result = await this.prescriptionService.revokePrescription(prescriptionId, doctorId, reason);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Prescription revoked successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async downloadPrescription(req, res) {
        try {
            const prescriptionId = req.params.prescriptionId;
            const userId = req.user.userId;

            const result = await this.prescriptionService.downloadPrescription(prescriptionId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                downloadUrl: result.downloadUrl
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new PrescriptionController();