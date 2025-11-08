// Subscription Model - Active subscriptions for users
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Subscription = sequelize.define('Subscription', {
        subscriptionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique subscription identifier',
        },

        // ========== RELATIONSHIPS ==========
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
        },
        planId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'subscription_plans',
                key: 'planId',
            },
        },

        // ========== SUBSCRIPTION DETAILS ==========
        subscriptionNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                'trial',
                'active',
                'past_due',
                'cancelled',
                'suspended',
                'expired',
                'pending_upgrade',
                'on_hold'
            ),
            defaultValue: 'trial',
            index: true,
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== DATES ==========
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        trialEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        currentPeriodStart: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        currentPeriodEnd: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        renewalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== BILLING ==========
        billingCycle: {
            type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        billingEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true },
        },

        // ========== PAYMENT METHOD ==========
        paymentMethodId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        paymentMethodType: {
            type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_account', 'wallet'),
            allowNull: true,
        },
        lastPaymentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        nextPaymentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== FEATURES & USAGE ==========
        featuresUsed: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        usageStats: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        bookingsUsedThisMonth: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        bookingsLimitThisMonth: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== AUTO RENEWAL ==========
        autoRenew: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        autoRenewAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lastRenewalAttemptAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== DISCOUNTS & OFFERS ==========
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        discountPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        couponCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        appliedPromotion: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== CANCELLATION ==========
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cancellationFeedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        willRenew: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

        // ========== UPGRADE/DOWNGRADE ==========
        upgradedFrom: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Previous subscription if upgraded',
        },
        downgradedFrom: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        transitionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== SUPPORT ==========
        supportTier: {
            type: DataTypes.ENUM('basic', 'priority', 'dedicated'),
            defaultValue: 'basic',
        },
        dedicatedManager: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },

        // ========== METADATA ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

    }, {
        timestamps: true,
        tableName: 'subscriptions',
        indexes: [
            { fields: ['userId'] },
            { fields: ['planId'] },
            { fields: ['status'] },
            { unique: true, fields: ['subscriptionNumber'] },
        ],
    });

    Subscription.prototype.isActive = function() {
        return this.status === 'active' && (!this.expiresAt || new Date(this.expiresAt) > new Date());
    };

    Subscription.prototype.isOnTrial = function() {
        return this.status === 'trial' && (!this.trialEndDate || new Date(this.trialEndDate) > new Date());
    };

    Subscription.prototype.canCancel = function() {
        return ['active', 'trial', 'past_due'].includes(this.status);
    };

    Subscription.prototype.getDaysUntilRenewal = function() {
        if (!this.renewalDate) return null;
        const today = new Date();
        const renewal = new Date(this.renewalDate);
        const diffTime = renewal - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    Subscription.associate = (models) => {
        Subscription.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Subscription.belongsTo(models.SubscriptionPlan, { foreignKey: 'planId', as: 'plan' });
        Subscription.belongsTo(models.User, { foreignKey: 'dedicatedManager', as: 'manager' });
    };

    return Subscription;
};