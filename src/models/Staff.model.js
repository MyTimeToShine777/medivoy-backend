/**
 * Staff Model
 * Represents staff members (coordinators, administrators, support staff)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Staff = sequelize.define(
  'Staff',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    staff_type: {
      type: DataTypes.ENUM(
        'coordinator',
        'administrator',
        'support',
        'manager',
        'medical_staff'
      ),
      allowNull: false,
      defaultValue: 'support',
    },
    employee_id: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    hospital_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hospitals',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    specialization: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    qualifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    date_of_joining: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employment_status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'terminated'),
      allowNull: false,
      defaultValue: 'active',
    },
    work_schedule: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Working hours and days',
    },
    assigned_regions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Countries/regions assigned to this staff member',
    },
    languages: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Languages spoken by staff',
    },
    contact_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    emergency_contact: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Emergency contact details',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Commission percentage for coordinators',
    },
    performance_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    total_bookings_handled: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_revenue_generated: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Custom permissions for this staff member',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    last_active_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'staff',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['hospital_id'],
      },
      {
        fields: ['staff_type'],
      },
      {
        fields: ['employment_status'],
      },
      {
        fields: ['employee_id'],
      },
    ],
  }
);

module.exports = Staff;
