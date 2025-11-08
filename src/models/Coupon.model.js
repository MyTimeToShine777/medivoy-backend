// Coupon Model - Discount codes, promotions, and coupons
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Coupon = sequelize.define('Coupon', {
        couponId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique coupon identifier',
        },

        // ========== COUPON BASICS ==========
        code: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Coupon code must be unique',
            },
            allowNull: false,
            uppercase: true,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'Code must be between 3 and 50 characters',
                },
                isAlphanumeric: {
                    msg: 'Code must contain only letters and numbers',
                },
            },
            comment: 'Unique coupon code',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [5, 100],
                    msg: 'Title must be between 5 and 100 characters',
                },
            },
            comment: 'Coupon display name',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [10, 500],
                    msg: 'Description must be between 10 and 500 characters',
                },
            },
            comment: 'Coupon description for customers',
        },

        // ========== DISCOUNT DETAILS ==========
        discountType: {
            type: DataTypes.ENUM('percentage', 'flat_amount', 'free_addon', 'buy_one_get_one', 'tier_based'),
            allowNull: false,
            comment: 'Type of discount',
        },
        discountValue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
            comment: 'Discount amount or percentage',
        },
        maxDiscount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Maximum discount cap',
        },
        minDiscount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Minimum discount amount',
        },
        tierDiscount: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Tier-based discount structure',
        },

        // ========== APPLICABILITY REQUIREMENTS ==========
        minPurchaseAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            comment: 'Minimum cart value to apply',
        },
        maxPurchaseAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Maximum cart value for coupon',
        },
        minItems: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Minimum items required',
        },
        maxItems: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== APPLICABILITY SCOPE ==========
        applicableTo: {
            type: DataTypes.ENUM(
                'all',
                'specific_treatment',
                'specific_hospital',
                'specific_package',
                'specific_addon',
                'specific_user',
                'user_segment',
                'first_time_buyers',
                'returning_customers',
                'combo'
            ),
            defaultValue: 'all',
            comment: 'Who/what coupon applies to',
        },
        applicableTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Specific treatments if applicable',
        },
        applicableHospitals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        applicablePackages: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        applicableAddOns: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        applicableUsers: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Specific user IDs',
        },
        excludedUsers: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        excludedTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== USAGE LIMITS ==========
        maxUses: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Total uses allowed',
        },
        usesPerUser: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: 'Uses per customer',
        },
        currentUses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        currentUsersCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        usageHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Usage records (user, date, amount)',
        },

        // ========== VALIDITY PERIOD ==========
        validFrom: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isBefore: {
                    args: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    msg: 'Start date must be before end date',
                },
            },
            comment: 'When coupon becomes active',
        },
        validUntil: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfter: new Date().toISOString().split('T')[0],
            },
            comment: 'When coupon expires',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
        status: {
            type: DataTypes.ENUM('draft', 'scheduled', 'active', 'paused', 'expired', 'cancelled'),
            defaultValue: 'draft',
            index: true,
        },

        // ========== EXCLUSIONS & RESTRICTIONS ==========
        combinableWithOther: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Can be combined with other coupons',
        },
        stackingLimit: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: 'Max coupons that can be stacked',
        },
        excludedCoupons: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Coupons this cannot combine with',
        },
        conflictingCoupons: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== CAMPAIGN & MARKETING ==========
        campaignId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Related marketing campaign',
        },
        campaignName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        campaignType: {
            type: DataTypes.ENUM('seasonal', 'flash_sale', 'loyalty', 'referral', 'bundle', 'clearance', 'generic'),
            allowNull: true,
        },
        category: {
            type: DataTypes.ENUM('discount', 'gift', 'cashback', 'loyalty_reward', 'referral_reward', 'bundle'),
            defaultValue: 'discount',
        },

        // ========== REDEMPTION SETTINGS ==========
        requiresCode: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        automaticApplication: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Auto-apply without code',
        },
        requiresRegistration: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        requiresEmailVerification: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== NOTIFICATIONS & MARKETING ==========
        promotionalText: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Text to show in promotions',
        },
        badgeText: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Badge label (e.g., "Save 20%")',
        },
        bannerUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        notifyBeforeExpiry: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        notifyWhenActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== TERMS & CONDITIONS ==========
        termsAndConditions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        restrictions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== METRICS & ANALYTICS ==========
        impressions: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        clicks: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        redemptions: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        redemptionRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        conversionRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        totalDiscountGiven: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
        },
        averageOrderValue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        // ========== MANAGEMENT ==========
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Admin who created coupon',
        },
        modifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        approvedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== METADATA ==========
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'coupons',
        indexes: [
            { unique: true, fields: ['code'] },
            { fields: ['status'] },
            { fields: ['isActive'] },
            { fields: ['validUntil'] },
            { fields: ['campaignId'] },
        ],
        scopes: {
            active: {
                where: {
                    status: 'active',
                    validFrom: {
                        [sequelize.Sequelize.Op.lte]: new Date() },
                    validUntil: {
                        [sequelize.Sequelize.Op.gte]: new Date() },
                },
            },
            available: {
                where: { isActive: true },
            },
            expired: {
                where: { status: 'expired' },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Coupon.prototype.isValid = function() {
        const now = new Date();
        return this.status === 'active' &&
            new Date(this.validFrom) <= now &&
            new Date(this.validUntil) >= now;
    };

    Coupon.prototype.isExpired = function() {
        return new Date(this.validUntil) < new Date();
    };

    Coupon.prototype.getDaysUntilExpiry = function() {
        const today = new Date();
        const expiry = new Date(this.validUntil);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    Coupon.prototype.hasReachedLimit = function() {
        if (!this.maxUses) return false;
        return this.currentUses >= this.maxUses;
    };

    Coupon.prototype.canBeUsed = function() {
        return this.isValid() && !this.hasReachedLimit();
    };

    Coupon.prototype.calculateDiscount = function(amount) {
        if (this.discountType === 'percentage') {
            const discount = (amount * this.discountValue) / 100;
            return Math.min(discount, this.maxDiscount || Infinity);
        } else if (this.discountType === 'flat_amount') {
            return Math.min(this.discountValue, amount);
        }
        return 0;
    };

    Coupon.prototype.getFormattedDiscount = function() {
        if (this.discountType === 'percentage') {
            return `${this.discountValue}% OFF`;
        } else if (this.discountType === 'flat_amount') {
            return `${this.discountValue} OFF`;
        }
        return this.badgeText || 'Special Offer';
    };

    Coupon.prototype.getClickThroughRate = function() {
        if (this.impressions === 0) return 0;
        return ((this.clicks / this.impressions) * 100).toFixed(2);
    };

    // ========== ASSOCIATIONS ==========
    Coupon.associate = (models) => {
        Coupon.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    };

    return Coupon;
};