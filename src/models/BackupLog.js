'use strict';

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const BackupLog = sequelize.define('BackupLog', {
    backupId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    backupType: {
        type: DataTypes.ENUM('DATABASE', 'FILES'),
        defaultValue: 'DATABASE'
    },
    s3Url: DataTypes.STRING,
    s3Key: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'failed'),
        defaultValue: 'in_progress'
    },
    startedAt: DataTypes.DATE,
    completedAt: DataTypes.DATE,
    duration: DataTypes.INTEGER, // in milliseconds
    errorMessage: DataTypes.TEXT
}, {
    tableName: 'backup_logs',
    timestamps: true
});

export default BackupLog;