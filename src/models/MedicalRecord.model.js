const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'patients', key: 'id' }
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    references: { model: 'appointments', key: 'id' }
  },
  record_type: {
    type: DataTypes.STRING(50)
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  file_url: {
    type: DataTypes.TEXT
  },
  file_size: {
    type: DataTypes.INTEGER
  },
  file_type: {
    type: DataTypes.STRING(50)
  },
  uploaded_by_user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  record_date: {
    type: DataTypes.DATEONLY
  },
  is_shared_with_doctors: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'medical_records',
  timestamps: true,
  underscored: true
});

module.exports = MedicalRecord;