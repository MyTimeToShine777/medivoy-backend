const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  plan_type: {
    type: DataTypes.STRING(50),
  },
  target_user: {
    type: DataTypes.STRING(50),
  },
  price_monthly: {
    type: DataTypes.DECIMAL(10, 2),
  },
  price_yearly: {
    type: DataTypes.DECIMAL(10, 2),
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  features: {
    type: DataTypes.JSONB,
  },
  max_doctors: {
    type: DataTypes.INTEGER,
  },
  max_appointments_per_month: {
    type: DataTypes.INTEGER,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'subscription_plans',
  timestamps: true,
  underscored: true,
});

module.exports = SubscriptionPlan;
