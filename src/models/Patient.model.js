const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },
    blood_group: {
      type: DataTypes.STRING(10),
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(100),
    },
    country: {
      type: DataTypes.STRING(100),
      defaultValue: "India",
    },
    emergency_contact_name: {
      type: DataTypes.STRING(100),
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(20),
    },
    insurance_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "insurance_providers",
        key: "id",
      },
    },
    insurance_policy_number: {
      type: DataTypes.STRING(100),
    },
    medical_history: {
      type: DataTypes.TEXT,
    },
    allergies: {
      type: DataTypes.JSONB,
    },
    current_medications: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "patients",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Patient;
