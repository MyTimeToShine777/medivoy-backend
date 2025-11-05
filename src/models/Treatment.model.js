const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Treatment = sequelize.define(
  'Treatment',
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
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'treatment_categories',
        key: 'id',
      },
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'treatment_subcategories',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    duration_days: {
      type: DataTypes.INTEGER,
    },
    is_global: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    image: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'treatments',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Treatment;
