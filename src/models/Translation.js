'use strict';

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Translation = sequelize.define('Translation', {
    translationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true
    },
    language: {
        type: DataTypes.STRING(5),
        allowNull: false,
        index: true
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sourceValue: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    module: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'review_needed', 'approved'),
        defaultValue: 'pending'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: 'translations',
    timestamps: true
});

export default Translation;