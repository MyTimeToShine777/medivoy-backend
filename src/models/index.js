/**
 * Models Index - Complete Model Registry & Association Definitions
 * Handles both function and direct export patterns
 * Production-ready with comprehensive error handling
 */

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const logger = require('../utils/logger');

// ============================================================================
// HELPER FUNCTION TO LOAD MODELS (Handles both patterns)
// ============================================================================

/**
 * Load model whether it's a function or direct export
 * @param {string} modelPath - Path to the model file
 * @returns {Model} Sequelize model instance
 */
const loadModel = (modelPath) => {
  try {
    const modelExport = require(modelPath);

    // Check if it's already a Sequelize model
    if (
      modelExport &&
      modelExport.prototype &&
      modelExport.prototype.constructor.name === 'model'
    ) {
      return modelExport;
    }

    // If it's a function, call it with sequelize and DataTypes
    if (typeof modelExport === 'function') {
      try {
        // Try calling it as a function first
        const model = modelExport(sequelize, DataTypes);
        return model;
      } catch (funcError) {
        // If that fails, it might be a class constructor
        try {
          const model = new modelExport(sequelize, DataTypes);
          return model;
        } catch (classError) {
          // If both fail, log and throw
          logger.error(`Failed to initialize model from ${modelPath}`);
          logger.error('Function error:', funcError.message);
          logger.error('Class error:', classError.message);
          throw funcError;
        }
      }
    }

    // If it's an object with a default export
    if (modelExport && modelExport.default) {
      if (typeof modelExport.default === 'function') {
        return modelExport.default(sequelize, DataTypes);
      }
      return modelExport.default;
    }

    // Otherwise, return as is (direct export)
    return modelExport;
  } catch (error) {
    logger.error(`Failed to load model from ${modelPath}:`, error.message);
    throw error;
  }
};

// ============================================================================
// ALTERNATIVE APPROACH - Direct loading with error handling
// ============================================================================

const loadModelSafe = (name, path) => {
  try {
    logger.info(`Loading model: ${name}`);
    const model = loadModel(path);
    if (!model) {
      logger.warn(`Model ${name} loaded but is null/undefined`);
    }
    return model;
  } catch (error) {
    logger.error(`Failed to load ${name}:`, error.message);
    // Return a placeholder to prevent crashes
    return null;
  }
};

// ============================================================================
// LOAD ALL MODELS
// ============================================================================

logger.info('Loading Sequelize models...');

// Core User models
const User = loadModelSafe('User', './User.model');
const Patient = loadModelSafe('Patient', './Patient.model');
const Doctor = loadModelSafe('Doctor', './Doctor.model');
const Staff = loadModelSafe('Staff', './Staff.model');

// Hospital models
const Hospital = loadModelSafe('Hospital', './Hospital.model');
const HospitalDoctor = loadModelSafe('HospitalDoctor', './HospitalDoctor.model');
const HospitalTreatment = loadModelSafe('HospitalTreatment', './HospitalTreatment.model');

// Treatment models
const Treatment = loadModelSafe('Treatment', './Treatment.model');
const TreatmentCategory = loadModelSafe('TreatmentCategory', './TreatmentCategory.model');
const TreatmentSubcategory = loadModelSafe('TreatmentSubcategory', './TreatmentSubcategory.model');
const Package = loadModelSafe('Package', './Package.model');

// Booking models
const Booking = loadModelSafe('Booking', './Booking.model');
const BookingStatusHistory = loadModelSafe('BookingStatusHistory', './BookingStatusHistory.model');
const Appointment = loadModelSafe('Appointment', './Appointment.model');

// Medical models
const MedicalRecord = loadModelSafe('MedicalRecord', './MedicalRecord.model');
const Prescription = loadModelSafe('Prescription', './Prescription.model');
const Laboratory = loadModelSafe('Laboratory', './Laboratory.model');
const LabTest = loadModelSafe('LabTest', './LabTest.model');

// Financial models
const Insurance = loadModelSafe('Insurance', './Insurance.model');
const Payment = loadModelSafe('Payment', './Payment.model');
const Invoice = loadModelSafe('Invoice', './Invoice.model');
const Coupon = loadModelSafe('Coupon', './Coupon.model');

// Subscription models
const SubscriptionPlan = loadModelSafe('SubscriptionPlan', './SubscriptionPlan.model');
const Subscription = loadModelSafe('Subscription', './Subscription.model');

// Communication models
const Notification = loadModelSafe('Notification', './Notification.model');
const ChatConversation = loadModelSafe('ChatConversation', './ChatConversation.model');
const ChatMessage = loadModelSafe('ChatMessage', './ChatMessage.model');
const VideoCall = loadModelSafe('VideoCall', './VideoCall.model');

// Support models
const SupportTicket = loadModelSafe('SupportTicket', './SupportTicket.model');
const Review = loadModelSafe('Review', './Review.model');
const FAQ = loadModelSafe('FAQ', './FAQ.model');

// Content models
const WebsiteContent = loadModelSafe('WebsiteContent', './WebsiteContent.model');
const Translation = loadModelSafe('Translation', './Translation.model');
const Media = loadModelSafe('Media', './Media.model');

// System models
const PasswordReset = loadModelSafe('PasswordReset', './PasswordReset.model');
const RefreshToken = loadModelSafe('RefreshToken', './RefreshToken.model');
const DoctorSchedule = loadModelSafe('DoctorSchedule', './DoctorSchedule.model');
const AuditLog = loadModelSafe('AuditLog', './AuditLog.model');
const SystemSettings = loadModelSafe('SystemSettings', './SystemSettings.model');
const Integration = loadModelSafe('Integration', './Integration.model');

// Additional models
const DNAKit = loadModelSafe('DNAKit', './DNAKit.model');
const TermsConditions = loadModelSafe('TermsConditions', './TermsConditions.model');
const PrivacyPolicy = loadModelSafe('PrivacyPolicy', './PrivacyPolicy.model');
const UserAcceptance = loadModelSafe('UserAcceptance', './UserAcceptance.model');

logger.info('✅ Model loading phase completed');

// ============================================================================
// DEFINE ASSOCIATIONS (After all models loaded)
// ============================================================================

const defineAssociations = () => {
  try {
    logger.info('Defining model associations...');

    // Check if critical models are loaded
    if (!User || !Patient || !Doctor) {
      logger.warn('⚠️ Critical models not loaded, skipping associations');
      return;
    }

    // ========== User Associations ==========

    if (User && Patient) {
      User.hasOne(Patient, {
        foreignKey: 'user_id',
        as: 'patientProfile',
        onDelete: 'CASCADE',
      });
      Patient.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    if (User && Doctor) {
      User.hasOne(Doctor, {
        foreignKey: 'user_id',
        as: 'doctorProfile',
        onDelete: 'CASCADE',
      });
      Doctor.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    if (User && Staff) {
      User.hasOne(Staff, {
        foreignKey: 'user_id',
        as: 'staffProfile',
        onDelete: 'CASCADE',
      });
      Staff.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    // User has many relations
    if (User && Notification) {
      User.hasMany(Notification, {
        foreignKey: 'user_id',
        as: 'notifications',
      });
      Notification.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    if (User && SupportTicket) {
      User.hasMany(SupportTicket, {
        foreignKey: 'user_id',
        as: 'tickets',
      });
      SupportTicket.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    if (User && RefreshToken) {
      User.hasMany(RefreshToken, {
        foreignKey: 'user_id',
        as: 'refreshTokens',
      });
      RefreshToken.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    if (User && PasswordReset) {
      User.hasMany(PasswordReset, {
        foreignKey: 'user_id',
        as: 'passwordResets',
      });
      PasswordReset.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    if (User && AuditLog) {
      User.hasMany(AuditLog, {
        foreignKey: 'user_id',
        as: 'auditLogs',
      });
      AuditLog.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }

    // Chat associations
    if (User && ChatConversation) {
      User.hasMany(ChatConversation, {
        foreignKey: 'participant_1_id',
        as: 'conversationsAsParticipant1',
      });
      User.hasMany(ChatConversation, {
        foreignKey: 'participant_2_id',
        as: 'conversationsAsParticipant2',
      });
      ChatConversation.belongsTo(User, {
        foreignKey: 'participant_1_id',
        as: 'participant1',
      });
      ChatConversation.belongsTo(User, {
        foreignKey: 'participant_2_id',
        as: 'participant2',
      });
    }

    if (User && ChatMessage) {
      User.hasMany(ChatMessage, {
        foreignKey: 'sender_id',
        as: 'sentMessages',
      });
      ChatMessage.belongsTo(User, {
        foreignKey: 'sender_id',
        as: 'sender',
      });
    }

    // Video call associations
    if (User && VideoCall) {
      User.hasMany(VideoCall, {
        foreignKey: 'host_id',
        as: 'hostedCalls',
      });
      User.hasMany(VideoCall, {
        foreignKey: 'participant_id',
        as: 'participatedCalls',
      });
      VideoCall.belongsTo(User, {
        foreignKey: 'host_id',
        as: 'host',
      });
      VideoCall.belongsTo(User, {
        foreignKey: 'participant_id',
        as: 'participant',
      });
    }

    // Media associations
    if (User && Media) {
      User.hasMany(Media, {
        foreignKey: 'uploaded_by',
        as: 'uploads',
      });
      Media.belongsTo(User, {
        foreignKey: 'uploaded_by',
        as: 'uploadedBy',
      });
    }

    // ========== Patient Associations ==========

    if (Patient && Insurance) {
      Patient.belongsTo(Insurance, {
        foreignKey: 'insurance_id',
        as: 'insurance',
      });
      Insurance.hasMany(Patient, {
        foreignKey: 'insurance_id',
        as: 'patients',
      });
    }

    if (Patient && Appointment) {
      Patient.hasMany(Appointment, {
        foreignKey: 'patient_id',
        as: 'appointments',
      });
      Appointment.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && Booking) {
      Patient.hasMany(Booking, {
        foreignKey: 'patient_id',
        as: 'bookings',
      });
      Booking.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && MedicalRecord) {
      Patient.hasMany(MedicalRecord, {
        foreignKey: 'patient_id',
        as: 'medicalRecords',
      });
      MedicalRecord.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && Prescription) {
      Patient.hasMany(Prescription, {
        foreignKey: 'patient_id',
        as: 'prescriptions',
      });
      Prescription.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && LabTest) {
      Patient.hasMany(LabTest, {
        foreignKey: 'patient_id',
        as: 'labTests',
      });
      LabTest.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && Payment) {
      Patient.hasMany(Payment, {
        foreignKey: 'patient_id',
        as: 'payments',
      });
      Payment.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && Review) {
      Patient.hasMany(Review, {
        foreignKey: 'patient_id',
        as: 'reviews',
      });
      Review.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && DNAKit) {
      Patient.hasMany(DNAKit, {
        foreignKey: 'patient_id',
        as: 'dnaKits',
      });
      DNAKit.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    if (Patient && Subscription) {
      Patient.hasMany(Subscription, {
        foreignKey: 'patient_id',
        as: 'subscriptions',
      });
      Subscription.belongsTo(Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }

    // ========== Doctor Associations ==========

    if (Doctor && Appointment) {
      Doctor.hasMany(Appointment, {
        foreignKey: 'doctor_id',
        as: 'appointments',
      });
      Appointment.belongsTo(Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
      });
    }

    if (Doctor && Prescription) {
      Doctor.hasMany(Prescription, {
        foreignKey: 'doctor_id',
        as: 'prescriptions',
      });
      Prescription.belongsTo(Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
      });
    }

    if (Doctor && LabTest) {
      Doctor.hasMany(LabTest, {
        foreignKey: 'doctor_id',
        as: 'labTests',
      });
      LabTest.belongsTo(Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
      });
    }

    if (Doctor && Review) {
      Doctor.hasMany(Review, {
        foreignKey: 'doctor_id',
        as: 'reviews',
      });
      Review.belongsTo(Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
      });
    }

    if (Doctor && DoctorSchedule) {
      Doctor.hasMany(DoctorSchedule, {
        foreignKey: 'doctor_id',
        as: 'schedules',
      });
      DoctorSchedule.belongsTo(Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
      });
    }

    // Doctor-Hospital many-to-many
    if (Doctor && Hospital && HospitalDoctor) {
      Doctor.belongsToMany(Hospital, {
        through: HospitalDoctor,
        foreignKey: 'doctor_id',
        otherKey: 'hospital_id',
        as: 'hospitals',
      });
      Hospital.belongsToMany(Doctor, {
        through: HospitalDoctor,
        foreignKey: 'hospital_id',
        otherKey: 'doctor_id',
        as: 'doctors',
      });
    }

    // ========== Treatment Associations ==========

    if (Treatment && TreatmentCategory) {
      Treatment.belongsTo(TreatmentCategory, {
        foreignKey: 'category_id',
        as: 'category',
      });
      TreatmentCategory.hasMany(Treatment, {
        foreignKey: 'category_id',
        as: 'treatments',
      });
    }

    // Treatment-Hospital many-to-many
    if (Treatment && Hospital && HospitalTreatment) {
      Treatment.belongsToMany(Hospital, {
        through: HospitalTreatment,
        foreignKey: 'treatment_id',
        otherKey: 'hospital_id',
        as: 'hospitals',
      });
      Hospital.belongsToMany(Treatment, {
        through: HospitalTreatment,
        foreignKey: 'hospital_id',
        otherKey: 'treatment_id',
        as: 'treatments',
      });
    }

    // ========== Booking Associations ==========

    if (Booking && BookingStatusHistory) {
      Booking.hasMany(BookingStatusHistory, {
        foreignKey: 'booking_id',
        as: 'statusHistory',
      });
      BookingStatusHistory.belongsTo(Booking, {
        foreignKey: 'booking_id',
        as: 'booking',
      });
    }

    if (Booking && Treatment) {
      Booking.belongsTo(Treatment, {
        foreignKey: 'treatment_id',
        as: 'treatment',
      });
      Treatment.hasMany(Booking, {
        foreignKey: 'treatment_id',
        as: 'bookings',
      });
    }

    if (Booking && Hospital) {
      Booking.belongsTo(Hospital, {
        foreignKey: 'hospital_id',
        as: 'hospital',
      });
      Hospital.hasMany(Booking, {
        foreignKey: 'hospital_id',
        as: 'bookings',
      });
    }

    if (Booking && Doctor) {
      Booking.belongsTo(Doctor, {
        foreignKey: 'assigned_doctor_id',
        as: 'assignedDoctor',
      });
    }

    if (Booking && Invoice) {
      Booking.hasMany(Invoice, {
        foreignKey: 'booking_id',
        as: 'invoices',
      });
      Invoice.belongsTo(Booking, {
        foreignKey: 'booking_id',
        as: 'booking',
      });
    }

    // ========== Financial Associations ==========

    if (Invoice && Payment) {
      Invoice.hasMany(Payment, {
        foreignKey: 'invoice_id',
        as: 'payments',
      });
      Payment.belongsTo(Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice',
      });
    }

    // ========== Subscription Associations ==========

    if (Subscription && SubscriptionPlan) {
      Subscription.belongsTo(SubscriptionPlan, {
        foreignKey: 'plan_id',
        as: 'plan',
      });
      SubscriptionPlan.hasMany(Subscription, {
        foreignKey: 'plan_id',
        as: 'subscriptions',
      });
    }

    logger.info('✅ All Sequelize model associations defined successfully');
  } catch (error) {
    logger.error('❌ Error defining model associations:', error.message);
    logger.error('Stack:', error.stack);
    // Don't throw - let the app continue without associations
  }
};

// Only define associations if sequelize is properly connected
if (sequelize) {
  defineAssociations();
} else {
  logger.warn('⚠️ Sequelize not initialized, skipping associations');
}

// ============================================================================
// EXPORT ALL MODELS AND UTILITIES
// ============================================================================

module.exports = {
  // Database instance
  sequelize,

  // Core User models
  User,
  Patient,
  Doctor,
  Staff,

  // Hospital models
  Hospital,
  HospitalDoctor,
  HospitalTreatment,

  // Treatment models
  Treatment,
  TreatmentCategory,
  TreatmentSubcategory,
  Package,

  // Booking models
  Booking,
  BookingStatusHistory,
  Appointment,

  // Medical models
  MedicalRecord,
  Prescription,
  Laboratory,
  LabTest,

  // Financial models
  Insurance,
  Payment,
  Invoice,
  Coupon,

  // Subscription models
  SubscriptionPlan,
  Subscription,

  // Communication models
  Notification,
  ChatConversation,
  ChatMessage,
  VideoCall,

  // Support models
  SupportTicket,
  Review,
  FAQ,

  // Content models
  WebsiteContent,
  Translation,
  Media,

  // System models
  PasswordReset,
  RefreshToken,
  DoctorSchedule,
  AuditLog,
  SystemSettings,
  Integration,

  // Additional models
  DNAKit,
  TermsConditions,
  PrivacyPolicy,
  UserAcceptance,

  // Utility functions
  loadModel,
  loadModelSafe,
  defineAssociations,
};

// Log final status
logger.info('📦 Models module initialized');
