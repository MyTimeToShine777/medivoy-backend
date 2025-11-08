'use strict';

import LabReportService from '../services/LabReportService.js';

export class LabReportController {
    constructor() {
        this.labReportService = new LabReportService();
    }

    /**
     * CREATE LAB REPORT
     */
    async createLabReport(req, res) {
        try {
            const { patientId } = req.body;
            const reportData = req.body;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID is required'
                });
            }

            const result = await this.labReportService.createLabReport(patientId, reportData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET PATIENT LAB REPORTS
     */
    async getPatientReports(req, res) {
        try {
            const patientId = req.params.patientId || req.user.patientId;
            const { page, limit, status } = req.query;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID is required'
                });
            }

            const result = await this.labReportService.getPatientReports(patientId, { page, limit, status });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET REPORT BY ID
     */
    async getReportById(req, res) {
        try {
            const reportId = req.params.reportId;

            const result = await this.labReportService.getReportById(reportId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE REPORT STATUS
     */
    async updateReportStatus(req, res) {
        try {
            const reportId = req.params.reportId;
            const { status, ...updateData } = req.body;

            const result = await this.labReportService.updateReportStatus(reportId, status, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE REPORT RESULTS
     */
    async updateReportResults(req, res) {
        try {
            const reportId = req.params.reportId;
            const { results, interpretation } = req.body;

            if (!results) {
                return res.status(400).json({
                    success: false,
                    error: 'Results data is required'
                });
            }

            const result = await this.labReportService.updateReportResults(reportId, results, interpretation);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * DELETE LAB REPORT
     */
    async deleteLabReport(req, res) {
        try {
            const reportId = req.params.reportId;

            const result = await this.labReportService.deleteLabReport(reportId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new LabReportController();