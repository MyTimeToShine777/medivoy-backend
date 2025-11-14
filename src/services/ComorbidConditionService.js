'use strict';

import prisma from '../config/prisma.js';

class ComorbidConditionService {
    // ADD CONDITION
    async addCondition(conditionData) {
        try {
            const condition = await prisma.comorbidCondition.create({
                data: conditionData
            });

            return {
                success: true,
                message: 'Condition added successfully',
                data: condition
            };
        } catch (error) {
            console.error('Error adding condition:', error);
            return {
                success: false,
                error: error.message || 'Failed to add condition'
            };
        }
    }

    // GET PATIENT CONDITIONS
    async getPatientConditions(patientId) {
        try {
            const conditions = await prisma.comorbidCondition.findMany({
                where: { patientId }
            });

            return {
                success: true,
                data: conditions
            };
        } catch (error) {
            console.error('Error getting patient conditions:', error);
            return {
                success: false,
                error: error.message || 'Failed to get patient conditions'
            };
        }
    }

    // GET CONDITION BY ID
    async getConditionById(conditionId) {
        try {
            const condition = await prisma.comorbidCondition.findUnique({
                where: { id: conditionId }
            });

            if (!condition) {
                return {
                    success: false,
                    error: 'Condition not found'
                };
            }

            return {
                success: true,
                data: condition
            };
        } catch (error) {
            console.error('Error getting condition:', error);
            return {
                success: false,
                error: error.message || 'Failed to get condition'
            };
        }
    }

    // UPDATE CONDITION
    async updateCondition(conditionId, updateData) {
        try {
            const condition = await prisma.comorbidCondition.update({
                where: { id: conditionId },
                data: updateData
            });

            return {
                success: true,
                message: 'Condition updated successfully',
                data: condition
            };
        } catch (error) {
            console.error('Error updating condition:', error);
            return {
                success: false,
                error: error.message || 'Failed to update condition'
            };
        }
    }

    // UPDATE CONDITION STATUS
    async updateConditionStatus(conditionId, status) {
        try {
            const condition = await prisma.comorbidCondition.update({
                where: { id: conditionId },
                data: { status }
            });

            return {
                success: true,
                message: 'Condition status updated successfully',
                data: condition
            };
        } catch (error) {
            console.error('Error updating condition status:', error);
            return {
                success: false,
                error: error.message || 'Failed to update condition status'
            };
        }
    }

    // DELETE CONDITION
    async deleteCondition(conditionId) {
        try {
            await prisma.comorbidCondition.delete({
                where: { id: conditionId }
            });

            return {
                success: true,
                message: 'Condition deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting condition:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete condition'
            };
        }
    }

    // GET ACTIVE CONDITIONS COUNT
    async getActiveConditionsCount(patientId) {
        try {
            const count = await prisma.comorbidCondition.count({
                where: {
                    patientId,
                    status: 'active'
                }
            });

            return {
                success: true,
                data: { count }
            };
        } catch (error) {
            console.error('Error getting active conditions count:', error);
            return {
                success: false,
                error: error.message || 'Failed to get active conditions count'
            };
        }
    }

    // GET ALL CONDITIONS
    async getAllConditions({ page = 1, limit = 10 }) {
        try {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const take = parseInt(limit);

            const [conditions, total] = await Promise.all([
                prisma.comorbidCondition.findMany({
                    skip,
                    take
                }),
                prisma.comorbidCondition.count()
            ]);

            return {
                success: true,
                data: conditions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / take)
                }
            };
        } catch (error) {
            console.error('Error getting all conditions:', error);
            return {
                success: false,
                error: error.message || 'Failed to get all conditions'
            };
        }
    }

    // GET CONDITION STATISTICS
    async getConditionStatistics() {
        try {
            const [total, active, inactive] = await Promise.all([
                prisma.comorbidCondition.count(),
                prisma.comorbidCondition.count({ where: { status: 'active' } }),
                prisma.comorbidCondition.count({ where: { status: 'inactive' } })
            ]);

            return {
                success: true,
                data: {
                    total,
                    active,
                    inactive
                }
            };
        } catch (error) {
            console.error('Error getting condition statistics:', error);
            return {
                success: false,
                error: error.message || 'Failed to get condition statistics'
            };
        }
    }
}

export { ComorbidConditionService };
export default new ComorbidConditionService();