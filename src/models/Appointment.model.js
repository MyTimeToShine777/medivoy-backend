/**
 * Appointment Model - COMPLETE
 * 9 appointment statuses: scheduled → reminder_sent → in_progress → completed/cancelled/no_show/rescheduled/postponed/failed
 * Status: Production-Ready
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define(
  'Appointment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    appointmentNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    bookingId: {
      type: DataTypes.UUID,
      references: { model: 'Bookings', key: 'id' },
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    doctorId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    hospitalId: {
      type: DataTypes.UUID,
      references: { model: 'Hospitals', key: 'id' },
    },

    // 9 APPOINTMENT STATUSES
    status: {
      type: DataTypes.ENUM(
        'scheduled', // 1. Booked and confirmed
        'reminder_sent', // 2. Reminder notification sent
        'in_progress', // 3. Appointment ongoing
        'completed', // 4. Appointment finished
        'cancelled', // 5. Cancelled by patient/doctor
        'no_show', // 6. Patient didn't arrive
        'rescheduled', // 7. Moved to different date
        'postponed', // 8. Temporarily delayed
        'failed', // 9. Technical/system failure
      ),
      defaultValue: 'scheduled',
    },

    // Appointment Details
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startedAt: DataTypes.DATE,
    completedAt: DataTypes.DATE,

    type: {
      type: DataTypes.ENUM('consultation', 'surgery', 'follow_up', 'test', 'checkup'),
      defaultValue: 'consultation',
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 30,
    },

    // Appointment Notes
    notes: DataTypes.TEXT,
    medicalNotes: DataTypes.TEXT,
    prescriptions: DataTypes.JSON,
    testResults: DataTypes.JSON,

    // Reminders
    reminderSentAt: DataTypes.DATE,
    reminderType: DataTypes.ENUM('email', 'sms', 'both'),
    confirmationReceivedAt: DataTypes.DATE,
    confirmationMethod: DataTypes.ENUM('email', 'sms', 'phone', 'app'),

    // Cancellation
    cancelledBy: {
      type: DataTypes.ENUM('patient', 'doctor', 'system', 'admin'),
    },
    cancellationReason: DataTypes.TEXT,
    cancelledAt: DataTypes.DATE,
    cancellationNotes: DataTypes.TEXT,

    // Rescheduling
    rescheduledFrom: DataTypes.UUID,
    rescheduledAt: DataTypes.DATE,
    rescheduledReason: DataTypes.TEXT,

    // Postponement
    postponedUntil: DataTypes.DATE,
    postponementReason: DataTypes.TEXT,

    // Failure Details
    failureReason: DataTypes.TEXT,
    failedAt: DataTypes.DATE,

    // System Fields
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['appointmentNumber'], unique: true },
      { fields: ['patientId'] },
      { fields: ['doctorId'] },
      { fields: ['status'] },
      { fields: ['scheduledAt'] },
    ],
  },
);

module.exports = Appointment;
