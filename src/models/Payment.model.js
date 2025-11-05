const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_id: {
      type: DataTypes.STRING(100),
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    payment_method: {
      type: DataTypes.STRING(50),
    },
    payment_gateway: {
      type: DataTypes.STRING(50),
    },
    gateway_transaction_id: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending',
    },
    payment_date: {
      type: DataTypes.DATE,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    refund_date: {
      type: DataTypes.DATE,
    },
    metadata: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Payment;
