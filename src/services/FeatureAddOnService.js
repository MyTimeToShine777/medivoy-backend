// Feature AddOn Service - Additional features/add-ons management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class FeatureAddOnService {
    // ========== CREATE ADD-ON ==========
    async createAddOn(addOnData) {
        try {
            const addOn = await prisma.featureAddOn.create({
                data: {
                    ...addOnData,
                }
            });

            return { success: true, data: addOn };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ADD-ON ==========
    async getAddOnById(addOnId) {
        try {
            const addOn = await prisma.featureAddOn.findUnique({
                where: { addOnId }
            });
            if (!addOn) return { success: false, error: 'Add-on not found' };
            return { success: true, data: addOn };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ALL ADD-ONS ==========
    async getAllAddOns(filters = {}) {
        try {
            const where = { isActive: true };

            const addOns = await prisma.featureAddOn.findMany({
                where,
                orderBy: {
                    cost: 'asc'
                },
                take: filters.limit || 50,
                skip: filters.offset || 0,
            });

            return { success: true, data: addOns };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE ADD-ON ==========
    async updateAddOn(addOnId, updateData) {
        try {
            const addOn = await prisma.featureAddOn.findUnique({
                where: { addOnId }
            });
            if (!addOn) return { success: false, error: 'Not found' };

            const updated = await prisma.featureAddOn.update({
                where: { addOnId },
                data: updateData
            });
            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DEACTIVATE ADD-ON ==========
    async deactivateAddOn(addOnId) {
        try {
            const addOn = await prisma.featureAddOn.findUnique({
                where: { addOnId }
            });
            if (!addOn) return { success: false, error: 'Not found' };

            const updated = await prisma.featureAddOn.update({
                where: { addOnId },
                data: { isActive: false }
            });

            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export { FeatureAddOnService };
export default new FeatureAddOnService();