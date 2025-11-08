// Feature AddOn Service - Additional features/add-ons management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { FeatureAddOn, Package, Treatment } from '../models/index.js';

class FeatureAddOnService {
    // ========== CREATE ADD-ON ==========
    async createAddOn(addOnData) {
        try {
            const addOn = await FeatureAddOn.create({
                ...addOnData,
            });

            return { success: true, data: addOn };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ADD-ON ==========
    async getAddOnById(addOnId) {
        try {
            const addOn = await FeatureAddOn.findByPk(addOnId);
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

            const addOns = await FeatureAddOn.findAll({
                where,
                order: [
                    ['cost', 'ASC']
                ],
                limit: filters.limit || 50,
                offset: filters.offset || 0,
            });

            return { success: true, data: addOns };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE ADD-ON ==========
    async updateAddOn(addOnId, updateData) {
        try {
            const addOn = await FeatureAddOn.findByPk(addOnId);
            if (!addOn) return { success: false, error: 'Not found' };

            const updated = await addOn.update(updateData);
            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DEACTIVATE ADD-ON ==========
    async deactivateAddOn(addOnId) {
        try {
            const addOn = await FeatureAddOn.findByPk(addOnId);
            if (!addOn) return { success: false, error: 'Not found' };

            addOn.isActive = false;
            await addOn.save();

            return { success: true, data: addOn };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new FeatureAddOnService();