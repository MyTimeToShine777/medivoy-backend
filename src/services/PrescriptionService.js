// Prescription Service - Prescription management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';


class PrescriptionService {
    // ========== CREATE PRESCRIPTION ==========
    async createPrescription(prescriptionData) {
        try {
            const prescription = await prisma.prescription.create({
                data: {
                prescriptionNumber: await this.generatePrescriptionNumber(),
                status: 'draft',
                ...prescriptionData,
                }
            });

            return {
                success: true,
                data: prescription,
                message: 'Prescription created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET PRESCRIPTION ==========
    async getPrescriptionById(prescriptionId) {
        try {
            const prescription = await prisma.prescription.findUnique({
                where: { prescriptionId }, {
                include: [
                    { model: User, as: 'patient' },
                    { model: Doctor, as: 'doctor' },
                    { model: Appointment, as: 'appointment' },
                ],
            });

            if (!prescription) {
                return {
                    success: false,
                    error: 'Prescription not found',
                };
            }

            return {
                success: true,
                data: prescription,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getPrescriptionByNumber(prescriptionNumber) {
        try {
            const prescription = await prisma.prescription.findFirst({
                where: { prescriptionNumber },
                include: [
                    { model: Doctor, as: 'doctor' },
                ],
            });

            if (!prescription) {
                return {
                    success: false,
                    error: 'Prescription not found',
                };
            }

            return {
                success: true,
                data: prescription,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET PATIENT PRESCRIPTIONS ==========
    async getPatientPrescriptions(userId, filters = {}) {
        try {
            const where = { userId };

            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.isValid !== undefined) {
                where.isValid = filters.isValid;
            }

            const prescriptions = await Prescription.findAll({
                where,
                include: [
                    { model: Doctor, as: 'doctor' },
                    { model: Appointment, as: 'appointment' },
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            const total = await Prescription.count({ where });

            return {
                success: true,
                data: prescriptions,
                total,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== UPDATE PRESCRIPTION ==========
    async updatePrescription(prescriptionId, updateData) {
        try {
            const prescription = await Prescription.findByPk(prescriptionId);
            if (!prescription) {
                return {
                    success: false,
                    error: 'Prescription not found',
                };
            }

            const updated = await prescription.update(updateData);
            return {
                success: true,
                data: updated,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== ISSUE PRESCRIPTION ==========
    async issuePrescription(prescriptionId) {
        try {
            const prescription = await Prescription.findByPk(prescriptionId);
            if (!prescription) {
                return {
                    success: false,
                    error: 'Prescription not found',
                };
            }

            prescription.status = 'issued';
            prescription.issuedDate = new Date();
            await prescription.save();

            return {
                success: true,
                data: prescription,
                message: 'Prescription issued',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== DISPENSE PRESCRIPTION ==========
    async dispensePrescription(prescriptionId, dispensedAt, pharmacy, dispensedBy) {
        try {
            const prescription = await Prescription.findByPk(prescriptionId);
            if (!prescription) {
                return {
                    success: false,
                    error: 'Prescription not found',
                };
            }

            prescription.status = 'dispensed';
            prescription.dispensedAt = dispensedAt;
            prescription.pharmacy = pharmacy;
            prescription.dispensedBy = dispensedBy;
            prescription.dispensingStatus = 'dispensed';

            await prescription.save();

            return {
                success: true,
                data: prescription,
                message: 'Prescription dispensed',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== REFILL PRESCRIPTION ==========
    async refillPrescription(prescriptionId) {
        try {
            const prescription = await Prescription.findByPk(prescriptionId);
            if (!prescription) {
                return {
                    success: false,
                    error: 'Prescription not found',
                };
            }

            if (!prescription.canRefill()) {
                return {
                    success: false,
                    error: 'Prescription cannot be refilled',
                };
            }

            prescription.refillsUsed += 1;
            await prescription.save();

            return {
                success: true,
                data: prescription,
                message: 'Prescription refilled',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== VALIDATE PRESCRIPTION ==========
    async validatePrescription(prescriptionId) {
        try {
            const prescription = await Prescription.findByPk(prescriptionId);
            if (!prescription) {
                return {
                    success: false,
                    error: 'Prescription not found',
                };
            }

            const isExpired = prescription.isExpired();
            const isValid = prescription.isValid();

            return {
                success: true,
                data: {
                    isValid,
                    isExpired,
                    canRefill: prescription.canRefill(),
                    remainingRefills: prescription.getRemainingRefills(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== PRESCRIPTION STATISTICS ==========
    async getDoctorPrescriptionStats(doctorId, period = 'month') {
        try {
            const startDate = this.getDateRange(period).start;
            const endDate = this.getDateRange(period).end;

            const where = {
                doctorId,
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            };

            const totalPrescriptions = await Prescription.count({ where });
            const issuedPrescriptions = await Prescription.count({
                where: {...where, status: 'issued' },
            });
            const dispensedPrescriptions = await Prescription.count({
                where: {...where, status: 'dispensed' },
            });

            return {
                success: true,
                data: {
                    totalPrescriptions,
                    issuedPrescriptions,
                    dispensedPrescriptions,
                    period,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== HELPER METHODS ==========
    async generatePrescriptionNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `RX-${timestamp}-${random}`;
    }

    getDateRange(period) {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        if (period === 'week') {
            start.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            start.setMonth(now.getMonth() - 1);
        } else if (period === 'year') {
            start.setFullYear(now.getFullYear() - 1);
        }

        return { start, end };
    }
}

export default new PrescriptionService();