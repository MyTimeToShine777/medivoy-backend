const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HospitalDoctor = sequelize.define('HospitalDoctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'hospitals', key: 'id' },
    onDelete: 'CASCADE'
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'doctors', key: 'id' },
    onDelete: 'CASCADE'
  },
  department: {
    type: DataTypes.STRING(100)
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  end_date: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'hospital_doctors',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['hospital_id', 'doctor_id']
    }
  ]
});

module.exports = HospitalDoctor;