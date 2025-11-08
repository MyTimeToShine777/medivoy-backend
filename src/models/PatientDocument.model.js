// Patient Document Model - Patient submitted documents
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const PatientDocument = sequelize.define('PatientDocument', {
        patientDocId: {
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
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
        },

        // ========== DOCUMENT TYPE ==========
        documentType: {
            type: DataTypes.ENUM(
                'passport',
                'visa',
                'id_proof',
                'medical_report',
                'insurance_document',
                'payment_proof',
                'accommodation_receipt',
                'travel_ticket',
                'health_declaration',
                'consent_form',
                'other'
            ),
            allowNull: false,
        },

        // ========== DOCUMENT INFO ==========
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== FILE ==========
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        mimeType: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== EXPIRY ==========
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== VERIFICATION ==========
        verificationStatus: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'needs_reupload'),
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
        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== METADATA ==========
        uploadedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

    }, {
        timestamps: true,
        tableName: 'patient_documents',
        indexes: [
            { fields: ['userId'] },
            { fields: ['bookingId'] },
            { fields: ['documentType'] },
            { fields: ['verificationStatus'] },
        ],
    });

    // Rename method to avoid collision with 'isExpired' attribute
    PatientDocument.prototype.hasExpired = function() {
        if (!this.expiryDate) return false;
        return new Date(this.expiryDate) < new Date();
    };

    PatientDocument.associate = (models) => {
        PatientDocument.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        PatientDocument.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
    };

    return PatientDocument;
};