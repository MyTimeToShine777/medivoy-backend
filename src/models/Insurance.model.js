const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Insurance = sequelize.define('Insurance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  provider_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  plan_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  plan_type: {
    type: DataTypes.ENUM('basic', 'comprehensive', 'premium'),
    allowNull: false
  },
  coverage_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  premium_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  coverage_details: {
    type: DataTypes.JSONB
  },
  contact_email: {
    type: DataTypes.STRING(255)
  },
  contact_phone: {
    type: DataTypes.STRING(20)
  },
  logo: {
    type: DataTypes.TEXT
  },
  website: {
    type: DataTypes.TEXT
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_popular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'insurance_providers',
  timestamps: true,
  underscored: true
});

module.exports = Insurance;