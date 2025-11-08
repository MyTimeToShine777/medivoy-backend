// Feature Add-On Model - Comprehensive add-ons for Step 6
// Travel / Accommodation / Visa / Insurance / Services
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const FeatureAddOn = sequelize.define('FeatureAddOn', {
        featureId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 150],
                    msg: 'Feature name must be between 3 and 150 characters',
                },
            },
            comment: 'Feature name (e.g., Flight to India)',
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Detailed description',
        },
        shortDescription: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },

        // ========== CATEGORIZATION ==========
        type: {
            type: DataTypes.ENUM(
                'traveler_self_only',
                'traveler_with_companion',
                'travel_train',
                'travel_flight',
                'travel_bus',
                'travel_private_car',
                'accommodation_standard',
                'accommodation_luxury',
                'accommodation_budget',
                'visa_assistance',
                'visa_on_arrival',
                'insurance_medical',
                'insurance_travel',
                'insurance_combo',
                'service_airport_transfer',
                'service_translator',
                'service_coordinator',
                'service_follow_up',
                'service_local_sim',
                'service_wheelchair'
            ),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('traveler', 'travel', 'accommodation', 'visa', 'insurance', 'service'),
            allowNull: false,
        },
        subCategory: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== PRICING - STEP 6 SHOWS THIS ==========
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
            comment: 'Price per unit (Step 6)',
        },
        priceMax: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Maximum price if variable pricing',
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        unit: {
            type: DataTypes.ENUM('one_time', 'per_night', 'per_hour', 'per_day'),
            defaultValue: 'one_time',
            comment: 'Pricing unit',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Quantity included (e.g., 5 nights)',
        },

        // ========== PRICING MODIFIERS ==========
        priceMultiplier: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 1.0,
            comment: 'Multiplier for companion/extra persons',
        },
        companionPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Price if companion added',
        },
        discountPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },

        // ========== FEATURE DETAILS ==========
        features: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of included amenities/features',
        },
        providedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Provider name (airline, hotel, etc)',
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration (days/hours)',
        },

        // ========== TRAVEL SPECIFIC ==========
        travelClass: {
            type: DataTypes.ENUM('economy', 'premium_economy', 'business', 'first'),
            allowNull: true,
            comment: 'For travel',
        },
        mealInclusion: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        baggageAllowance: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'e.g., 2x 23kg',
        },
        transportMode: {
            type: DataTypes.ENUM('flight', 'train', 'bus', 'car'),
            allowNull: true,
        },

        // ========== ACCOMMODATION SPECIFIC ==========
        starRating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5,
            },
            comment: 'Hotel star rating',
        },
        roomType: {
            type: DataTypes.ENUM('single', 'double', 'twin', 'suite', 'deluxe_suite'),
            allowNull: true,
        },
        amenities: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Room amenities',
        },

        // ========== INSURANCE SPECIFIC ==========
        coverageAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Insurance coverage limit',
        },
        deductible: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
        },
        coverageDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'What is covered',
        },
        exclusions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'What is not covered',
        },

        // ========== SERVICE SPECIFIC ==========
        serviceProvider: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Who provides the service',
        },
        availability: {
            type: DataTypes.ENUM('24_7', 'business_hours', 'scheduled'),
            defaultValue: '24_7',
        },
        languagesAvailable: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['english', 'hindi'],
        },

        // ========== COMPATIBILITY ==========
        applicableTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Which treatments this add-on applies to',
        },
        applicableCountries: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Which countries this is available',
        },
        excludedCountries: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        conflictingAddOns: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Add-ons that cannot be selected together',
        },
        linkedAddOns: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Add-ons that complement this',
        },

        // ========== STATISTICS ==========
        timesSelected: {
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

        // ========== MEDIA ==========
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        brochure: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== METADATA ==========
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
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
        availability: {
            type: DataTypes.ENUM('always_available', 'seasonal', 'limited', 'unavailable'),
            defaultValue: 'always_available',
        },
        availableFrom: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        availableUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'feature_addons',
        indexes: [
            { fields: ['type'] },
            { fields: ['category'] },
            { fields: ['isActive'] },
            { fields: ['isFeatured'] },
            { unique: true, fields: ['slug'] },
        ],
    });

    // ========== SCOPES ==========
    FeatureAddOn.addScope('active', {
        where: { isActive: true },
    });

    FeatureAddOn.addScope('featured', {
        where: { isFeatured: true },
    });

    // ========== INSTANCE METHODS ==========
    FeatureAddOn.prototype.getDisplayPrice = function() {
        return `${this.price} ${this.currency}/${this.unit}`;
    };

    FeatureAddOn.prototype.canSelectWith = function(otherFeatureId) {
        return !this.conflictingAddOns.includes(otherFeatureId);
    };

    FeatureAddOn.prototype.getCompanionPrice = function() {
        return this.companionPrice || (this.price * this.priceMultiplier);
    };

    // ========== ASSOCIATIONS ==========
    FeatureAddOn.associate = (models) => {
        // Many-to-many through booking_features
    };

    return FeatureAddOn;
};