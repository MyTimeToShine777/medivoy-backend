const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'patients', key: 'id' }
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    references: { model: 'hospitals', key: 'id' }
  },
  treatment_id: {
    type: DataTypes.INTEGER,
    references: { model: 'treatments', key: 'id' }
  },
  package_id: {
    type: DataTypes.INTEGER,
    references: { model: 'packages', key: 'id' }
  },
  booking_type: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'requested'
  },
  requested_date: {
    type: DataTypes.DATEONLY
  },
  confirmed_date: {
    type: DataTypes.DATEONLY
  },
  completion_date: {
    type: DataTypes.DATEONLY
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  payment_status: {
    type: DataTypes.STRING(50)
  },
  medical_details: {
    type: DataTypes.JSONB
  },
  quotation_details: {
    type: DataTypes.JSONB
  },
  travel_details: {
    type: DataTypes.JSONB
  },
  notes: {
    type: DataTypes.TEXT
  },
  coordinator_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true
});

module.exports = Booking;