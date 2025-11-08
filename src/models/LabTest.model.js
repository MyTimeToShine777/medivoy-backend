// Lab Test Model - Individual laboratory tests
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const LabTest = sequelize.define('LabTest', {
        testId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique test identifier',
        },

        // ========== RELATIONSHIPS ==========
        laboratoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'laboratories',
                key: 'laboratoryId',
            },
            index: true,
        },
        appointmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'appointments',
                key: 'appointmentId',
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },

        // ========== TEST BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 150],
                    msg: 'Test name must be between 3 and 150 characters',
                },
            },
            comment: 'Test name',
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Test code/abbreviation',
        },
        type: {
            type: DataTypes.ENUM(
                'blood',
                'urine',
                'stool',
                'imaging',
                'cardiac',
                'pulmonary',
                'genetic',
                'microbiological',
                'immunological',
                'molecular',
                'chemistry',
                'other'
            ),
            allowNull: true,
        },
        category: {
            type: DataTypes.ENUM(
                'routine',
                'specialized',
                'diagnostic',
                'screening',
                'monitoring',
                'follow_up'
            ),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== SPECIMEN DETAILS ==========
        specimenType: {
            type: DataTypes.ENUM(
                'blood_serum',
                'blood_plasma',
                'blood_whole',
                'urine',
                'stool',
                'cerebrospinal_fluid',
                'saliva',
                'tissue',
                'swab',
                'other'
            ),
            allowNull: true,
        },
        specimenVolume: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'e.g., 5ml, 10ml',
        },
        specimenContainer: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Type of collection container',
        },
        specimenPreservative: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        specimenCollectedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        specimenReceivedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== PRICING ==========
        basePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        discountedPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },

        // ========== TEST PROCEDURE ==========
        preparationRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        preparationInstructions: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Fasting, timing, etc',
        },
        fastingRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        fastingHours: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sampleQualityCheck: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== TURNAROUND TIME ==========
        expectedTurnaroundDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 0 },
        },
        expectedTurnaroundHours: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        priorityTurnaroundDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== REFERENCE RANGES ==========
        referenceRange: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Normal ranges for result',
        },
        referenceRangeUnit: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Unit of measurement',
        },
        genderSpecific: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        ageSpecific: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== TEST STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'ordered',
                'sample_collected',
                'in_progress',
                'completed',
                'reported',
                'cancelled',
                'rejected',
                'hold'
            ),
            defaultValue: 'ordered',
            index: true,
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== TEST RESULTS ==========
        result: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Test result value',
        },
        resultValue: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true,
        },
        resultUnit: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resultInterpretation: {
            type: DataTypes.ENUM('normal', 'abnormal', 'critical', 'pending'),
            allowNull: true,
        },
        resultAbnormality: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Description of abnormality',
        },

        // ========== REPORT ==========
        reportFile: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to report document',
        },
        reportGeneratedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reportVerifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Pathologist who verified',
        },
        reportVerifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reportComments: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Pathologist comments',
        },

        // ========== CRITICAL VALUES ==========
        isCritical: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        criticalLowValue: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true,
        },
        criticalHighValue: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true,
        },
        criticalValueNotified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        notifiedTo: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== RELATED TESTS ==========
        relatedTests: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'IDs of related tests',
        },
        panelTests: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'If part of a test panel',
        },

        // ========== QUALITY & ACCURACY ==========
        quality: {
            type: DataTypes.ENUM('acceptable', 'borderline', 'unacceptable', 'rejected'),
            defaultValue: 'acceptable',
        },
        qualityIssue: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        qcRemark: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Quality control remarks',
        },

        // ========== REPEAT TEST ==========
        repeatRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        repeatReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        originalTestId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'If this is a repeat test',
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
        tableName: 'lab_tests',
        indexes: [
            { fields: ['laboratoryId'] },
            { fields: ['appointmentId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
        ],
    });

    LabTest.prototype.isCompleted = function() {
        return this.status === 'reported';
    };

    LabTest.prototype.isAbnormal = function() {
        return this.resultInterpretation === 'abnormal' || this.resultInterpretation === 'critical';
    };

    LabTest.prototype.isCriticalValue = function() {
        return this.resultInterpretation === 'critical';
    };

    LabTest.associate = (models) => {
        LabTest.belongsTo(models.Laboratory, { foreignKey: 'laboratoryId', as: 'laboratory' });
        LabTest.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
        LabTest.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
    };

    return LabTest;
};