/**
 * Booking Model - COMPLETE
 * 16 booking statuses: inquiry → lead_assigned → consultation → medical → quote → payment → travel → treatment → completed/cancelled
 * Status: Production-Ready
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    treatmentId: {
      type: DataTypes.UUID,
      references: { model: 'Treatments', key: 'id' },
    },
    hospitalId: {
      type: DataTypes.UUID,
      references: { model: 'Hospitals', key: 'id' },
    },
    doctorId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },

    // 16 BOOKING STATUSES
    status: {
      type: DataTypes.ENUM(
        'inquiry', // 1. Initial inquiry
        'lead_assigned', // 2. Sales team assigned
        'consultation_scheduled', // 3. Consultation booked
        'consultation_completed', // 4. Consultation done
        'medical_review_pending', // 5. Awaiting medical review
        'medical_approved', // 6. Approved by medical team
        'medical_rejected', // 7. Rejected by medical team
        'quote_generated', // 8. Cost estimate ready
        'quote_accepted', // 9. Patient accepted quote
        'quote_rejected', // 10. Patient rejected quote
        'payment_pending', // 11. Waiting for payment
        'payment_received', // 12. Payment confirmed
        'travel_arranged', // 13. Travel arrangements made
        'treatment_scheduled', // 14. Treatment date confirmed
        'completed', // 15. Treatment completed
        'cancelled', // 16. Booking cancelled
      ),
      defaultValue: 'inquiry',
    },

    // Medical Information
    medicalHistory: DataTypes.TEXT,
    pastTreatments: DataTypes.JSON,
    allergies: DataTypes.TEXT,
    currentMedications: DataTypes.JSON,

    // Sales Coordination
    salesCoordinatorId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    salesNotes: DataTypes.TEXT,
    consultationDate: DataTypes.DATE,

    // Medical Review
    medicalReviewerId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    medicalReviewNotes: DataTypes.TEXT,
    estimatedCost: {
      type: DataTypes.DECIMAL(12, 2),
      validate: { min: 0 },
    },
    costCurrency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },

    // Quotation
    quoteGeneratedAt: DataTypes.DATE,
    quoteValidUntil: DataTypes.DATE,
    quoteAcceptedAt: DataTypes.DATE,

    // Payment
    paymentMethod: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'wallet', 'insurance'),
    },
    paymentReference: DataTypes.STRING,
    paidAmount: {
      type: DataTypes.DECIMAL(12, 2),
      validate: { min: 0 },
    },
    paidAt: DataTypes.DATE,
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },

    // Travel
    departureDate: DataTypes.DATE,
    returnDate: DataTypes.DATE,
    flightBooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hotelBooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    visaRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    travelNotes: DataTypes.TEXT,

    // Treatment
    treatmentDate: DataTypes.DATE,
    treatmentTime: DataTypes.STRING,
    treatmentLocation: DataTypes.STRING,
    treatmentDuration: DataTypes.STRING,
    treatmentOutcome: DataTypes.TEXT,

    // Feedback
    ratings: {
      type: DataTypes.JSON,
      defaultValue: { medical: 0, facility: 0, staff: 0, overall: 0 },
    },
    feedback: DataTypes.TEXT,
    recommendations: DataTypes.TEXT,

    // Audit
    createdBy: DataTypes.UUID,
    updatedBy: DataTypes.UUID,
    cancellationReason: DataTypes.TEXT,
    cancelledAt: DataTypes.DATE,
    cancelledBy: DataTypes.UUID,

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
      { fields: ['bookingNumber'], unique: true },
      { fields: ['patientId'] },
      { fields: ['status'] },
      { fields: ['hospitalId'] },
      { fields: ['createdAt'] },
    ],
  },
);

module.exports = Booking;
