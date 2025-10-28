const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plan_id: {
    type: DataTypes.INTEGER,
    references: { model: 'subscription_plans', key: 'id' }
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    references: { model: 'hospitals', key: 'id' }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    references: { model: 'doctors', key: 'id' }
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  end_date: {
    type: DataTypes.DATEONLY
  },
  billing_cycle: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.STRING(50)
  },
  auto_renew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true
});

module.exports = Subscription;