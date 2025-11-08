// Treatment Model - Comprehensive medical treatment details
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';
import { TREATMENT_TYPES, TREATMENT_CATEGORIES } from '../constants/treatmentTypes.js';

export default (sequelize) => {
    const Treatment = sequelize.define('Treatment', {
        treatmentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Treatment name must be unique',
            },
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Treatment name must be between 3 and 100 characters',
                },
            },
            comment: 'e.g., Kidney Transplant, Heart Bypass Surgery',
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            comment: 'URL-friendly slug',
        },
        type: {
            type: DataTypes.ENUM(Object.values(TREATMENT_TYPES)),
            allowNull: false,
            comment: 'Treatment type classification',
        },
        category: {
            type: DataTypes.ENUM(Object.values(TREATMENT_CATEGORIES)),
            allowNull: false,
            comment: 'Broader treatment category',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Detailed treatment description',
        },
        shortDescription: {
            type: DataTypes.STRING(300),
            allowNull: true,
            comment: 'Brief description for listings',
        },

        // ========== MEDICAL DETAILS ==========
        medicalDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                procedure: '',
                anesthesia: 'general',
                riskLevel: 'moderate',
                complications: [],
            },
            comment: 'Medical procedure details',
        },
        prerequisites: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Pre-treatment requirements (tests, consultations, etc)',
        },
        contraindications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'When treatment is not suitable',
        },
        successCriteria: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'What defines successful treatment',
        },

        // ========== DURATION ==========
        durationMin: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 1,
            },
            comment: 'Minimum duration in days',
        },
        durationMax: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 1,
            },
            comment: 'Maximum duration in days',
        },
        averageDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Average duration in days',
        },
        recoveryDaysMin: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Minimum recovery days',
        },
        recoveryDaysMax: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum recovery days',
        },

        // ========== PRICING ==========
        basePrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Global base price (can be overridden by hospital)',
        },
        priceMin: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        priceMax: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        costVariations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Price variations by country/hospital',
        },

        // ========== REQUIREMENTS ==========
        requiresPreparation: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If preparation is needed',
        },
        preparationDays: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Days needed for preparation',
        },
        preparationDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Preparation instructions',
        },
        requiresFasting: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        fastingHours: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Hours to fast before treatment',
        },
        isEmergency: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If this is emergency treatment',
        },

        // ========== STATISTICS ==========
        totalCasesCompleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Total treatments completed',
        },
        successRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
            comment: 'Success rate percentage',
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
            comment: 'Average patient rating',
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== POST-TREATMENT ==========
        followUpRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        followUpDays: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            comment: 'Follow-up period in days',
        },
        followUpIntervals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [
                { days: 7, type: 'phone_call' },
                { days: 14, type: 'consultation' },
                { days: 30, type: 'video_call' },
            ],
            comment: 'Scheduled follow-ups',
        },

        // ========== MEDIA ==========
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Icon URL',
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Treatment image URL',
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Multiple treatment images',
        },
        video: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Explainer video URL',
        },

        // ========== TAGS & METADATA ==========
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'SEO keywords',
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Treatment tags',
        },
        relatedTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'IDs of related treatments',
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
        tableName: 'treatments',
        indexes: [
            { fields: ['type'] },
            { fields: ['category'] },
            { fields: ['isActive'] },
            { fields: ['isFeatured'] },
            { unique: true, fields: ['slug'] },
        ],
    });

    // ========== SCOPES ==========
    Treatment.addScope('active', {
        where: { isActive: true },
    });

    Treatment.addScope('featured', {
        where: { isFeatured: true },
    });

    // ========== INSTANCE METHODS ==========
    Treatment.prototype.isAffordable = function(maxBudget) {
        if (!this.priceMax) return true;
        return this.priceMax <= maxBudget;
    };

    Treatment.prototype.getDurationRange = function() {
        return {
            min: this.durationMin || 0,
            max: this.durationMax || 0,
            average: this.averageDuration || null,
        };
    };

    Treatment.prototype.getRecoveryRange = function() {
        return {
            min: this.recoveryDaysMin || 0,
            max: this.recoveryDaysMax || 0,
        };
    };

    Treatment.prototype.canBeScheduledImmediately = function() {
        return !this.requiresPreparation;
    };

    // ========== ASSOCIATIONS ==========
    Treatment.associate = (models) => {
        Treatment.hasMany(models.Package, { foreignKey: 'treatmentId', as: 'packages' });
        Treatment.hasMany(models.Booking, { foreignKey: 'treatmentId', as: 'bookings' });
    };

    return Treatment;
};