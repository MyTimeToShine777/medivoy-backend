// Password Reset Model - Password reset token management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const PasswordReset = sequelize.define('PasswordReset', {
        resetId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique reset request identifier',
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

        // ========== TOKEN & SECURITY ==========
        token: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: 'Secure reset token',
        },
        tokenHash: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Hashed token for storage',
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'When token expires',
        },

        // ========== REQUEST DETAILS ==========
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true },
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        requestMethod: {
            type: DataTypes.ENUM('email', 'sms', 'app'),
            defaultValue: 'email',
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM('pending', 'used', 'expired', 'cancelled'),
            defaultValue: 'pending',
            index: true,
        },

        // ========== USAGE ==========
        usedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When token was used',
        },
        usedIpAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        newPasswordHash: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Hash of new password set',
        },

        // ========== ATTEMPTS ==========
        attemptCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        maxAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
        },
        lastAttemptAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastAttemptStatus: {
            type: DataTypes.ENUM('success', 'failed', 'invalid_token', 'expired'),
            allowNull: true,
        },

        // ========== VERIFICATION ==========
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verificationTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verificationMethod: {
            type: DataTypes.ENUM('email', 'otp', 'security_questions'),
            allowNull: true,
        },

        // ========== SECURITY QUESTIONS ==========
        securityQuestionsUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        securityAnswersCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

        // ========== OTP ==========
        otpGenerated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        otpSentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        otpVerifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        otpExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== NOTIFICATIONS ==========
        confirmationEmailSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailSentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        confirmationSmsSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        successNotificationSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== METADATA & SECURITY ==========
        isCompromised: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If token was compromised',
        },
        compromisedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for reset request',
        },

    }, {
        timestamps: true,
        tableName: 'password_resets',
        indexes: [
            { fields: ['userId'] },
            { unique: true, fields: ['token'] },
            { fields: ['status'] },
            { fields: ['expiresAt'] },
        ],
    });

    PasswordReset.prototype.isExpired = function() {
        return new Date(this.expiresAt) < new Date();
    };

    PasswordReset.prototype.isValid = function() {
        return this.status === 'pending' && !this.isExpired() && this.attemptCount < this.maxAttempts;
    };

    PasswordReset.prototype.canResetPassword = function() {
        return this.isValid() && this.isVerified;
    };

    PasswordReset.prototype.markAsUsed = function(ipAddress) {
        this.status = 'used';
        this.usedAt = new Date();
        this.usedIpAddress = ipAddress;
        return this.save();
    };

    PasswordReset.prototype.markAsExpired = function() {
        this.status = 'expired';
        return this.save();
    };

    PasswordReset.associate = (models) => {
        PasswordReset.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return PasswordReset;
};