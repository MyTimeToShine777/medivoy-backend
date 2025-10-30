const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Laboratory = sequelize.define(
  "Laboratory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    hospital_id: {
      type: DataTypes.INTEGER,
      references: { model: "hospitals", key: "id" },
    },
    type: {
      type: DataTypes.STRING(100),
    },
    country: {
      type: DataTypes.STRING(100),
    },
    city: {
      type: DataTypes.STRING(100),
    },
    address: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    services_offered: {
      type: DataTypes.JSONB,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "laboratories",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Laboratory;
