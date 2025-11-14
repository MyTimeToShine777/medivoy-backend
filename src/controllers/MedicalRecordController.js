'use strict';

import medicalRecordService from '../services/MedicalRecordService.js';

export class MedicalRecordController {
    constructor() {
        this.medicalRecordService = medicalRecordService;
    }

    async createMedicalRecord(req, res) {
        try {
            const userId = req.user.userId;
            const recordData = req.body;

            const result = await this.medicalRecordService.createMedicalRecord(userId, recordData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Medical record created successfully',
                data: result.record
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getMedicalRecordById(req, res) {
        try {
            const recordId = req.params.recordId;
            const userId = req.user.userId;

            const result = await this.medicalRecordService.getMedicalRecordById(recordId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.record
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserMedicalRecords(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                recordType: req.query.recordType,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.medicalRecordService.getUserMedicalRecords(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.records,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateMedicalRecord(req, res) {
        try {
            const recordId = req.params.recordId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.medicalRecordService.updateMedicalRecord(recordId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Medical record updated successfully',
                data: result.record
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteMedicalRecord(req, res) {
        try {
            const recordId = req.params.recordId;
            const userId = req.user.userId;

            const result = await this.medicalRecordService.deleteMedicalRecord(recordId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Medical record deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async shareMedicalRecord(req, res) {
        try {
            const recordId = req.params.recordId;
            const userId = req.user.userId;
            const sharedWithId = req.body.sharedWithId;

            const result = await this.medicalRecordService.shareMedicalRecord(recordId, userId, sharedWithId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Medical record shared successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new MedicalRecordController();