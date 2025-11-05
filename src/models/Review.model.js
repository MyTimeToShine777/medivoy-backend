const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      references: { model: 'patients', key: 'id' },
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      references: { model: 'doctors', key: 'id' },
    },
    hospital_id: {
      type: DataTypes.INTEGER,
      references: { model: 'hospitals', key: 'id' },
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      references: { model: 'appointments', key: 'id' },
    },
    booking_id: {
      type: DataTypes.INTEGER,
      references: { model: 'bookings', key: 'id' },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review_text: {
      type: DataTypes.TEXT,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Review;
