const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HospitalTreatment = sequelize.define(
  'HospitalTreatment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hospital_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'hospitals', key: 'id' },
      onDelete: 'CASCADE',
    },
    treatment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'treatments', key: 'id' },
      onDelete: 'CASCADE',
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    duration_days: {
      type: DataTypes.INTEGER,
    },
    success_rate: {
      type: DataTypes.DECIMAL(5, 2),
    },
    description: {
      type: DataTypes.TEXT,
    },
    inclusions: {
      type: DataTypes.JSONB,
    },
    exclusions: {
      type: DataTypes.JSONB,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'hospital_treatments',
    timestamps: true,
    underscored: true,
  }
);

module.exports = HospitalTreatment;
