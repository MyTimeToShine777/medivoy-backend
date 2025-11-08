'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// MODELS INDEX - COMPLETE & PRODUCTION READY
// All models initialized with proper associations
// ═══════════════════════════════════════════════════════════════════════════════

import { Sequelize, Op } from 'sequelize';
import sequelize from '../config/database.js';

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT ALL MODELS
// ═══════════════════════════════════════════════════════════════════════════════

// Auth & User Models
import User from './User.model.js';
import Profile from './Profile.model.js';
import Session from './Session.model.js';
import Device from './Device.model.js';
import AuditLog from './AuditLog.model.js';
import EmailConfirmation from './EmailConfirmation.model.js';
import PasswordReset from './PasswordReset.model.js';
import RefreshToken from './RefreshToken.model.js';
import UserAcceptance from './UserAcceptance.model.js';

// Healthcare Professionals
import Doctor from './Doctor.model.js';
import Patient from './Patient.model.js';
import DoctorSchedule from './DoctorSchedule.model.js';
import Department from './Department.model.js';

// Medical Records
import MedicalDocument from './MedicalDocument.model.js';
import MedicalRecord from './MedicalRecord.model.js';
import MedicalReview from './MedicalReview.model.js';
import Prescription from './Prescription.model.js';
import LabTest from './LabTest.model.js';
import Laboratory from './Laboratory.model.js';
import LabReport from './LabReport.model.js';
import PatientDocument from './PatientDocument.model.js';
import Document from './Document.model.js';

// Location Models
import Country from './Country.model.js';
import City from './City.model.js';
import Hospital from './Hospital.model.js';
import HospitalDoctor from './HospitalDoctor.model.js';

// Treatment & Package Models
import Treatment from './Treatment.model.js';
import TreatmentCategory from './TreatmentCategory.model.js';
import TreatmentSubcategory from './TreatmentSubcategory.model.js';
import Package from './Package.model.js';
import FeatureAddOn from './FeatureAddOn.model.js';

// Booking Models
import Booking from './Booking.model.js';
import BookingAddOn from './BookingAddOn.model.js';
import BookingPreferences from './BookingPreferences.model.js';
import BookingReview from './BookingReview.model.js';
import BookingStatusHistory from './BookingStatusHistory.model.js';

// Travel & Accommodation
import Accommodation from './Accommodation.model.js';
import Flight from './Flight.model.js';
import Train from './Train.model.js';
import TravelArrangement from './TravelArrangement.model.js';

// Appointments & Consultations
import Appointment from './Appointment.model.js';
import ExpertCall from './ExpertCall.model.js';
import Consultation from './Consultation.model.js';

// Payment Models
import Payment from './Payment.model.js';
import Transaction from './Transaction.model.js';
import Invoice from './Invoice.model.js';
import Refund from './Refund.model.js';
import Coupon from './Coupon.model.js';

// Communication Models
import Notification from './Notification.model.js';
import NotificationPreference from './NotificationPreference.model.js';
import ChatConversation from './ChatConversation.model.js';
import ChatMessage from './ChatMessage.model.js';
import EmailLog from './EmailLog.model.js';
import SMSLog from './SMSLog.model.js';

// Reviews & Ratings
import Review from './Review.model.js';
import Rating from './Rating.model.js';

// Insurance
import Insurance from './Insurance.model.js';
import InsuranceDocument from './InsuranceDocument.model.js';

// Other Models
import ComorbidCondition from './ComorbidCondition.model.js';
import Companion from './Companion.model.js';
import SupportTicket from './SupportTicket.model.js';
import FAQ from './FAQ.model.js';
import Subscription from './Subscription.model.js';
import SubscriptionPlan from './SubscriptionPlan.model.js';
import DNAKit from './DNAKit.model.js';
import GoogleMeetIntegration from './GoogleMeetIntegration.model.js';
import Media from './Media.model.js';
import Translation from './Translation.model.js';
import WebsiteContent from './WebsiteContent.model.js';
import PrivacyPolicy from './PrivacyPolicy.model.js';
import TermsConditions from './TermsConditions.model.js';
// BackupLog is defined as a model (BackupLog.js) rather than a factory function
import BackupLog from './BackupLog.js';
// Settings is defined directly as a model in Settings.js
import Settings from './Settings.js';

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZE MODELS
// ═══════════════════════════════════════════════════════════════════════════════

let models = null;
let isInitialized = false;

export const initializeModels = () => {
    if (isInitialized && models) {
        console.log('⚠️ Models already initialized');
        return models;
    }

    console.log('🔄 Initializing all models...');

    // Build models map dynamically with per-model error reporting
    models = {
        sequelize: sequelize,
        Sequelize: Sequelize,
        Op: Op
    };

    const entries = [
        ['User', User],
        ['Profile', Profile],
        ['Session', Session],
        ['Device', Device],
        ['AuditLog', AuditLog],
        ['EmailConfirmation', EmailConfirmation],
        ['PasswordReset', PasswordReset],
        ['RefreshToken', RefreshToken],
        ['UserAcceptance', UserAcceptance],
        ['Doctor', Doctor],
        ['Patient', Patient],
        ['DoctorSchedule', DoctorSchedule],
        ['Department', Department],
        ['MedicalDocument', MedicalDocument],
        ['MedicalRecord', MedicalRecord],
        ['MedicalReview', MedicalReview],
        ['Prescription', Prescription],
        ['LabTest', LabTest],
        ['Laboratory', Laboratory],
        ['LabReport', LabReport],
        ['PatientDocument', PatientDocument],
        ['Document', Document],
        ['Country', Country],
        ['City', City],
        ['Hospital', Hospital],
        ['HospitalDoctor', HospitalDoctor],
        ['Treatment', Treatment],
        ['TreatmentCategory', TreatmentCategory],
        ['TreatmentSubcategory', TreatmentSubcategory],
        ['Package', Package],
        ['FeatureAddOn', FeatureAddOn],
        ['Booking', Booking],
        ['BookingAddOn', BookingAddOn],
        ['BookingPreferences', BookingPreferences],
        ['BookingReview', BookingReview],
        ['BookingStatusHistory', BookingStatusHistory],
        ['Accommodation', Accommodation],
        ['Flight', Flight],
        ['Train', Train],
        ['TravelArrangement', TravelArrangement],
        ['Appointment', Appointment],
        ['ExpertCall', ExpertCall],
        ['Consultation', Consultation],
        ['Payment', Payment],
        ['Transaction', Transaction],
        ['Invoice', Invoice],
        ['Refund', Refund],
        ['Coupon', Coupon],
        ['Notification', Notification],
        ['NotificationPreference', NotificationPreference],
        ['ChatConversation', ChatConversation],
        ['ChatMessage', ChatMessage],
        ['EmailLog', EmailLog],
        ['SMSLog', SMSLog],
        ['Review', Review],
        ['Rating', Rating],
        ['Insurance', Insurance],
        ['InsuranceDocument', InsuranceDocument],
        ['ComorbidCondition', ComorbidCondition],
        ['Companion', Companion],
        ['SupportTicket', SupportTicket],
        ['FAQ', FAQ],
        ['Subscription', Subscription],
        ['SubscriptionPlan', SubscriptionPlan],
        ['DNAKit', DNAKit],
        ['GoogleMeetIntegration', GoogleMeetIntegration],
        ['Media', Media],
        ['Translation', Translation],
        ['WebsiteContent', WebsiteContent],
        ['PrivacyPolicy', PrivacyPolicy],
        ['TermsConditions', TermsConditions]
    ];

    for (const [name, factory] of entries) {
        try {
            // Distinguish model factory functions (expecting sequelize) from
            // Sequelize Model classes/instances which are also functions.
            if (typeof factory === 'function' && factory.length >= 1) {
                models[name] = factory(sequelize);
            } else {
                models[name] = factory;
            }
        } catch (err) {
            console.error(`❌ Failed to initialize model ${name}:`, err && err.message ? err.message : err);
            throw err;
        }
    }

    // Add ones that are already model instances
    models.BackupLog = BackupLog;
    models.Settings = Settings;

    // Normalize index field names for all models to use actual column names
    // (Sequelize sometimes emits index SQL using attribute names which don't
    // match the underscored column names in the DB). This converts any
    // index.fields entries that reference model attribute names into the
    // corresponding column `field` values (e.g. isActive -> is_active).
    const normalizeIndexes = () => {
        for (const key of Object.keys(models)) {
            const mdl = models[key];
            // only Sequelize models have 'rawAttributes' and 'options'
            if (!mdl || !mdl.rawAttributes || !mdl.options) continue;

            const idxs = mdl.options.indexes;
            if (!Array.isArray(idxs)) continue;

            for (const idx of idxs) {
                if (!Array.isArray(idx.fields)) continue;

                idx.fields = idx.fields.map(f => {
                    // field can be string or object like { attribute: 'name' }
                    if (typeof f === 'string') {
                        const attr = mdl.rawAttributes[f];
                        if (attr && attr.field) return attr.field;
                        // If attribute not found, assume it's already a column name
                        return f;
                    }

                    if (f && typeof f === 'object') {
                        if (f.attribute && mdl.rawAttributes[f.attribute]) {
                            return mdl.rawAttributes[f.attribute].field || f.attribute;
                        }
                        return f;
                    }

                    return f;
                });
            }
        }
    };

    try {
        normalizeIndexes();
        // Normalize references (foreign key targets) so that any `references.key`
        // that uses a model attribute name (camelCase) is replaced with the
        // actual DB column name (snake_case) when underscored is enabled.
        // This prevents Sequelize from emitting FK SQL that references a column
        // name that doesn't exist in the DB.
        const normalizeReferences = () => {
            const findModelByTableName = (tableName) => {
                for (const k of Object.keys(models)) {
                    const cand = models[k];
                    if (!cand || !cand.options) continue;
                    const tName = (cand.options.tableName || cand.tableName || '').toString();
                    if (!tName) continue;
                    if (tName.toLowerCase() === String(tableName).toLowerCase()) return cand;
                }
                return null;
            };

            for (const key of Object.keys(models)) {
                const mdl = models[key];
                if (!mdl || !mdl.rawAttributes) continue;

                for (const attrName of Object.keys(mdl.rawAttributes)) {
                    const attr = mdl.rawAttributes[attrName];
                    if (!attr || !attr.references || !attr.references.model) continue;

                    try {
                        const targetTable = attr.references.model;
                        const targetModel = findModelByTableName(targetTable);
                        // If the references.key is an attribute name on the target
                        // model, replace it with the actual DB column name (field).
                        if (targetModel && attr.references.key) {
                            const targetAttr = targetModel.rawAttributes[attr.references.key];
                            if (targetAttr && targetAttr.field) {
                                attr.references.key = targetAttr.field;
                            }
                        }

                        // If no key specified, default to the target model's primary
                        // key column name.
                        if (targetModel && !attr.references.key) {
                            const pk = Object.keys(targetModel.rawAttributes).find(a => targetModel.rawAttributes[a].primaryKey);
                            if (pk) {
                                attr.references.key = targetModel.rawAttributes[pk].field || pk;
                            }
                        }
                    } catch (e) {
                        // Non-fatal: continue with other attributes
                        // Log minimally to aid debugging if needed.
                        // console.warn('Reference normalization error for', key, attrName, e && e.message);
                    }
                }
            }
        };

        try {
            normalizeReferences();
        } catch (err) {
            console.warn('⚠️ Reference normalization failed:', err && err.message ? err.message : err);
        }
    } catch (err) {
        console.warn('⚠️ Index normalization failed:', err && err.message ? err.message : err);
    }

    // Setup associations
    setupAssociations(models);

    isInitialized = true;
    console.log('✅ All models initialized successfully');

    return models;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSOCIATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function setupAssociations(m) {
    console.log('🔗 Setting up model associations...');

    // ─────────────────────────────────────────────────────────────────────────
    // USER ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.User && m.Profile) {
        m.User.hasOne(m.Profile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
        m.Profile.belongsTo(m.User, { foreignKey: 'userId', as: 'user' });
    }

    if (m.User && m.Session) {
        m.User.hasMany(m.Session, { foreignKey: 'userId', as: 'sessions', onDelete: 'CASCADE' });
        m.Session.belongsTo(m.User, { foreignKey: 'userId', as: 'user' });
    }

    if (m.User && m.Device) {
        m.User.hasMany(m.Device, { foreignKey: 'userId', as: 'devices', onDelete: 'CASCADE' });
        m.Device.belongsTo(m.User, { foreignKey: 'userId', as: 'user' });
    }

    if (m.User && m.Doctor) {
        m.User.hasOne(m.Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
        m.Doctor.belongsTo(m.User, { foreignKey: 'userId', as: 'user' });
    }

    if (m.User && m.Patient) {
        m.User.hasOne(m.Patient, { foreignKey: 'userId', as: 'patientProfile' });
        m.Patient.belongsTo(m.User, { foreignKey: 'userId', as: 'user' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LOCATION ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.Country && m.City) {
        m.Country.hasMany(m.City, { foreignKey: 'countryId', as: 'cities' });
        m.City.belongsTo(m.Country, { foreignKey: 'countryId', as: 'country' });
    }

    if (m.City && m.Hospital) {
        m.City.hasMany(m.Hospital, { foreignKey: 'cityId', as: 'hospitals' });
        m.Hospital.belongsTo(m.City, { foreignKey: 'cityId', as: 'city' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TREATMENT & PACKAGE ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.Treatment && m.Package) {
        m.Treatment.hasMany(m.Package, { foreignKey: 'treatmentId', as: 'packages' });
        m.Package.belongsTo(m.Treatment, { foreignKey: 'treatmentId', as: 'treatment' });
    }

    if (m.Hospital && m.Package) {
        m.Hospital.hasMany(m.Package, { foreignKey: 'hospitalId', as: 'packages' });
        m.Package.belongsTo(m.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BOOKING ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.Patient && m.Booking) {
        m.Patient.hasMany(m.Booking, { foreignKey: 'patientId', as: 'bookings' });
        m.Booking.belongsTo(m.Patient, { foreignKey: 'patientId', as: 'patient' });
    }

    if (m.Booking && m.Treatment) {
        m.Booking.belongsTo(m.Treatment, { foreignKey: 'treatmentId', as: 'treatment' });
    }

    if (m.Booking && m.Hospital) {
        m.Booking.belongsTo(m.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
    }

    if (m.Booking && m.Package) {
        m.Booking.belongsTo(m.Package, { foreignKey: 'packageId', as: 'package' });
    }

    if (m.Booking && m.BookingAddOn) {
        m.Booking.hasMany(m.BookingAddOn, { foreignKey: 'bookingId', as: 'addOns', onDelete: 'CASCADE' });
        m.BookingAddOn.belongsTo(m.Booking, { foreignKey: 'bookingId', as: 'booking' });
    }

    if (m.BookingAddOn && m.FeatureAddOn) {
        m.BookingAddOn.belongsTo(m.FeatureAddOn, { foreignKey: 'featureId', as: 'feature' });
        m.FeatureAddOn.hasMany(m.BookingAddOn, { foreignKey: 'featureId', as: 'bookingAddOns' });
    }

    if (m.Booking && m.Accommodation) {
        m.Booking.hasMany(m.Accommodation, { foreignKey: 'bookingId', as: 'accommodations', onDelete: 'CASCADE' });
        m.Accommodation.belongsTo(m.Booking, { foreignKey: 'bookingId', as: 'booking' });
    }

    if (m.Booking && m.Companion) {
        m.Booking.hasMany(m.Companion, { foreignKey: 'bookingId', as: 'companions', onDelete: 'CASCADE' });
        m.Companion.belongsTo(m.Booking, { foreignKey: 'bookingId', as: 'booking' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // APPOINTMENT ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.Patient && m.Appointment) {
        m.Patient.hasMany(m.Appointment, { foreignKey: 'patientId', as: 'appointments' });
        m.Appointment.belongsTo(m.Patient, { foreignKey: 'patientId', as: 'patient' });
    }

    if (m.Doctor && m.Appointment) {
        m.Doctor.hasMany(m.Appointment, { foreignKey: 'doctorId', as: 'appointments' });
        m.Appointment.belongsTo(m.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
    }

    if (m.Booking && m.Appointment) {
        m.Booking.hasMany(m.Appointment, { foreignKey: 'bookingId', as: 'appointments' });
        m.Appointment.belongsTo(m.Booking, { foreignKey: 'bookingId', as: 'booking' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PAYMENT ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.Booking && m.Payment) {
        m.Booking.hasMany(m.Payment, { foreignKey: 'bookingId', as: 'payments' });
        m.Payment.belongsTo(m.Booking, { foreignKey: 'bookingId', as: 'booking' });
    }

    if (m.Payment && m.Transaction) {
        m.Payment.hasMany(m.Transaction, { foreignKey: 'paymentId', as: 'transactions' });
        m.Transaction.belongsTo(m.Payment, { foreignKey: 'paymentId', as: 'payment' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // COMMUNICATION ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.User && m.Notification) {
        m.User.hasMany(m.Notification, { foreignKey: 'userId', as: 'notifications' });
        m.Notification.belongsTo(m.User, { foreignKey: 'userId', as: 'user' });
    }

    if (m.ChatConversation && m.ChatMessage) {
        m.ChatConversation.hasMany(m.ChatMessage, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
        m.ChatMessage.belongsTo(m.ChatConversation, { foreignKey: 'conversationId', as: 'conversation' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MEDICAL RECORDS ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.Patient && m.ComorbidCondition) {
        m.Patient.hasMany(m.ComorbidCondition, { foreignKey: 'patientId', as: 'conditions', onDelete: 'CASCADE' });
        m.ComorbidCondition.belongsTo(m.Patient, { foreignKey: 'patientId', as: 'patient' });
    }

    if (m.Patient && m.LabReport) {
        m.Patient.hasMany(m.LabReport, { foreignKey: 'patientId', as: 'labReports' });
        m.LabReport.belongsTo(m.Patient, { foreignKey: 'patientId', as: 'patient' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RATING ASSOCIATIONS
    // ─────────────────────────────────────────────────────────────────────────
    if (m.Patient && m.Rating) {
        m.Patient.hasMany(m.Rating, { foreignKey: 'patientId', as: 'ratings' });
        m.Rating.belongsTo(m.Patient, { foreignKey: 'patientId', as: 'patient' });
    }

    if (m.Doctor && m.Rating) {
        m.Doctor.hasMany(m.Rating, { foreignKey: 'doctorId', as: 'ratings' });
        m.Rating.belongsTo(m.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
    }

    if (m.Hospital && m.Rating) {
        m.Hospital.hasMany(m.Rating, { foreignKey: 'hospitalId', as: 'ratings' });
        m.Rating.belongsTo(m.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
    }

    console.log('✅ All associations set up successfully');
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET MODELS
// ═══════════════════════════════════════════════════════════════════════════════

export const getModels = () => {
    if (!isInitialized || !models) {
        throw new Error('❌ Models not initialized. Call initializeModels() first in server.js');
    }
    return models;
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAMED EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
    sequelize,
    Sequelize,
    Op,
    // Auth & User
    User,
    Profile,
    Session,
    Device,
    AuditLog,
    EmailConfirmation,
    PasswordReset,
    RefreshToken,
    UserAcceptance,
    // Healthcare
    Doctor,
    Patient,
    DoctorSchedule,
    Department,
    // Medical Records
    MedicalDocument,
    MedicalRecord,
    MedicalReview,
    Prescription,
    LabTest,
    Laboratory,
    LabReport,
    PatientDocument,
    Document,
    // Location
    Country,
    City,
    Hospital,
    HospitalDoctor,
    // Treatment
    Treatment,
    TreatmentCategory,
    TreatmentSubcategory,
    Package,
    FeatureAddOn,
    // Booking
    Booking,
    BookingAddOn,
    BookingPreferences,
    BookingReview,
    BookingStatusHistory,
    // Travel
    Accommodation,
    Flight,
    Train,
    TravelArrangement,
    // Appointments
    Appointment,
    ExpertCall,
    Consultation,
    // Payment
    Payment,
    Transaction,
    Invoice,
    Refund,
    Coupon,
    // Communication
    Notification,
    NotificationPreference,
    ChatConversation,
    ChatMessage,
    EmailLog,
    SMSLog,
    // Reviews
    Review,
    Rating,
    // Insurance
    Insurance,
    InsuranceDocument,
    // Other
    ComorbidCondition,
    Companion,
    SupportTicket,
    FAQ,
    Subscription,
    SubscriptionPlan,
    DNAKit,
    GoogleMeetIntegration,
    Media,
    Translation,
    WebsiteContent,
    PrivacyPolicy,
    TermsConditions,
    BackupLog,
    Settings
};

export default {
    initializeModels,
    getModels
};