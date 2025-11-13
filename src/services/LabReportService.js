'use strict';

import prisma from '../config/prisma.js';

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

            // Validate patient exists
            const patient = await prisma.patient.findUnique({
                where: { patientId }
            });
            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            // Generate report number
            const reportNumber = `LAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const report = await prisma.labReport.create({
                data: {
                    patientId,
                    reportNumber,
                    ...reportData,
                    status: reportData.status || 'pending'
                }
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

            const { page = 1, limit = 10, status } = options;
            const skip = (page - 1) * limit;

            const where = { patientId };
            if (status) where.status = status;

            const [reports, total] = await Promise.all([
                prisma.labReport.findMany({
                    where,
                    include: {
                        labTest: {
                            select: { testId: true, name: true, category: true }
                        },
                        laboratory: {
                            select: { labId: true, name: true, location: true }
                        }
                    },
                    orderBy: {
                        testDate: 'desc'
                    },
                    take: parseInt(limit),
                    skip: parseInt(skip)
                }),
                prisma.labReport.count({ where })
            ]);

            // Continue with offset equivalent
            const offset = skip;
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

            const report = await prisma.labReport.findUnique({
                where: { reportId },
                include: {
                    patient: {
                        select: { patientId: true, firstName: true, lastName: true, dateOfBirth: true }
                    },
                    labTest: {
                        select: { testId: true, name: true, category: true }
                    },
                    laboratory: {
                        select: { labId: true, name: true, location: true }
                    },
                    doctor: {
                        select: { doctorId: true, firstName: true, lastName: true }
                    }
                }
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

            const report = await prisma.labReport.findUnique({
                where: { reportId }
            });

            if (!report) {
                return { success: false, error: 'Lab report not found' };
            }

            const updated = await prisma.labReport.update({
                where: { reportId },
                data: {
                    status,
                    ...updateData,
                    ...(status === 'completed' && { reportDate: new Date() })
                }
            });

            return {
                success: true,
                data: updated,
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

            const report = await prisma.labReport.findUnique({
                where: { reportId }
            });

            if (!report) {
                return { success: false, error: 'Lab report not found' };
            }

            const updated = await prisma.labReport.update({
                where: { reportId },
                data: {
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

            const deleted = await prisma.labReport.delete({
                where: { reportId }
            }).catch(() => null);

            if (!deleted) {
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