// Medical Record Model - Patient medical history and records
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const MedicalRecord = sequelize.define('MedicalRecord', {
        recordId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        appointmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'appointments',
                key: 'appointmentId',
            },
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
        },

        // ========== RECORD DETAILS ==========
        recordType: {
            type: DataTypes.ENUM(
                'medical_history',
                'surgical_history',
                'medication_history',
                'allergy_history',
                'family_history',
                'social_history',
                'lab_result',
                'imaging_result',
                'consultation_notes',
                'diagnosis',
                'treatment_plan',
                'procedure_report',
                'discharge_summary',
                'other'
            ),
            allowNull: false,
        },

        // ========== MEDICAL INFORMATION ==========
        condition: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        symptoms: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        severity: {
            type: DataTypes.ENUM('mild', 'moderate', 'severe', 'critical'),
            allowNull: true,
        },

        // ========== TREATMENT ==========
        treatment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        medications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        procedures: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== DATES ==========
        recordDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        resolvedDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('active', 'resolved', 'chronic', 'archived'),
            defaultValue: 'active',
        },

        // ========== CLINICAL DETAILS ==========
        clinicalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        observations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        vitals: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== DOCUMENTS ==========
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        reportUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== VISIBILITY & PRIVACY ==========
        isConfidential: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        accessLog: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
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

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        timestamps: true,
        tableName: 'medical_records',
        indexes: [
            { fields: ['userId'] },
            { fields: ['appointmentId'] },
            { fields: ['recordType'] },
            { fields: ['recordDate'] },
        ],
    });

    // Rename to avoid conflict with the 'isActive' attribute
    MedicalRecord.prototype.isActiveStatus = function() {
        return this.status === 'active' || this.status === 'chronic';
    };

    MedicalRecord.associate = (models) => {
        MedicalRecord.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        MedicalRecord.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
        MedicalRecord.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        MedicalRecord.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
    };

    return MedicalRecord;
};