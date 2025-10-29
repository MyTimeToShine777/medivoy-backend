/**
 * DoctorSchedule Model
 * Represents doctor availability schedules and time slots
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DoctorSchedule = sequelize.define('DoctorSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'doctors',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'hospitals',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  day_of_week: {
    type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  slot_duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    comment: 'Duration of each appointment slot in minutes'
  },
  max_patients_per_slot: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  consultation_type: {
    type: DataTypes.ENUM('in_person', 'video', 'both'),
    allowNull: false,
    defaultValue: 'both'
  },
  consultation_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  is_recurring: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether this schedule repeats weekly'
  },
  effective_from: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  effective_to: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'End date for this schedule (null means indefinite)'
  },
  break_start_time: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Break/lunch start time'
  },
  break_end_time: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Break/lunch end time'
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Specific location/room within hospital'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'doctor_schedules',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['doctor_id']
    },
    {
      fields: ['hospital_id']
    },
    {
      fields: ['day_of_week']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['effective_from', 'effective_to']
    }
  ]
});

module.exports = DoctorSchedule;