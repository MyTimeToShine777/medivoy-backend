const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    title: {
      type: DataTypes.STRING(255),
    },
    message: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.STRING(50),
    },
    reference_type: {
      type: DataTypes.STRING(50),
    },
    reference_id: {
      type: DataTypes.INTEGER,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    channel: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Notification;
