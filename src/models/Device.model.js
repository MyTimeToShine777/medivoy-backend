'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Device = sequelize.define('Device', {
        deviceId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique device identifier'
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
        deviceName: {
            type: DataTypes.STRING(150),
            allowNull: true,
            comment: 'Device name'
        },
        deviceType: {
            type: DataTypes.ENUM('mobile', 'tablet', 'desktop', 'other'),
            allowNull: false,
            comment: 'Device type'
        },
        deviceFingerprint: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
            comment: 'Unique device fingerprint'
        },
        browser: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Browser name'
        },
        browserVersion: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Browser version'
        },
        os: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Operating system'
        },
        osVersion: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'OS version'
        },
        ipAddress: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Last known IP'
        },
        location: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Geolocation data'
        },
        isTrusted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Trusted device flag'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Device active status'
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: 'Last login timestamp'
        },
        loginCount: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: 'Total login count'
        }
    }, {
        timestamps: true,
        tableName: 'devices',
        indexes: [
            { fields: ['userId'] },
            { fields: ['deviceFingerprint'] },
            { fields: ['isTrusted'] }
        ],
        comment: 'User device tracking'
    });

    return Device;
};