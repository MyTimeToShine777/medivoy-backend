const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  expires_at: {
    type: DataTypes.DATE,
  },
  is_revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true,
  updatedAt: false,
});

module.exports = RefreshToken;
