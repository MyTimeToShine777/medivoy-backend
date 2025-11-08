// Prescription Model - Medical prescriptions
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Prescription = sequelize.define('Prescription', {
        prescriptionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique prescription identifier',
        },

        // ========== RELATIONSHIPS ==========
        appointmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'appointments',
                key: 'appointmentId',
            },
            index: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Patient',
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
            comment: 'Prescribing doctor',
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
        },

        // ========== PRESCRIPTION DETAILS ==========
        prescriptionNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: 'Prescription ID',
        },
        type: {
            type: DataTypes.ENUM(
                'medication',
                'injection',
                'topical',
                'inhalation',
                'combination',
                'other'
            ),
            defaultValue: 'medication',
        },
        status: {
            type: DataTypes.ENUM(
                'draft',
                'issued',
                'partially_filled',
                'filled',
                'dispensed',
                'expired',
                'cancelled'
            ),
            defaultValue: 'draft',
            index: true,
        },

        // ========== MEDICATIONS ==========
        medications: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of medications with dosage',
        },

        // ========== DOSING INSTRUCTIONS ==========
        dosageInstructions: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Special instructions',
        },
        frequency: {
            type: DataTypes.ENUM(
                'once_daily',
                'twice_daily',
                'thrice_daily',
                'four_times_daily',
                'every_other_day',
                'weekly',
                'as_needed',
                'other'
            ),
            allowNull: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in days',
        },
        durationUnit: {
            type: DataTypes.ENUM('days', 'weeks', 'months'),
            defaultValue: 'days',
        },

        // ========== TIMING ==========
        issuedDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        validUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When to start medication',
        },

        // ========== SPECIAL INSTRUCTIONS ==========
        specialInstructions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Before food, with water, etc',
        },
        refillsAllowed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        refillsUsed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== MONITORING & WARNINGS ==========
        warningsAndPrecautions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        sideEffects: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Possible side effects',
        },
        contraindications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        drugInteractions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        allergyWarnings: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        monitoringRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        monitoringTests: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Tests to monitor',
        },

        // ========== DISPENSING ==========
        dispensedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dispensedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Pharmacist name',
        },
        pharmacy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dispensingStatus: {
            type: DataTypes.ENUM('pending', 'dispensed', 'partial', 'rejected'),
            defaultValue: 'pending',
        },

        // ========== QUANTITY & REFILLS ==========
        quantityPrescribed: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
        },
        quantityUnit: {
            type: DataTypes.ENUM('tablet', 'capsule', 'ml', 'gm', 'vial', 'strip', 'other'),
            allowNull: true,
        },
        quantityDispensed: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
        },

        // ========== COST & INSURANCE ==========
        estimatedCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        actualCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        coinsurance: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        insuranceCovered: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== DIGITAL ACCESS ==========
        ePrescription: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        eRxNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        qrCode: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'QR code URL for digital verification',
        },

        // ========== DOCUMENTS ==========
        prescriptionDocument: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to prescription PDF',
        },
        digitalCopy: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== ADHERENCE & COMPLIANCE ==========
        adherenceStatus: {
            type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'unknown'),
            defaultValue: 'unknown',
        },
        adherenceNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== FOLLOW-UP ==========
        followUpRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        followUpDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        effectiveness: {
            type: DataTypes.ENUM('effective', 'partially_effective', 'ineffective', 'unknown'),
            allowNull: true,
            comment: 'Treatment effectiveness',
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
        tableName: 'prescriptions',
        indexes: [
            { fields: ['appointmentId'] },
            { fields: ['userId'] },
            { fields: ['doctorId'] },
            { fields: ['status'] },
            { unique: true, fields: ['prescriptionNumber'] },
        ],
    });

    Prescription.prototype.isValid = function() {
        if (!this.validUntil) return true;
        return new Date(this.validUntil) > new Date();
    };

    Prescription.prototype.isExpired = function() {
        if (!this.validUntil) return false;
        return new Date(this.validUntil) < new Date();
    };

    Prescription.prototype.canRefill = function() {
        return this.refillsUsed < this.refillsAllowed && this.isValid();
    };

    Prescription.prototype.getRemainingRefills = function() {
        return this.refillsAllowed - this.refillsUsed;
    };

    Prescription.associate = (models) => {
        Prescription.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
        Prescription.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        Prescription.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        Prescription.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
    };

    return Prescription;
};