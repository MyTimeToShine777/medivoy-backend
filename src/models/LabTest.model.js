const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LabTest = sequelize.define(
  "LabTest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "patients", key: "id" },
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      references: { model: "doctors", key: "id" },
    },
    lab_id: {
      type: DataTypes.INTEGER,
      references: { model: "laboratories", key: "id" },
    },
    test_type: {
      type: DataTypes.STRING(100),
    },
    test_name: {
      type: DataTypes.STRING(255),
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.STRING(50),
    },
    result_url: {
      type: DataTypes.TEXT,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "lab_tests",
    timestamps: true,
    underscored: true,
  },
);

module.exports = LabTest;
