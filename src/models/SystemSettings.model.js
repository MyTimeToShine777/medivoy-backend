/**
 * SystemSettings Model
 * Stores system-wide configuration and settings
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemSettings = sequelize.define(
  'SystemSettings',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    setting_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Unique identifier for the setting',
    },
    setting_value: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Setting value (can be JSON string)',
    },
    setting_type: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
      allowNull: false,
      defaultValue: 'string',
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'general',
      comment: 'Setting category (general, email, payment, notification, etc.)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of what this setting does',
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this setting can be accessed publicly',
    },
    is_encrypted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the value is encrypted',
    },
    default_value: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Default value for this setting',
    },
    validation_rules: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Validation rules for this setting',
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'system_settings',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['setting_key'],
        unique: true,
      },
      {
        fields: ['category'],
      },
      {
        fields: ['is_public'],
      },
    ],
  }
);

module.exports = SystemSettings;
