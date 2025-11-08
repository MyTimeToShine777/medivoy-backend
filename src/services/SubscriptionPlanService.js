// Subscription Plan Service - Plan management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { SubscriptionPlan } from '../models/index.js';

class SubscriptionPlanService {
    // ========== CREATE PLAN ==========
    async createPlan(planData) {
        try {
            const plan = await SubscriptionPlan.create({
                ...planData,
                isActive: true,
            });

            return { success: true, data: plan };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PLAN ==========
    async getPlanById(planId) {
        try {
            const plan = await SubscriptionPlan.findByPk(planId);
            if (!plan) return { success: false, error: 'Not found' };
            return { success: true, data: plan };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ALL PLANS ==========
    async getAllPlans() {
        try {
            const plans = await SubscriptionPlan.findAll({
                where: { isActive: true },
                order: [
                    ['amount', 'ASC']
                ],
            });

            return { success: true, data: plans };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE PLAN ==========
    async updatePlan(planId, updateData) {
        try {
            const plan = await SubscriptionPlan.findByPk(planId);
            if (!plan) return { success: false, error: 'Not found' };

            const updated = await plan.update(updateData);
            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== DEACTIVATE PLAN ==========
    async deactivatePlan(planId) {
        try {
            const plan = await SubscriptionPlan.findByPk(planId);
            if (!plan) return { success: false, error: 'Not found' };

            plan.isActive = false;
            await plan.save();

            return { success: true, data: plan };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new SubscriptionPlanService();