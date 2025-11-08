'use strict';

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// ═══════════════════════════════════════════════════════════════════════════════
// BACKUP MODEL - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

const Backup = sequelize.define('Backup', {
    backupId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    backupName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        index: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    backupType: {
        type: DataTypes.ENUM('full', 'partial', 'automated', 'manual', 'incremental'),
        defaultValue: 'full',
        index: true
    },
    backupData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    backupSize: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    backupPath: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    backupLocation: {
        type: DataTypes.ENUM('local', 's3', 'azure', 'gcs', 'dropbox'),
        defaultValue: 'local'
    },
    status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'failed', 'verified', 'deleted'),
        defaultValue: 'in_progress',
        index: true
    },
    compressionMethod: {
        type: DataTypes.ENUM('none', 'gzip', 'bzip2', 'zip'),
        defaultValue: 'gzip'
    },
    encryptionMethod: {
        type: DataTypes.ENUM('none', 'aes-256-cbc', 'aes-256-gcm'),
        defaultValue: 'aes-256-cbc'
    },
    backupDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in seconds'
    },
    itemsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationDetails: {
        type: DataTypes.JSON,
        allowNull: true
    },
    retentionDays: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        index: true
    },
    restoredBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    restoredAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    restoreDetails: {
        type: DataTypes.JSON,
        allowNull: true
    },
    checksum: {
        type: DataTypes.STRING(255),
        allowNull: true
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
    tableName: 'backups',
    timestamps: true,
    indexes: [
        { fields: ['backupType', 'status'] },
        { fields: ['createdAt'] }
    ]
});

export default Backup;