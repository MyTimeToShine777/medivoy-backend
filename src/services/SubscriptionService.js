// Subscription Service - Subscription management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class SubscriptionService {
    // ========== CREATE SUBSCRIPTION ==========
    async createSubscription(subscriptionData) {
        try {
            const subscription = await prisma.subscription.create({
                data: {
                subscriptionNumber: await this.generateSubscriptionNumber(),
                status: 'trial',
                ...subscriptionData,
            });

            return { success: true, data: subscription };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET SUBSCRIPTION ==========
    async getSubscriptionById(subscriptionId) {
        try {
            const subscription = await prisma.subscription.findUnique({
                where: { subscriptionId }, {
                include: [
                    { model: User, as: 'user' },
                    { model: SubscriptionPlan, as: 'plan' },
                ],
            });

            if (!subscription) return { success: false, error: 'Not found' };
            return { success: true, data: subscription };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET USER SUBSCRIPTION ==========
    async getUserSubscription(userId) {
        try {
            const subscription = await prisma.subscription.findFirst({
                where: {
                    userId,
                    status: {
                        not: 'cancelled'
                    }
                },
                include: [
                    { model: SubscriptionPlan, as: 'plan' },
                ],
            });

            if (!subscription) {
                return { success: false, error: 'No active subscription' };
            }

            return { success: true, data: subscription };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPGRADE SUBSCRIPTION ==========
    async upgradeSubscription(subscriptionId, newPlanId) {
        try {
            const subscription = await prisma.subscription.findUnique({ where: { subscriptionId } });
            if (!subscription) return { success: false, error: 'Not found' };

            const newPlan = await prisma.subscriptionPlan.findUnique({ where: { planId: newPlanId } });
            if (!newPlan) return { success: false, error: 'Plan not found' };

            subscription.upgradedFrom = subscription.planId;
            subscription.planId = newPlanId;
            subscription.status = 'active';
            subscription.amount = newPlan.amount;

            await prisma.subscription.update({ where: { subscriptionId }, data: { upgradedFrom: subscription.upgradedFrom, planId: subscription.planId, status: subscription.status, amount: subscription.amount } });

            return { success: true, data: subscription };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CANCEL SUBSCRIPTION ==========
    async cancelSubscription(subscriptionId, reason = null) {
        try {
            const subscription = await prisma.subscription.findUnique({ where: { subscriptionId } });
            if (!subscription) return { success: false, error: 'Not found' };

            subscription.status = 'cancelled';
            subscription.cancelledAt = new Date();
            if (reason) subscription.cancellationReason = reason;

            await prisma.subscription.update({ where: { subscriptionId }, data: { upgradedFrom: subscription.upgradedFrom, planId: subscription.planId, status: subscription.status, amount: subscription.amount } });

            return { success: true, data: subscription };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== RENEW SUBSCRIPTION ==========
    async renewSubscription(subscriptionId) {
        try {
            const subscription = await prisma.subscription.findUnique({ where: { subscriptionId } });
            if (!subscription) return { success: false, error: 'Not found' };

            subscription.status = 'active';
            subscription.currentPeriodStart = new Date();

            const endDate = new Date();
            if (subscription.billingCycle === 'monthly') {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (subscription.billingCycle === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            subscription.currentPeriodEnd = endDate;
            await prisma.subscription.update({ where: { subscriptionId }, data: { upgradedFrom: subscription.upgradedFrom, planId: subscription.planId, status: subscription.status, amount: subscription.amount } });

            return { success: true, data: subscription };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateSubscriptionNumber() {
        return `SUB-${Date.now()}-${Math.random() * 10000 | 0}`;
    }
}

export default new SubscriptionService();