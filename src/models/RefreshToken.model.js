// Refresh Token Model - JWT refresh token management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        tokenId: {
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

        // ========== TOKEN DETAILS ==========
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        tokenHash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        // ========== DEVICE & SESSION INFO ==========
        deviceId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deviceName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deviceType: {
            type: DataTypes.ENUM('web', 'ios', 'android', 'desktop'),
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== TOKEN USAGE ==========
        isUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        usedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        newTokenIssued: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== SECURITY ==========
        isRevoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        revokedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        revocationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isBlacklisted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM('active', 'used', 'expired', 'revoked', 'blacklisted'),
            defaultValue: 'active',
            index: true,
        },

    }, {
        timestamps: true,
        tableName: 'refresh_tokens',
        indexes: [
            { fields: ['userId'] },
            { unique: true, fields: ['token'] },
            { fields: ['expiresAt'] },
            { fields: ['status'] },
        ],
    });

    RefreshToken.prototype.isExpired = function() {
        return new Date(this.expiresAt) < new Date();
    };

    RefreshToken.prototype.isValid = function() {
        return this.status === 'active' && !this.isExpired() && !this.isRevoked;
    };

    RefreshToken.prototype.revoke = function(reason) {
        this.isRevoked = true;
        this.revokedAt = new Date();
        this.revocationReason = reason;
        this.status = 'revoked';
        return this.save();
    };

    RefreshToken.prototype.markAsUsed = function() {
        this.isUsed = true;
        this.usedAt = new Date();
        this.status = 'used';
        return this.save();
    };

    RefreshToken.associate = (models) => {
        RefreshToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return RefreshToken;
};