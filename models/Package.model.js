const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
  },
  description: {
    type: DataTypes.TEXT,
  },
  duration_days: {
    type: DataTypes.INTEGER,
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  inclusions: {
    type: DataTypes.JSONB,
  },
  hospital_ids: {
    type: DataTypes.JSONB,
  },
  treatment_ids: {
    type: DataTypes.JSONB,
  },
  flights_included: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  accommodation_included: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  transfers_included: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  seasonal_pricing: {
    type: DataTypes.JSONB,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'packages',
  timestamps: true,
  underscored: true,
});

module.exports = Package;
