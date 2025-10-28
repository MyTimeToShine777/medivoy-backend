const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TreatmentSubcategory = sequelize.define('TreatmentSubcategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'treatment_categories',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  icon: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.TEXT
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'treatment_subcategories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['category_id', 'slug']
    }
  ]
});

module.exports = TreatmentSubcategory;