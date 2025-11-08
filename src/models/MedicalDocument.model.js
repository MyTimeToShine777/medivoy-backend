// Medical Document Model - Medical documentation and reports
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const MedicalDocument = sequelize.define('MedicalDocument', {
        docId: {
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

        // ========== DOCUMENT TYPE ==========
        documentType: {
            type: DataTypes.ENUM(
                'consultation_note',
                'diagnosis_report',
                'treatment_plan',
                'surgical_report',
                'discharge_summary',
                'lab_report',
                'imaging_report',
                'prescription',
                'referral',
                'medical_certificate',
                'vaccination_record',
                'allergy_record',
                'medication_history',
                'surgical_history',
                'pathology_report',
                'immunology_report',
                'other'
            ),
            allowNull: false,
        },

        // ========== DOCUMENT DETAILS ==========
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== CLINICAL INFO ==========
        diagnosis: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        symptoms: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        findings: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        recommendations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        medications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== DATES ==========
        documentDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        validFrom: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        validUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== FILE INFORMATION ==========
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== DIGITAL SIGNATURE ==========
        isSigned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        signedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        signatureDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        signatureVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== VERIFICATION ==========
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verificationStatus: {
            type: DataTypes.ENUM('pending', 'verified', 'rejected'),
            defaultValue: 'pending',
        },
        verifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== VISIBILITY & ACCESS ==========
        visibility: {
            type: DataTypes.ENUM('private', 'doctor', 'hospital', 'public'),
            defaultValue: 'private',
        },
        sharedWith: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        accessLog: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM('draft', 'final', 'archived'),
            defaultValue: 'draft',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    }, {
        timestamps: true,
        tableName: 'medical_documents',
        indexes: [
            { fields: ['userId'] },
            { fields: ['appointmentId'] },
            { fields: ['doctorId'] },
            { fields: ['documentType'] },
            { fields: ['documentDate'] },
        ],
    });

    MedicalDocument.prototype.isExpired = function() {
        if (!this.validUntil) return false;
        return new Date(this.validUntil) < new Date();
    };

    MedicalDocument.associate = (models) => {
        MedicalDocument.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        MedicalDocument.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
        MedicalDocument.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        MedicalDocument.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
    };

    return MedicalDocument;
};