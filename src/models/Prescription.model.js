const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    references: { model: 'appointments', key: 'id' },
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'patients', key: 'id' },
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'doctors', key: 'id' },
  },
  medications: {
    type: DataTypes.JSONB,
  },
  instructions: {
    type: DataTypes.TEXT,
  },
  valid_until: {
    type: DataTypes.DATEONLY,
  },
  pdf_url: {
    type: DataTypes.TEXT,
  },
  is_dispensed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'prescriptions',
  timestamps: true,
  underscored: true,
});

module.exports = Prescription;
