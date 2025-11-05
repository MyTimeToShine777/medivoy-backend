/**
 * AuditLog Model
 * Tracks all system activities and changes for security and compliance
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define(
  'AuditLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Action performed (create, update, delete, login, etc.)',
    },
    action_type: {
      type: DataTypes.ENUM(
        'create',
        'read',
        'update',
        'delete',
        'login',
        'logout',
        'access',
        'export',
        'import',
        'other'
      ),
      allowNull: false,
      defaultValue: 'other',
    },
    entity_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Type of entity affected (user, patient, booking, etc.)',
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the affected entity',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Human-readable description of the action',
    },
    old_values: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Previous values before change',
    },
    new_values: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'New values after change',
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of the user',
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Browser/device information',
    },
    request_method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'HTTP method (GET, POST, PUT, DELETE)',
    },
    request_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'API endpoint accessed',
    },
    request_body: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Request payload (sensitive data excluded)',
    },
    response_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'HTTP response status code',
    },
    response_time_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Response time in milliseconds',
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'low',
    },
    status: {
      type: DataTypes.ENUM('success', 'failure', 'warning'),
      allowNull: false,
      defaultValue: 'success',
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Error message if action failed',
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'User session identifier',
    },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Geographic location data',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional audit metadata',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'audit_logs',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['action'],
      },
      {
        fields: ['action_type'],
      },
      {
        fields: ['entity_type', 'entity_id'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['severity'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['ip_address'],
      },
    ],
  }
);

module.exports = AuditLog;
