'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Session = sequelize.define('Session', {
        sessionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique session identifier'
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
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            comment: 'Session token'
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Refresh token'
        },
        ipAddress: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Login IP address'
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Browser user agent'
        },
        deviceInfo: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Device information'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Session active status'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'Session expiry'
        },
        lastActivityAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: 'Last activity timestamp'
        },
        loggedOutAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Logout timestamp'
        }
    }, {
        timestamps: true,
        tableName: 'sessions',
        indexes: [
            { fields: ['userId'] },
            { fields: ['token'] },
            { fields: ['isActive'] },
            { fields: ['expiresAt'] }
        ],
        comment: 'User session management'
    });

    return Session;
};