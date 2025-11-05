const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BookingStatus = sequelize.define(
  'BookingStatus',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Bookings',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
        'refunded'
      ),
      defaultValue: 'pending',
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    coordinatorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'BookingStatuses',
    timestamps: true,
    paranoid: true,
  }
);

module.exports = BookingStatus;
