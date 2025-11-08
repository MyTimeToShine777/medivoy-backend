// User Acceptance Model - Track user acceptance of policies and terms
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const UserAcceptance = sequelize.define('UserAcceptance', {
        acceptanceId: {
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

        // ========== ACCEPTANCE TYPE ==========
        acceptanceType: {
            type: DataTypes.ENUM(
                'terms_and_conditions',
                'privacy_policy',
                'cookie_policy',
                'marketing_consent',
                'data_sharing',
                'medical_consent',
                'service_terms',
                'cancellation_policy',
                'refund_policy',
                'other'
            ),
            allowNull: false,
            index: true,
        },

        // ========== DOCUMENT INFO ==========
        documentVersion: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Version of accepted document',
        },
        documentId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Reference to document',
        },

        // ========== ACCEPTANCE DETAILS ==========
        acceptedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('accepted', 'pending', 'rejected', 'withdrawn'),
            defaultValue: 'accepted',
        },

        // ========== TECHNICAL DETAILS ==========
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deviceInfo: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== SIGNATURE & VERIFICATION ==========
        isSigned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        signatureHash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== METADATA ==========
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'user_acceptances',
        indexes: [
            { fields: ['userId'] },
            { fields: ['acceptanceType'] },
            { fields: ['status'] },
            { fields: ['acceptedAt'] },
            { unique: true, fields: ['userId', 'acceptanceType'] },
        ],
    });

    UserAcceptance.prototype.isExpired = function() {
        if (!this.expiresAt) return false;
        return new Date(this.expiresAt) < new Date();
    };

    UserAcceptance.prototype.isValid = function() {
        return this.status === 'accepted' && !this.isExpired();
    };

    UserAcceptance.associate = (models) => {
        UserAcceptance.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return UserAcceptance;
};