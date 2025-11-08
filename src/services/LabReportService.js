'use strict';

import { getModels } from '../models/index.js';
import { Op } from 'sequelize';

export class LabReportService {
    /**
     * CREATE LAB REPORT
     */
    async createLabReport(patientId, reportData) {
        try {
            if (!patientId) {
                return { success: false, error: 'Patient ID is required' };
            }

            if (!reportData.testName) {
                return { success: false, error: 'Test name is required' };
            }

            if (!reportData.testDate) {
                return { success: false, error: 'Test date is required' };
            }

            const { LabReport, Patient } = getModels();

            // Validate patient exists
            const patient = await Patient.findByPk(patientId);
            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            // Generate report number
            const reportNumber = `LAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const report = await LabReport.create({
                patientId,
                reportNumber,
                ...reportData,
                status: reportData.status || 'pending'
            });

            return {
                success: true,
                data: report,
                message: 'Lab report created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET PATIENT LAB REPORTS
     */
    async getPatientReports(patientId, options = {}) {
        try {
            if (!patientId) {
                return { success: false, error: 'Patient ID is required' };
            }

            const { LabReport, LabTest, Laboratory } = getModels();

            const { page = 1, limit = 10, status } = options;
            const offset = (page - 1) * limit;

            const where = { patientId };
            if (status) where.status = status;

            const { rows: reports, count: total } = await LabReport.findAndCountAll({
                where,
                include: [
                    { model: LabTest, as: 'labTest', attributes: ['testId', 'name', 'category'] },
                    { model: Laboratory, as: 'laboratory', attributes: ['labId', 'name', 'location'] }
                ],
                order: [
                    ['testDate', 'DESC']
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                success: true,
                data: reports,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET REPORT BY ID
     */
    async getReportById(reportId) {
        try {
            if (!reportId) {
                return { success: false, error: 'Report ID is required' };
            }

            const { LabReport, Patient, LabTest, Laboratory, Doctor } = getModels();

            const report = await LabReport.findByPk(reportId, {
                include: [
                    { model: Patient, as: 'patient', attributes: ['patientId', 'firstName', 'lastName', 'dateOfBirth'] },
                    { model: LabTest, as: 'labTest', attributes: ['testId', 'name', 'category'] },
                    { model: Laboratory, as: 'laboratory', attributes: ['labId', 'name', 'location'] },
                    { model: Doctor, as: 'doctor', attributes: ['doctorId', 'firstName', 'lastName'] }
                ]
            });

            if (!report) {
                return { success: false, error: 'Lab report not found' };
            }

            return {
                success: true,
                data: report
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE REPORT STATUS
     */
    async updateReportStatus(reportId, status, updateData = {}) {
        try {
            if (!reportId) {
                return { success: false, error: 'Report ID is required' };
            }

            if (!status) {
                return { success: false, error: 'Status is required' };
            }

            const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled', 'failed'];
            if (!validStatuses.includes(status)) {
                return { success: false, error: 'Invalid status' };
            }

            const { LabReport } = getModels();

            const report = await LabReport.findByPk(reportId);

            if (!report) {
                return { success: false, error: 'Lab report not found' };
            }

            await report.update({
                status,
                ...updateData,
                ...(status === 'completed' && { reportDate: new Date() })
            });

            return {
                success: true,
                data: report,
                message: `Report status updated to ${status}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE REPORT RESULTS
     */
    async updateReportResults(reportId, results, interpretation = null) {
        try {
            if (!reportId) {
                return { success: false, error: 'Report ID is required' };
            }

            if (!results) {
                return { success: false, error: 'Results data is required' };
            }

            const { LabReport } = getModels();

            const report = await LabReport.findByPk(reportId);

            if (!report) {
                return { success: false, error: 'Lab report not found' };
            }

            await report.update({
                results,
                interpretation,
                status: 'completed',
                reportDate: new Date()
            });

            return {
                success: true,
                data: report,
                message: 'Report results updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * DELETE LAB REPORT
     */
    async deleteLabReport(reportId) {
        try {
            if (!reportId) {
                return { success: false, error: 'Report ID is required' };
            }

            const { LabReport } = getModels();

            const deleted = await LabReport.destroy({ where: { reportId } });

            if (deleted === 0) {
                return { success: false, error: 'Lab report not found' };
            }

            return {
                success: true,
                message: 'Lab report deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new LabReportService();