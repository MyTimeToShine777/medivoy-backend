'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const EmailConfirmation = sequelize.define('EmailConfirmation', {
        confirmationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique confirmation identifier'
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId'
            },
            onDelete: 'CASCADE',
            comment: 'User reference'
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Email to confirm'
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Confirmation token'
        },
        tokenHash: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Hashed token for security'
        },
        purpose: {
            type: DataTypes.ENUM('registration', 'email_change', 'verification'),
            defaultValue: 'registration',
            comment: 'Confirmation purpose'
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Token used flag'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'Token expiry'
        },
        confirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Confirmation timestamp'
        },
        ipAddress: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Confirmation IP'
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Verification attempts'
        }
    }, {
        timestamps: true,
        tableName: 'email_confirmations',
        indexes: [
            { fields: ['userId'] },
            { fields: ['token'] },
            { fields: ['email'] },
            { fields: ['isUsed'] },
            { fields: ['expiresAt'] }
        ],
        comment: 'Email confirmation tokens'
    });

    return EmailConfirmation;
};