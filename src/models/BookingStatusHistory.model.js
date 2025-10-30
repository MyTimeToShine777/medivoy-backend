/**
 * BookingStatusHistory Model
 * Tracks all status changes for bookings with timestamps and reasons
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BookingStatusHistory = sequelize.define(
  "BookingStatusHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bookings",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    from_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Previous status",
    },
    to_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "New status",
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    changed_by_type: {
      type: DataTypes.ENUM("patient", "doctor", "staff", "admin", "system"),
      allowNull: false,
      defaultValue: "system",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Reason for status change",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Additional notes about the change",
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Additional metadata about the change",
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "booking_status_history",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ["booking_id"],
      },
      {
        fields: ["to_status"],
      },
      {
        fields: ["changed_by"],
      },
      {
        fields: ["created_at"],
      },
    ],
  },
);

module.exports = BookingStatusHistory;
