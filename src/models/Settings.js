'use strict';

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODEL - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

const Settings = sequelize.define('Settings', {
    settingsId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    settingType: {
        type: DataTypes.ENUM('general', 'email', 'sms', 'payment', 'security', 'notification', 'api', 'storage'),
        allowNull: false,
        index: true
    },
    settingKey: {
        type: DataTypes.STRING(255),
        allowNull: true,
        index: true
    },
    settingValue: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    settingData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dataType: {
        type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array', 'object'),
        defaultValue: 'string'
    },
    isEncrypted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        index: true
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    validationRules: {
        type: DataTypes.JSON,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    version: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'settings',
    timestamps: true,
    // Use underscored column names to match existing DB migrations/schema
    // (maps camelCase attributes to snake_case column names)
    underscored: true,
    indexes: [
        // Use snake_case column names to match the actual DB columns when
        // `underscored: true` is enabled globally/for this model. Using the
        // attribute names here caused Sequelize to emit index SQL with
        // camelCase names which don't exist in the DB.
        { fields: ['setting_type', 'setting_key'], unique: true }
    ]
});

export default Settings;