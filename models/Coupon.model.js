const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  discount_type: {
    type: DataTypes.STRING(50),
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
  },
  min_purchase_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  max_discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  valid_from: {
    type: DataTypes.DATEONLY,
  },
  valid_until: {
    type: DataTypes.DATEONLY,
  },
  usage_limit: {
    type: DataTypes.INTEGER,
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
});

module.exports = Coupon;
