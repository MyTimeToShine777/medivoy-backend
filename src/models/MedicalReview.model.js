// Medical Review Model - Medical expert reviews and peer reviews
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const MedicalReview = sequelize.define('MedicalReview', {
        reviewId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        documentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'medical_documents',
                key: 'docId',
            },
        },
        appointmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'appointments',
                key: 'appointmentId',
            },
        },
        reviewedBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
        },
        reviewedFor: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
            comment: 'Doctor being reviewed by peer',
        },

        // ========== REVIEW TYPE ==========
        reviewType: {
            type: DataTypes.ENUM(
                'peer_review',
                'quality_assurance',
                'case_review',
                'treatment_review',
                'clinical_audit',
                'other'
            ),
            allowNull: false,
        },

        // ========== REVIEW DETAILS ==========
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        findings: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        recommendations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== QUALITY ASSESSMENT ==========
        qualityRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            validate: { min: 0, max: 5 },
        },
        clinicalAccuracy: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        appropriateness: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        completeness: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },

        // ========== ISSUES IDENTIFIED ==========
        issuesIdentified: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        severity: {
            type: DataTypes.ENUM('minor', 'moderate', 'major', 'critical'),
            allowNull: true,
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected', 'addressed'),
            defaultValue: 'draft',
        },
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== APPROVALS ==========
        approvalRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        approvedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'medical_reviews',
        indexes: [
            { fields: ['documentId'] },
            { fields: ['appointmentId'] },
            { fields: ['reviewedBy'] },
            { fields: ['status'] },
        ],
    });

    MedicalReview.prototype.getOverallScore = function() {
        const scores = [
            this.clinicalAccuracy,
            this.appropriateness,
            this.completeness,
        ].filter(s => s !== null);
        if (scores.length === 0) return this.qualityRating;
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    };

    MedicalReview.associate = (models) => {
        MedicalReview.belongsTo(models.MedicalDocument, { foreignKey: 'documentId', as: 'document' });
        MedicalReview.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
        MedicalReview.belongsTo(models.Doctor, { foreignKey: 'reviewedBy', as: 'reviewer' });
        MedicalReview.belongsTo(models.Doctor, { foreignKey: 'reviewedFor', as: 'reviewedDoctor' });
    };

    return MedicalReview;
};