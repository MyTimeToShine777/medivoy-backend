const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoice_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: { model: 'bookings', key: 'id' },
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    references: { model: 'appointments', key: 'id' },
  },
  patient_id: {
    type: DataTypes.INTEGER,
    references: { model: 'patients', key: 'id' },
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    references: { model: 'hospitals', key: 'id' },
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  final_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  line_items: {
    type: DataTypes.JSONB,
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
  },
  due_date: {
    type: DataTypes.DATEONLY,
  },
  pdf_url: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'draft',
  },
}, {
  tableName: 'invoices',
  timestamps: true,
  underscored: true,
});

module.exports = Invoice;
