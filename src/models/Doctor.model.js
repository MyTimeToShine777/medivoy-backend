const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  specialty: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  qualification: {
    type: DataTypes.TEXT
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  bio: {
    type: DataTypes.TEXT
  },
  consultation_fee: {
    type: DataTypes.DECIMAL(10, 2)
  },
  languages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  availability_slots: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  is_available_teleconsult: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'doctors',
  timestamps: true,
  underscored: true
});

module.exports = Doctor;