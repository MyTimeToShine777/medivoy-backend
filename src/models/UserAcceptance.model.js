/**
 * UserAcceptance Model
 * Tracks user acceptance of terms and privacy policies
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAcceptance = sequelize.define('UserAcceptance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  document_type: {
    type: DataTypes.ENUM('terms_conditions', 'privacy_policy'),
    allowNull: false
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID of the terms or privacy policy document'
  },
  version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Version accepted'
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'user_acceptances',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'document_type', 'version'],
      unique: true
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['document_type', 'document_id']
    }
  ]
});

module.exports = UserAcceptance;