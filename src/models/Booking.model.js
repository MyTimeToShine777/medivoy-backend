// Booking Model - Comprehensive core booking model
// Stores data from Steps 5-10 (Package through Confirm)
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Booking = sequelize.define('Booking', {
        bookingId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique booking identifier',
        },

        // ========== STEP 1-4: SELECTION IDs ==========
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Patient user ID',
            index: true,
        },
        treatmentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'treatments',
                key: 'treatmentId',
            },
            comment: 'Step 1: Selected treatment',
        },
        countryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'countries',
                key: 'countryId',
            },
            comment: 'Step 2: Selected country',
        },
        cityId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'cities',
                key: 'cityId',
            },
            comment: 'Step 3: Selected city',
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
            comment: 'Step 4: Selected hospital',
        },

        // ========== STEP 5: PACKAGE & BASE PRICE ==========
        packageId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'packages',
                key: 'packageId',
            },
            comment: 'Step 5: Selected package',
        },
        basePrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: { min: 0 },
            comment: 'Step 5: Package base price shown to user',
        },
        packageDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Package details snapshot',
        },

        // ========== STEP 6: ADD-ONS ==========
        selectedAddOns: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Step 6: Array of selected add-on features with prices',
        },
        addOnsPrice: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
            validate: { min: 0 },
            comment: 'Step 6: Total add-ons price',
        },
        addOnsDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Detailed add-on information stored',
        },

        // ========== STEP 7: COST ESTIMATION & PRICING ==========
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'basePrice + addOnsPrice',
        },
        taxPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 10.0,
            comment: 'Tax percentage applied',
        },
        taxAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
            comment: 'Calculated tax amount',
        },
        discountCode: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Applied discount/promo code',
        },
        discountPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.0,
        },
        discountAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
            comment: 'Discount amount applied',
        },
        totalCost: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: { min: 0 },
            comment: 'Step 7: Final total cost (base + addons + tax - discount)',
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        exchangeRate: {
            type: DataTypes.DECIMAL(12, 4),
            defaultValue: 1.0,
            comment: 'Exchange rate when booking made',
        },

        // ========== STEP 8: PATIENT INFORMATION ==========
        patientAge: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 150,
            },
            comment: 'Step 8: Patient age',
        },
        patientGender: {
            type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
            allowNull: false,
            comment: 'Step 8: Patient gender',
        },
        patientCity: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Step 8: Patient home city',
        },
        patientState: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        patientCountry: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        comorbidConditions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Step 8: Pre-existing medical conditions',
        },
        allergies: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        previousSurgeries: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Previous surgeries/procedures',
        },
        medicalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Important medical notes',
        },

        // ========== STEP 9: INSURANCE ==========
        insuranceStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Step 9: Has insurance or not',
        },
        insuranceId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Step 9: Insurance record ID',
        },
        insuranceProvider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        insurancePolicyNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        insuranceDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },

        // ========== STEP 10: CONFIRMATION & STATUS ==========
        bookingStatus: {
            type: DataTypes.ENUM(
                'pending',
                'expert_review',
                'confirmed',
                'in_progress',
                'completed',
                'cancelled'
            ),
            defaultValue: 'pending',
            index: true,
            comment: 'Step 10: Booking lifecycle status',
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'History of status changes',
        },

        // ========== STEP 11: EXPERT CALL ==========
        expertCallStatus: {
            type: DataTypes.ENUM(
                'pending',
                'scheduled',
                'reminder_sent',
                'ongoing',
                'completed',
                'cancelled',
                'rescheduled',
                'no_show'
            ),
            defaultValue: 'pending',
            comment: 'Step 11: Expert call status',
        },
        expertCallNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Expert consultation notes',
        },
        expertRecommendations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Expert recommendations',
        },

        // ========== TREATMENT SCHEDULING ==========
        scheduledDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When treatment is scheduled',
        },
        scheduledEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When treatment actually started',
        },
        completionDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When treatment was completed',
        },

        // ========== PAYMENT TRACKING ==========
        paymentStatus: {
            type: DataTypes.ENUM(
                'pending',
                'initiated',
                'processing',
                'completed',
                'failed',
                'cancelled',
                'refunded'
            ),
            defaultValue: 'pending',
        },
        paymentMethod: {
            type: DataTypes.ENUM(
                'credit_card',
                'debit_card',
                'upi',
                'net_banking',
                'wallet'
            ),
            allowNull: true,
        },
        paymentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'payments',
                key: 'paymentId',
            },
        },
        totalPaid: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
        },
        refundAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
        },

        // ========== SPECIAL REQUESTS & NOTES ==========
        specialRequests: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Patient special requests',
        },
        dietaryRequirements: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        religionConsiderations: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        accompaniedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'If coming with companion',
        },

        // ========== CANCELLATION & REFUND ==========
        cancellationRequested: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        cancellationRequestedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cancellationApprovedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        refundInitiatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== METADATA & TRACKING ==========
        referralCode: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Referral code if applicable',
        },
        source: {
            type: DataTypes.ENUM('website', 'mobile_app', 'agent', 'referral'),
            allowNull: true,
        },
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'For internal staff use only',
        },
        followUpDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        documents: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Document IDs attached to booking',
        },
    }, {
        timestamps: true,
        tableName: 'bookings',
        indexes: [
            { fields: ['userId'] },
            { fields: ['hospitalId'] },
            { fields: ['bookingStatus'] },
            { fields: ['paymentStatus'] },
            { fields: ['createdAt'] },
            { fields: ['scheduledDate'] },
        ],
    });

    // ========== SCOPES ==========
    Booking.addScope('pending', {
        where: { bookingStatus: 'pending' },
    });

    Booking.addScope('confirmed', {
        where: { bookingStatus: 'confirmed' },
    });

    Booking.addScope('completed', {
        where: { bookingStatus: 'completed' },
    });

    Booking.addScope('unpaid', {
        where: { paymentStatus: 'pending' },
    });

    // ========== INSTANCE METHODS ==========
    Booking.prototype.getBookingNumber = function() {
        return `BK-${this.bookingId.slice(0, 8).toUpperCase()}`;
    };

    Booking.prototype.canBeCancelled = function() {
        return ['pending', 'expert_review', 'confirmed'].includes(this.bookingStatus);
    };

    Booking.prototype.isPaid = function() {
        return this.paymentStatus === 'completed';
    };

    Booking.prototype.getBookingStatus = function() {
        return this.bookingStatus;
    };

    Booking.prototype.isCompleted = function() {
        return this.bookingStatus === 'completed';
    };

    // ========== ASSOCIATIONS ==========
    Booking.associate = (models) => {
        Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        Booking.belongsTo(models.Treatment, { foreignKey: 'treatmentId', as: 'treatment' });
        Booking.belongsTo(models.Country, { foreignKey: 'countryId', as: 'country' });
        Booking.belongsTo(models.City, { foreignKey: 'cityId', as: 'city' });
        Booking.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Booking.belongsTo(models.Package, { foreignKey: 'packageId', as: 'package' });
        Booking.hasOne(models.ExpertCall, { foreignKey: 'bookingId', as: 'expertCall' });
        Booking.hasMany(models.Payment, { foreignKey: 'bookingId', as: 'payments' });
        Booking.hasMany(models.Document, { foreignKey: 'bookingId', as: 'documents' });
    };

    return Booking;
};