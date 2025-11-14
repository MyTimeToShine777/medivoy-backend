// Insurance Service - Insurance and coverage management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class InsuranceService {
    // ========== CREATE INSURANCE PLAN ==========
    async createInsurancePlan(insuranceData) {
        try {
            const insurance = await prisma.insurance.create({
                data: {
                    ...insuranceData,
                    status: 'active'
                }
            });

            return {
                success: true,
                data: insurance,
                message: 'Insurance plan created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET INSURANCE ==========
    async getInsuranceById(insuranceId) {
        try {
            const insurance = await prisma.insurance.findUnique({
                where: { insuranceId },
                include: {
                    users: true
                }
            });

            if (!insurance) {
                return {
                    success: false,
                    error: 'Insurance plan not found',
                };
            }

            return {
                success: true,
                data: insurance,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET USER INSURANCE ==========
    async getUserInsurance(userId) {
        try {
            const insurance = await prisma.insurance.findFirst({
                where: { userId, status: 'active' },
            });

            if (!insurance) {
                return {
                    success: false,
                    error: 'No active insurance found',
                };
            }

            return {
                success: true,
                data: insurance,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== VALIDATE COVERAGE ==========
    async validateCoverage(userId, treatmentCost) {
        try {
            const insurance = await prisma.insurance.findFirst({
                where: { userId, status: 'active' },
            });

            if (!insurance) {
                return {
                    success: false,
                    covered: false,
                    error: 'No active insurance plan',
                };
            }

            if (insurance.isExpired()) {
                return {
                    success: false,
                    covered: false,
                    error: 'Insurance plan has expired',
                };
            }

            const coveragePercentage = insurance.coveragePercentage || 100;
            const coveredAmount = (treatmentCost * coveragePercentage) / 100;

            if (coveredAmount > insurance.balanceAmount) {
                return {
                    success: true,
                    covered: true,
                    partialCoverage: true,
                    coveredAmount: insurance.balanceAmount,
                    remainingCost: treatmentCost - insurance.balanceAmount,
                };
            }

            return {
                success: true,
                covered: true,
                partialCoverage: false,
                coveredAmount,
                remainingCost: 0,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== CLAIM PROCESSING ==========
    async createClaim(claimData) {
        try {
            const insurance = await prisma.insurance.findUnique({ where: { insuranceId: claimData.insuranceId } });
            if (!insurance) {
                return {
                    success: false,
                    error: 'Insurance plan not found',
                };
            }

            // Update insurance with claim details
            insurance.totalClaims = (insurance.totalClaims || 0) + 1;
            insurance.totalClaimsAmount = (insurance.totalClaimsAmount || 0) + claimData.claimAmount;

            await insurance.save();

            return {
                success: true,
                data: {
                    insuranceId: insurance.insuranceId,
                    claimAmount: claimData.claimAmount,
                    claimStatus: 'submitted',
                },
                message: 'Claim submitted successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async approveClaim(insuranceId, approvalAmount) {
        try {
            const insurance = await prisma.insurance.findUnique({ where: { insuranceId: insuranceId } });
            if (!insurance) {
                return {
                    success: false,
                    error: 'Insurance plan not found',
                };
            }

            insurance.balanceAmount -= approvalAmount;
            insurance.approvedClaims = (insurance.approvedClaims || 0) + 1;

            await insurance.save();

            return {
                success: true,
                data: {
                    approvedAmount: approvalAmount,
                    remainingBalance: insurance.balanceAmount,
                },
                message: 'Claim approved',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async rejectClaim(insuranceId, rejectionReason) {
        try {
            const insurance = await prisma.insurance.findUnique({ where: { insuranceId: insuranceId } });
            if (!insurance) {
                return {
                    success: false,
                    error: 'Insurance plan not found',
                };
            }

            insurance.rejectedClaims = (insurance.rejectedClaims || 0) + 1;

            await insurance.save();

            return {
                success: true,
                message: 'Claim rejected',
                reason: rejectionReason,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== INSURANCE COVERAGE CHECK ==========
    async getTreatmentCoverage(insuranceId, treatmentType) {
        try {
            const insurance = await prisma.insurance.findUnique({ where: { insuranceId: insuranceId } });
            if (!insurance) {
                return {
                    success: false,
                    error: 'Insurance plan not found',
                };
            }

            // Check if treatment is covered
            if (insurance.coveredTreatments && insurance.coveredTreatments.includes(treatmentType)) {
                return {
                    success: true,
                    covered: true,
                    coveragePercentage: insurance.coveragePercentage,
                };
            }

            return {
                success: true,
                covered: false,
                message: 'Treatment not covered',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== INSURANCE STATISTICS ==========
    async getInsuranceStats(userId) {
        try {
            const insurance = await prisma.insurance.findFirst({
                where: { userId, status: 'active' },
            });

            if (!insurance) {
                return {
                    success: false,
                    error: 'No insurance found',
                };
            }

            return {
                success: true,
                data: {
                    planName: insurance.planName,
                    totalAmount: insurance.totalAmount,
                    usedAmount: insurance.totalAmount - insurance.balanceAmount,
                    balanceAmount: insurance.balanceAmount,
                    coveragePercentage: insurance.coveragePercentage,
                    totalClaims: insurance.totalClaims || 0,
                    approvedClaims: insurance.approvedClaims || 0,
                    rejectedClaims: insurance.rejectedClaims || 0,
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

export { InsuranceService };
export default new InsuranceService();