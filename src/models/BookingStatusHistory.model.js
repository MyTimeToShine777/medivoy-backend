/**
 * Booking Status History Model - COMPLETE
 * Audit trail for all booking status changes
 * Status: Production-Ready
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BookingStatusHistory = sequelize.define(
  'BookingStatusHistory',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Bookings', key: 'id' },
      onDelete: 'CASCADE',
    },
    oldStatus: {
      type: DataTypes.STRING,
    },
    newStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    changedBy: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    changeReason: DataTypes.TEXT,
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.TEXT,

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ['bookingId'] }, { fields: ['newStatus'] }, { fields: ['createdAt'] }],
  },
);

module.exports = BookingStatusHistory;
