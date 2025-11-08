// Package Model - Comprehensive treatment packages
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Package = sequelize.define('Package', {
        packageId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        treatmentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'treatments',
                key: 'treatmentId',
            },
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 150],
                    msg: 'Package name must be between 3 and 150 characters',
                },
            },
            comment: 'Package name (e.g., Standard Kidney Transplant)',
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Detailed package description',
        },
        shortDescription: {
            type: DataTypes.STRING(300),
            allowNull: true,
            comment: 'Brief description',
        },

        // ========== PACKAGE TYPE ==========
        type: {
            type: DataTypes.ENUM('basic', 'standard', 'premium', 'deluxe', 'vip', 'custom'),
            defaultValue: 'standard',
        },
        tier: {
            type: DataTypes.ENUM('budget', 'mid_range', 'premium', 'luxury'),
            defaultValue: 'mid_range',
        },

        // ========== PRICING - STEP 5 SHOWS THIS ==========
        basePrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
            comment: 'Base package price (Step 5 - shown to user)',
        },
        originalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Price before discount',
        },
        discountedPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Discounted price if available',
        },
        discountPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
        },
        discountReason: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Reason for discount (seasonal, promotion, etc)',
        },
        discountUntil: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When discount expires',
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },

        // ========== PACKAGE COMPONENTS (INCLUSIONS) ==========
        inclusions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [
                'pre_operative_consultation',
                'surgery',
                'hospitalization',
                'medications',
                'nursing_care',
                'post_operative_consultation',
            ],
            comment: 'Array of included services',
        },
        exclusions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Services not included',
        },

        // ========== DURATION & STAY ==========
        durationType: {
            type: DataTypes.ENUM('day', 'week', 'month'),
            defaultValue: 'day',
        },
        durationValue: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1 },
            comment: 'Duration number (e.g., 5 days)',
        },
        durationTotal: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Total duration in days',
        },
        hospitalizationDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of hospitalization days',
        },
        preAdmissionDays: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        postOperativeDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== ROOM & AMENITIES ==========
        roomType: {
            type: DataTypes.ENUM('general_ward', 'shared_room', 'private_room', 'deluxe_room', 'suite', 'vip_suite'),
            allowNull: true,
        },
        roomAmenities: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['ac', 'attached_washroom', 'tv', 'wifi'],
            comment: 'Room amenities included',
        },
        mealPlan: {
            type: DataTypes.ENUM('basic', 'standard', 'premium', 'special_diet'),
            allowNull: true,
        },
        mealsPerDay: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== MEDICAL DETAILS ==========
        surgeonType: {
            type: DataTypes.ENUM('senior_consultant', 'consultant', 'experienced', 'specialist'),
            allowNull: true,
        },
        anesthesiaType: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Type of anesthesia used',
        },
        implants: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Included implants/devices',
        },
        implantCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        bloodRequirement: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Blood units required',
        },

        // ========== FOLLOW-UP & AFTERCARE ==========
        followUpRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        followUpDays: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            comment: 'Days of follow-up included',
        },
        followUpConsultations: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: 'Number of follow-up consultations',
        },
        followUpModes: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['video_call', 'phone_call'],
            comment: 'Follow-up modes',
        },
        postTreatmentCare: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Post-treatment care instructions',
        },

        // ========== STATISTICS & PERFORMANCE ==========
        successRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
            comment: 'Success rate %',
        },
        complicationRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        readmissionRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        averageRecoveryTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Average recovery time in days',
        },
        totalBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        completedBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== SPECIAL FEATURES ==========
        specialFeatures: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Special features of this package',
        },
        companionStay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        companionFood: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        airportTransfer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        translatorServices: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== INSURANCE & PAYMENT ==========
        acceptedInsurance: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        paymentPlan: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                installments: 1,
                method: 'full_payment',
            },
        },
        refundPolicy: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== ELIGIBILITY & REQUIREMENTS ==========
        ageMin: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ageMax: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        bmiMax: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        prerequisites: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Tests/consultations needed before',
        },
        contraindications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'When package cannot be done',
        },

        // ========== MEDIA ==========
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        brochureUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        video: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        availabilityStatus: {
            type: DataTypes.ENUM('available', 'limited', 'waitlist', 'unavailable'),
            defaultValue: 'available',
        },
    }, {
        timestamps: true,
        tableName: 'packages',
        indexes: [
            { fields: ['treatmentId'] },
            { fields: ['hospitalId'] },
            { fields: ['type'] },
            { fields: ['isActive'] },
            { fields: ['isFeatured'] },
            { unique: true, fields: ['slug'] },
        ],
    });

    // ========== SCOPES ==========
    Package.addScope('active', {
        where: { isActive: true },
    });

    Package.addScope('featured', {
        where: { isFeatured: true },
    });

    // ========== INSTANCE METHODS ==========
    Package.prototype.getDisplayPrice = function() {
        return this.discountedPrice || this.basePrice;
    };

    Package.prototype.hasDiscount = function() {
        return this.discountedPrice && this.discountedPrice < this.basePrice;
    };

    Package.prototype.getDiscountAmount = function() {
        if (!this.hasDiscount()) return 0;
        return this.basePrice - this.discountedPrice;
    };

    Package.prototype.getDurationDisplay = function() {
        return `${this.durationValue} ${this.durationType}(s)`;
    };

    // ========== ASSOCIATIONS ==========
    Package.associate = (models) => {
        Package.belongsTo(models.Treatment, { foreignKey: 'treatmentId', as: 'treatment' });
        Package.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Package.hasMany(models.Booking, { foreignKey: 'packageId', as: 'bookings' });
    };

    return Package;
};