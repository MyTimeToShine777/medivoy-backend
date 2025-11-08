'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING ADD-ON MODEL - PRODUCTION READY
// NO OPTIONAL CHAINING - ULTRA COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

import { DataTypes } from 'sequelize';

export const BookingAddOn = (sequelize) => {
    return sequelize.define('BookingAddOn', {
        // PRIMARY KEY
        addOnId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique booking add-on identifier'
        },

        // FOREIGN KEYS
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'bookingId'
            },
            comment: 'Reference to booking'
        },

        featureId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'featureaddons',
                key: 'featureId'
            },
            comment: 'Reference to feature add-on definition'
        },

        // ADD-ON CATEGORIZATION
        category: {
            type: DataTypes.ENUM(
                'travel',
                'accommodation',
                'visa',
                'insurance',
                'service',
                'companion'
            ),
            allowNull: false,
            comment: 'Category of add-on: travel, accommodation, visa, insurance, service, companion'
        },

        type: {
            type: DataTypes.ENUM(
                // TRAVEL TYPES
                'travel_flight',
                'travel_train',
                'travel_bus',
                'travel_private_car',
                'travel_self_only',
                'travel_with_companion',
                // ACCOMMODATION TYPES
                'accommodation_standard',
                'accommodation_luxury',
                'accommodation_budget',
                'accommodation_shared',
                'accommodation_private',
                // VISA TYPES
                'visa_assistance',
                'visa_on_arrival',
                'visa_processing',
                // INSURANCE TYPES
                'insurance_medical',
                'insurance_travel',
                'insurance_combo',
                'insurance_emergency',
                // SERVICE TYPES
                'service_airport_transfer',
                'service_translator',
                'service_coordinator',
                'service_follow_up',
                'service_local_sim',
                'service_wheelchair',
                'service_meal_plan',
                'service_entertainment'
            ),
            allowNull: false,
            comment: 'Specific type of add-on'
        },

        // PRICING & COST
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            },
            comment: 'Price per unit/night/hour'
        },

        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
            comment: 'Currency code: USD, EUR, INR, etc'
        },

        unit: {
            type: DataTypes.ENUM(
                'one_time',
                'per_night',
                'per_day',
                'per_hour',
                'per_person',
                'per_flight',
                'per_transfer'
            ),
            defaultValue: 'one_time',
            comment: 'How the add-on is priced'
        },

        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            validate: {
                min: 1
            },
            comment: 'Quantity selected by user (nights, hours, etc)'
        },

        totalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            },
            comment: 'quantity × price'
        },

        discount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            comment: 'Discount applied if any'
        },

        finalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            },
            comment: 'totalPrice - discount'
        },

        // TRAVEL SPECIFIC
        travelClass: {
            type: DataTypes.ENUM(
                'economy',
                'premium_economy',
                'business',
                'first'
            ),
            allowNull: true,
            comment: 'Flight class if travel type'
        },

        departureDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Departure date for travel'
        },

        returnDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Return date for travel'
        },

        mealInclusion: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether meals are included'
        },

        baggageAllowance: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'E.g., 2x 23kg + 7kg carry-on'
        },

        transportMode: {
            type: DataTypes.ENUM(
                'flight',
                'train',
                'bus',
                'car'
            ),
            allowNull: true,
            comment: 'Mode of transport for travel'
        },

        // ACCOMMODATION SPECIFIC
        checkInDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Check-in date'
        },

        checkOutDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Check-out date'
        },

        numberOfNights: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of nights'
        },

        starRating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5
            },
            comment: 'Hotel star rating'
        },

        roomType: {
            type: DataTypes.ENUM(
                'single',
                'double',
                'twin',
                'suite',
                'deluxe_suite',
                'general_ward',
                'shared_room',
                'private_room'
            ),
            allowNull: true,
            comment: 'Type of room'
        },

        roomAmenities: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['AC', 'WiFi', 'TV', 'Attached Washroom'],
            comment: 'Array of amenities: AC, WiFi, TV, etc'
        },

        mealPlan: {
            type: DataTypes.ENUM(
                'basic',
                'standard',
                'premium',
                'special_diet'
            ),
            allowNull: true,
            comment: 'Meal plan type'
        },

        mealsPerDay: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of meals per day'
        },

        hospitalityType: {
            type: DataTypes.ENUM(
                'standard_stay',
                'luxury_stay',
                'rough_estimation'
            ),
            allowNull: true,
            comment: 'Type of hospitality'
        },

        // VISA SPECIFIC
        visaType: {
            type: DataTypes.ENUM(
                'tourist',
                'medical',
                'business',
                'on_arrival',
                'e_visa',
                'standard_processing'
            ),
            allowNull: true,
            comment: 'Type of visa'
        },

        visaDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Visa validity in days'
        },

        visaProcessingTime: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'E.g., 5-7 business days'
        },

        visaCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Official visa fee'
        },

        processsingFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Processing/service fee'
        },

        // INSURANCE SPECIFIC
        coverageType: {
            type: DataTypes.ENUM(
                'medical_coverage',
                'travel_coverage',
                'combo_coverage',
                'emergency_coverage'
            ),
            allowNull: true,
            comment: 'Type of insurance coverage'
        },

        coverageAmount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Maximum coverage limit'
        },

        deductible: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Deductible amount'
        },

        coverageDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of what is covered'
        },

        exclusions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of exclusions'
        },

        policyNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Insurance policy number if generated'
        },

        // SERVICE SPECIFIC
        serviceName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Name of service'
        },

        serviceProvider: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Provider name (airline, hotel, etc)'
        },

        serviceStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When service starts'
        },

        serviceEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When service ends'
        },

        serviceHours: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Total hours of service (for per-hour services)'
        },

        serviceNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional service notes'
        },

        // COMPANION SPECIFIC
        companionType: {
            type: DataTypes.ENUM(
                'spouse',
                'family_member',
                'care_giver',
                'other'
            ),
            allowNull: true,
            comment: 'Type of companion'
        },

        companionName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Name of companion'
        },

        companionAge: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Age of companion'
        },

        // STATUS & TRACKING
        status: {
            type: DataTypes.ENUM(
                'pending',
                'confirmed',
                'in_progress',
                'completed',
                'cancelled',
                'refunded'
            ),
            defaultValue: 'pending',
            comment: 'Current status of add-on'
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Whether this add-on is still active'
        },

        // PAYMENT & REFUND
        paymentStatus: {
            type: DataTypes.ENUM(
                'pending',
                'completed',
                'failed',
                'refunded'
            ),
            defaultValue: 'pending',
            comment: 'Payment status for this add-on'
        },

        refundAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            comment: 'Refund amount if applicable'
        },

        refundReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for refund if applicable'
        },

        // METADATA & NOTES
        features: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of features/inclusions'
        },

        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Icon URL or name for UI'
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Image URL for display'
        },

        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Tags for filtering'
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Internal notes about this add-on'
        },

        // TIMESTAMPS
        confirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When add-on was confirmed'
        },

        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When add-on service was completed'
        },

        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When add-on was cancelled'
        }

    }, {
        timestamps: true,
        tableName: 'booking_add_ons',
        indexes: [{
                fields: ['bookingId']
            },
            {
                fields: ['featureId']
            },
            {
                fields: ['category']
            },
            {
                fields: ['type']
            },
            {
                fields: ['status']
            },
            {
                fields: ['paymentStatus']
            },
            {
                fields: ['createdAt']
            }
        ],
        comment: 'Stores add-ons (travel, accommodation, visa, insurance, services) selected for each booking'
    });
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSOCIATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const associateBookingAddOn = (models) => {
    const BookingAddOn = models.BookingAddOn;

    BookingAddOn.belongsTo(models.Booking, {
        foreignKey: 'bookingId',
        as: 'booking',
        onDelete: 'CASCADE'
    });

    BookingAddOn.belongsTo(models.FeatureAddOn, {
        foreignKey: 'featureId',
        as: 'feature'
    });

    return BookingAddOn;
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER METHODS
// ═══════════════════════════════════════════════════════════════════════════════

export const BookingAddOnHelpers = {
    /**
     * Calculate final price with discount
     */
    calculateFinalPrice: (totalPrice, discount) => {
        const finalPrice = totalPrice - discount;
        return finalPrice > 0 ? finalPrice : 0;
    },

    /**
     * Calculate total price based on quantity and unit price
     */
    calculateTotalPrice: (price, quantity) => {
        return parseFloat((price * quantity).toFixed(2));
    },

    /**
     * Get category label
     */
    getCategoryLabel: (category) => {
        const labels = {
            'travel': 'Travel & Transport',
            'accommodation': 'Accommodation & Stay',
            'visa': 'Visa Assistance',
            'insurance': 'Insurance Coverage',
            'service': 'Additional Services',
            'companion': 'Companion Services'
        };
        return labels[category] || category;
    },

    /**
     * Get type label
     */
    getTypeLabel: (type) => {
        const labels = {
            'travel_flight': 'Flight',
            'travel_train': 'Train',
            'travel_bus': 'Bus',
            'travel_private_car': 'Private Car',
            'accommodation_standard': 'Standard Accommodation',
            'accommodation_luxury': 'Luxury Accommodation',
            'accommodation_budget': 'Budget Accommodation',
            'visa_assistance': 'Visa Assistance',
            'visa_on_arrival': 'Visa on Arrival',
            'insurance_medical': 'Medical Insurance',
            'insurance_travel': 'Travel Insurance',
            'service_airport_transfer': 'Airport Transfer',
            'service_translator': 'Translator Services',
            'service_coordinator': 'Medical Coordinator',
            'service_follow_up': 'Follow-up Care',
            'service_local_sim': 'Local SIM Card',
            'service_wheelchair': 'Wheelchair Services'
        };
        return labels[type] || type;
    },

    /**
     * Check if add-on is refundable
     */
    isRefundable: (status, paymentStatus) => {
        const refundableStatuses = ['pending', 'confirmed', 'in_progress'];
        const paidStatuses = ['completed', 'refunded'];
        return refundableStatuses.includes(status) && paidStatuses.includes(paymentStatus);
    },

    /**
     * Get duration in days
     */
    getDurationInDays: (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    /**
     * Validate add-on data
     */
    validateAddOnData: (data) => {
        const errors = [];

        if (!data.category) errors.push('Category is required');
        if (!data.type) errors.push('Type is required');
        if (!data.price || data.price <= 0) errors.push('Price must be greater than 0');
        if (!data.unit) errors.push('Unit is required');
        if (data.quantity && data.quantity <= 0) errors.push('Quantity must be greater than 0');

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
};

export default BookingAddOn;