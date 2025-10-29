/**
 * Models Index - Define all model associations
 */

const User = require('./User.model');
const Patient = require('./Patient.model');
const Doctor = require('./Doctor.model');
const Hospital = require('./Hospital.model');
const Treatment = require('./Treatment.model');
const TreatmentCategory = require('./TreatmentCategory.model');
const TreatmentSubcategory = require('./TreatmentSubcategory.model');
const Package = require('./Package.model');
const Booking = require('./Booking.model');
const Appointment = require('./Appointment.model');
const MedicalRecord = require('./MedicalRecord.model');
const Prescription = require('./Prescription.model');
const Laboratory = require('./Laboratory.model');
const LabTest = require('./LabTest.model');
const Insurance = require('./Insurance.model');
const Payment = require('./Payment.model');
const Invoice = require('./Invoice.model');
const Review = require('./Review.model');
const Notification = require('./Notification.model');
const SupportTicket = require('./SupportTicket.model');
const SubscriptionPlan = require('./SubscriptionPlan.model');
const Subscription = require('./Subscription.model');
const Translation = require('./Translation.model');
const Coupon = require('./Coupon.model');
const FAQ = require('./FAQ.model');
const WebsiteContent = require('./WebsiteContent.model');
const Media = require('./Media.model');
const PasswordReset = require('./PasswordReset.model');
const RefreshToken = require('./RefreshToken.model');
const HospitalDoctor = require('./HospitalDoctor.model');
const HospitalTreatment = require('./HospitalTreatment.model');
const Staff = require('./Staff.model');
const DoctorSchedule = require('./DoctorSchedule.model');
const ChatConversation = require('./ChatConversation.model');
const ChatMessage = require('./ChatMessage.model');
const VideoCall = require('./VideoCall.model');
const AuditLog = require('./AuditLog.model');
const SystemSettings = require('./SystemSettings.model');
const Integration = require('./Integration.model');
const DNAKit = require('./DNAKit.model');
const BookingStatusHistory = require('./BookingStatusHistory.model');
const TermsConditions = require('./TermsConditions.model');
const PrivacyPolicy = require('./PrivacyPolicy.model');
const UserAcceptance = require('./UserAcceptance.model');

// ============================================================================
// DEFINE ASSOCIATIONS
// ============================================================================

// User associations
User.hasOne(Patient, { foreignKey: 'user_id', as: 'patientProfile' });
User.hasOne(Doctor, { foreignKey: 'user_id', as: 'doctorProfile' });
User.hasOne(Staff, { foreignKey: 'user_id', as: 'staffProfile' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
User.hasMany(SupportTicket, { foreignKey: 'user_id', as: 'tickets' });
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
User.hasMany(PasswordReset, { foreignKey: 'user_id', as: 'passwordResets' });
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
User.hasMany(ChatConversation, { foreignKey: 'participant_1_id', as: 'conversationsAsParticipant1' });
User.hasMany(ChatConversation, { foreignKey: 'participant_2_id', as: 'conversationsAsParticipant2' });
User.hasMany(ChatMessage, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(VideoCall, { foreignKey: 'host_id', as: 'hostedCalls' });
User.hasMany(VideoCall, { foreignKey: 'participant_id', as: 'participatedCalls' });

// Patient associations
Patient.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Patient.belongsTo(Insurance, { foreignKey: 'insurance_id', as: 'insurance' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });
Patient.hasMany(Booking, { foreignKey: 'patient_id', as: 'bookings' });
Patient.hasMany(MedicalRecord, { foreignKey: 'patient_id', as: 'medicalRecords' });
Patient.hasMany(Prescription, { foreignKey: 'patient_id', as: 'prescriptions' });
Patient.hasMany(LabTest, { foreignKey: 'patient_id', as: 'labTests' });
Patient.hasMany(Payment, { foreignKey: 'patient_id', as: 'payments' });
Patient.hasMany(Review, { foreignKey: 'patient_id', as: 'reviews' });
Patient.hasMany(DNAKit, { foreignKey: 'patient_id', as: 'dnaKits' });

// Doctor associations
Doctor.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'appointments' });
Doctor.hasMany(Prescription, { foreignKey: 'doctor_id', as: 'prescriptions' });
Doctor.hasMany(LabTest, { foreignKey: 'doctor_id', as: 'labTests' });
Doctor.hasMany(Review, { foreignKey: 'doctor_id', as: 'reviews' });
Doctor.hasMany(DoctorSchedule, { foreignKey: 'doctor_id', as: 'schedules' });
Doctor.belongsToMany(Hospital, { through: HospitalDoctor, foreignKey: 'doctor_id', as: 'hospitals' });

// Hospital associations
Hospital.belongsTo(User, { foreignKey: 'admin_user_id', as: 'admin' });
Hospital.hasMany(Booking, { foreignKey: 'hospital_id', as: 'bookings' });
Hospital.hasMany(Laboratory, { foreignKey: 'hospital_id', as: 'laboratories' });
Hospital.hasMany(Review, { foreignKey: 'hospital_id', as: 'reviews' });
Hospital.hasMany(Invoice, { foreignKey: 'hospital_id', as: 'invoices' });
Hospital.belongsToMany(Doctor, { through: HospitalDoctor, foreignKey: 'hospital_id', as: 'doctors' });
Hospital.belongsToMany(Treatment, { through: HospitalTreatment, foreignKey: 'hospital_id', as: 'treatments' });

// Treatment associations
Treatment.belongsTo(TreatmentCategory, { foreignKey: 'category_id', as: 'category' });
Treatment.belongsTo(TreatmentSubcategory, { foreignKey: 'subcategory_id', as: 'subcategory' });
Treatment.hasMany(Booking, { foreignKey: 'treatment_id', as: 'bookings' });
Treatment.belongsToMany(Hospital, { through: HospitalTreatment, foreignKey: 'treatment_id', as: 'hospitals' });

// Treatment Category associations
TreatmentCategory.hasMany(TreatmentSubcategory, { foreignKey: 'category_id', as: 'subcategories' });
TreatmentCategory.hasMany(Treatment, { foreignKey: 'category_id', as: 'treatments' });

// Treatment Subcategory associations
TreatmentSubcategory.belongsTo(TreatmentCategory, { foreignKey: 'category_id', as: 'category' });
TreatmentSubcategory.hasMany(Treatment, { foreignKey: 'subcategory_id', as: 'treatments' });

// Package associations
Package.hasMany(Booking, { foreignKey: 'package_id', as: 'bookings' });

// Booking associations
Booking.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Booking.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
Booking.belongsTo(Treatment, { foreignKey: 'treatment_id', as: 'treatment' });
Booking.belongsTo(Package, { foreignKey: 'package_id', as: 'package' });
Booking.belongsTo(User, { foreignKey: 'coordinator_id', as: 'coordinator' });
Booking.hasMany(Appointment, { foreignKey: 'booking_id', as: 'appointments' });
Booking.hasMany(Payment, { foreignKey: 'booking_id', as: 'payments' });
Booking.hasMany(Invoice, { foreignKey: 'booking_id', as: 'invoices' });
Booking.hasMany(Review, { foreignKey: 'booking_id', as: 'reviews' });
Booking.hasMany(BookingStatusHistory, { foreignKey: 'booking_id', as: 'statusHistory' });
Booking.hasMany(ChatConversation, { foreignKey: 'booking_id', as: 'conversations' });

// Appointment associations
Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
Appointment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Appointment.hasMany(Prescription, { foreignKey: 'appointment_id', as: 'prescriptions' });
Appointment.hasMany(MedicalRecord, { foreignKey: 'appointment_id', as: 'medicalRecords' });
Appointment.hasMany(Payment, { foreignKey: 'appointment_id', as: 'payments' });
Appointment.hasMany(Invoice, { foreignKey: 'appointment_id', as: 'invoices' });
Appointment.hasMany(Review, { foreignKey: 'appointment_id', as: 'reviews' });
Appointment.hasMany(ChatConversation, { foreignKey: 'appointment_id', as: 'conversations' });
Appointment.hasMany(VideoCall, { foreignKey: 'appointment_id', as: 'videoCalls' });

// MedicalRecord associations
MedicalRecord.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
MedicalRecord.belongsTo(User, { foreignKey: 'uploaded_by_user_id', as: 'uploadedBy' });

// Prescription associations
Prescription.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

// Laboratory associations
Laboratory.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
Laboratory.hasMany(LabTest, { foreignKey: 'lab_id', as: 'labTests' });
Laboratory.hasMany(DNAKit, { foreignKey: 'laboratory_id', as: 'dnaKits' });

// LabTest associations
LabTest.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
LabTest.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
LabTest.belongsTo(Laboratory, { foreignKey: 'lab_id', as: 'laboratory' });

// Insurance associations
Insurance.hasMany(Patient, { foreignKey: 'insurance_id', as: 'patients' });

// Payment associations
Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Payment.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
Payment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

// Invoice associations
Invoice.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Invoice.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
Invoice.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Invoice.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });

// Review associations
Review.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Review.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
Review.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
Review.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
Review.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// SupportTicket associations
SupportTicket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
SupportTicket.belongsTo(User, { foreignKey: 'assigned_to_user_id', as: 'assignedTo' });

// Subscription associations
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id', as: 'plan' });
Subscription.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
Subscription.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

// SubscriptionPlan associations
SubscriptionPlan.hasMany(Subscription, { foreignKey: 'plan_id', as: 'subscriptions' });

// Media associations
Media.belongsTo(User, { foreignKey: 'uploaded_by_user_id', as: 'uploadedBy' });

// PasswordReset associations
PasswordReset.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// RefreshToken associations
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Junction table associations
HospitalDoctor.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
HospitalDoctor.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

HospitalTreatment.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
HospitalTreatment.belongsTo(Treatment, { foreignKey: 'treatment_id', as: 'treatment' });

// Staff associations
Staff.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Staff.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });

// DoctorSchedule associations
DoctorSchedule.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
DoctorSchedule.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });

// ChatConversation associations
ChatConversation.belongsTo(User, { foreignKey: 'participant_1_id', as: 'participant1' });
ChatConversation.belongsTo(User, { foreignKey: 'participant_2_id', as: 'participant2' });
ChatConversation.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
ChatConversation.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
ChatConversation.hasMany(ChatMessage, { foreignKey: 'conversation_id', as: 'messages' });
ChatConversation.hasMany(VideoCall, { foreignKey: 'conversation_id', as: 'videoCalls' });

// ChatMessage associations
ChatMessage.belongsTo(ChatConversation, { foreignKey: 'conversation_id', as: 'conversation' });
ChatMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
ChatMessage.belongsTo(ChatMessage, { foreignKey: 'reply_to_message_id', as: 'replyToMessage' });

// VideoCall associations
VideoCall.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
VideoCall.belongsTo(ChatConversation, { foreignKey: 'conversation_id', as: 'conversation' });
VideoCall.belongsTo(User, { foreignKey: 'host_id', as: 'host' });
VideoCall.belongsTo(User, { foreignKey: 'participant_id', as: 'participant' });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// SystemSettings associations
SystemSettings.belongsTo(User, { foreignKey: 'updated_by', as: 'updatedBy' });

// Integration associations
Integration.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });
Integration.belongsTo(User, { foreignKey: 'updated_by', as: 'updatedBy' });

// DNAKit associations
DNAKit.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
DNAKit.belongsTo(Laboratory, { foreignKey: 'laboratory_id', as: 'laboratory' });

// BookingStatusHistory associations
BookingStatusHistory.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
BookingStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

// TermsConditions associations
TermsConditions.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });
TermsConditions.belongsTo(User, { foreignKey: 'published_by', as: 'publishedBy' });

// PrivacyPolicy associations
PrivacyPolicy.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });
PrivacyPolicy.belongsTo(User, { foreignKey: 'published_by', as: 'publishedBy' });

// UserAcceptance associations
UserAcceptance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ============================================================================
// EXPORT ALL MODELS
// ============================================================================

module.exports = {
  User,
  Patient,
  Doctor,
  Hospital,
  Treatment,
  TreatmentCategory,
  TreatmentSubcategory,
  Package,
  Booking,
  Appointment,
  MedicalRecord,
  Prescription,
  Laboratory,
  LabTest,
  Insurance,
  Payment,
  Invoice,
  Review,
  Notification,
  SupportTicket,
  SubscriptionPlan,
  Subscription,
  Translation,
  Coupon,
  FAQ,
  WebsiteContent,
  Media,
  PasswordReset,
  RefreshToken,
  HospitalDoctor,
  HospitalTreatment,
  Staff,
  DoctorSchedule,
  ChatConversation,
  ChatMessage,
  VideoCall,
  AuditLog,
  SystemSettings,
  Integration,
  DNAKit,
  BookingStatusHistory,
  TermsConditions,
  PrivacyPolicy,
  UserAcceptance,
};
