const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SupportTicket = sequelize.define(
  'SupportTicket',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    subject: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.STRING(100),
    },
    priority: {
      type: DataTypes.STRING(50),
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'open',
    },
    assigned_to_user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    sla_due_date: {
      type: DataTypes.DATE,
    },
    resolution_notes: {
      type: DataTypes.TEXT,
    },
    resolved_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'support_tickets',
    timestamps: true,
    underscored: true,
  }
);

module.exports = SupportTicket;
