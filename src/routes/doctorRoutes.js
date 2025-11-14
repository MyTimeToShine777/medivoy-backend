'use strict';

import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentController.js';
import PrescriptionController from '../controllers/PrescriptionController.js';
import PatientController from '../controllers/PatientController.js';
import ReviewController from '../controllers/ReviewController.js';
import MedicalRecordController from '../controllers/MedicalRecordController.js';
import LaboratoryController from '../controllers/LaboratoryController.js';
import UserController from '../controllers/UserController.js';
import ChatConversationController from '../controllers/ChatConversationController.js';
import HospitalDoctorController from '../controllers/HospitalDoctorController.js';
import LabReportController from '../controllers/LabReportController.js';
import ComorbidConditionController from '../controllers/ComorbidConditionController.js';
import ChatMessageController from '../controllers/ChatMessageController.js';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCTOR ROUTES - ULTRA-COMPREHENSIVE (70 ENDPOINTS)
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENT MANAGEMENT (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/appointments', (req, res) => AppointmentController.getUserAppointments(req, res));
router.get('/appointments/:appointmentId', (req, res) => AppointmentController.getAppointmentById(req, res));
router.post('/appointments/:appointmentId/start', (req, res) => AppointmentController.startConsultation(req, res));
router.post('/appointments/:appointmentId/end', (req, res) => AppointmentController.endConsultation(req, res));
router.post('/appointments/:doctorId/slots', (req, res) => AppointmentController.createSlots(req, res));
router.get('/appointments/status/:status', (req, res) => AppointmentController.getAppointmentsByStatus(req, res));
router.get('/appointments/today', (req, res) => AppointmentController.getTodayAppointments(req, res));
router.get('/appointments/upcoming', (req, res) => AppointmentController.getUpcomingAppointments(req, res));
router.put('/appointments/:appointmentId/status', (req, res) => AppointmentController.updateAppointmentStatus(req, res));
router.get('/appointments/filter', (req, res) => AppointmentController.filterAppointments(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/schedule/create', (req, res) => AppointmentController.createDoctorSchedule(req, res));
router.get('/schedule', (req, res) => AppointmentController.getDoctorSchedules(req, res));
router.get('/schedule/:scheduleId', (req, res) => AppointmentController.getScheduleById(req, res));
router.put('/schedule/:scheduleId/update', (req, res) => AppointmentController.updateDoctorSchedule(req, res));
router.delete('/schedule/:scheduleId/delete', (req, res) => AppointmentController.deleteSchedule(req, res));
router.get('/schedule/slots', (req, res) => AppointmentController.getAvailableSlots(req, res));
router.get('/schedule/slots/:slotId/details', (req, res) => AppointmentController.getSlotDetails(req, res));
router.post('/schedule/bulk-create', (req, res) => AppointmentController.bulkCreateSlots(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PRESCRIPTION MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/appointments/:appointmentId/prescription', (req, res) => PrescriptionController.createPrescription(req, res));
router.get('/prescriptions', (req, res) => PrescriptionController.getDoctorPrescriptions(req, res));
router.get('/prescriptions/:prescriptionId', (req, res) => PrescriptionController.getPrescriptionById(req, res));
router.put('/prescriptions/:prescriptionId', (req, res) => PrescriptionController.updatePrescription(req, res));
router.post('/prescriptions/:prescriptionId/revoke', (req, res) => PrescriptionController.revokePrescription(req, res));
router.get('/prescriptions/filter', (req, res) => PrescriptionController.filterPrescriptions(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/patients', (req, res) => PatientController.listPatients(req, res));
router.get('/patients/:patientId', (req, res) => PatientController.getPatientProfile(req, res));
router.get('/patients/:patientId/medical-history', (req, res) => PatientController.getPatientMedicalHistory(req, res));
router.post('/patients/:patientId/medical-history', (req, res) => PatientController.addPatientMedicalHistory(req, res));
router.get('/patients/:patientId/allergies', (req, res) => PatientController.getPatientAllergies(req, res));
router.post('/patients/:patientId/allergies', (req, res) => PatientController.addPatientAllergy(req, res));
router.get('/patients/:patientId/appointments', (req, res) => PatientController.getPatientAppointments(req, res));
router.post('/patients/:patientId/notes', (req, res) => PatientController.addPatientNotes(req, res));
router.get('/patients/search', (req, res) => PatientController.searchPatients(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// MEDICAL RECORDS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/medical-records', (req, res) => MedicalRecordController.createMedicalRecord(req, res));
router.get('/medical-records/:recordId', (req, res) => MedicalRecordController.getMedicalRecordById(req, res));
router.get('/medical-records', (req, res) => MedicalRecordController.getUserMedicalRecords(req, res));
router.put('/medical-records/:recordId', (req, res) => MedicalRecordController.updateMedicalRecord(req, res));
router.post('/medical-records/:recordId/share', (req, res) => MedicalRecordController.shareMedicalRecord(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// LABORATORY ORDERS (2 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/laboratory/order', (req, res) => LaboratoryController.orderLabTest(req, res));
router.get('/laboratory/result/:resultId', (req, res) => LaboratoryController.getLabResult(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS & RATINGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/reviews', (req, res) => ReviewController.getMedicalReviewsForDoctor(req, res));
router.get('/reviews/statistics', (req, res) => ReviewController.getReviewStatistics(req, res));
router.post('/reviews/:reviewId/response', (req, res) => ReviewController.respondToReview(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE & ACCOUNT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/profile', (req, res) => UserController.getUserProfile(req, res));
router.put('/profile', (req, res) => UserController.updateUserProfile(req, res));
router.post('/change-password', (req, res) => UserController.changePassword(req, res));
router.post('/profile/avatar/upload', (req, res) => UserController.uploadAvatar(req, res));
router.get('/profile/preferences', (req, res) => UserController.getUserPreferences(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT & MESSAGING (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/chat/conversations', (req, res) => ChatConversationController.getUserConversations(req, res));
router.get('/chat/conversations/:conversationId', (req, res) => ChatConversationController.getConversationById(req, res));
router.post('/chat/:conversationId/messages', (req, res) => ChatConversationController.addMessage(req, res));
router.get('/chat/:conversationId/messages', (req, res) => ChatConversationController.getMessages(req, res));
router.put('/chat/:conversationId/mark-read', (req, res) => ChatConversationController.markAsRead(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL & EARNINGS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/hospitals', (req, res) => HospitalDoctorController.getDoctorHospitals(req, res));
router.get('/earnings', (req, res) => HospitalDoctorController.getEarnings(req, res));
router.get('/earnings/breakdown', (req, res) => HospitalDoctorController.getEarningsBreakdown(req, res));
router.get('/statistics', (req, res) => HospitalDoctorController.getStatistics(req, res));
router.get('/performance', (req, res) => HospitalDoctorController.getPerformanceMetrics(req, res));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED DOCTOR FEATURES (12 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', (req, res) => LabReportController.createLabReport(req, res));
router.get('/lab-reports/patient/:patientId', (req, res) => LabReportController.getPatientReports(req, res));
router.put('/lab-reports/:reportId/results', (req, res) => LabReportController.updateReportResults(req, res));
router.put('/lab-reports/:reportId/status', (req, res) => LabReportController.updateReportStatus(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CONDITIONS MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/conditions/add', (req, res) => ComorbidConditionController.addCondition(req, res));
router.get('/conditions/patient/:patientId', (req, res) => ComorbidConditionController.getPatientConditions(req, res));
router.put('/conditions/:conditionId/update', (req, res) => ComorbidConditionController.updateCondition(req, res));
router.put('/conditions/:conditionId/status', (req, res) => ComorbidConditionController.updateConditionStatus(req, res));
router.get('/conditions/:conditionId', (req, res) => ComorbidConditionController.getConditionById(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/chat-messages/send', (req, res) => ChatMessageController.sendMessage(req, res));
router.get('/chat-messages/conversation/:conversationId', (req, res) => ChatMessageController.getConversationMessages(req, res));
router.put('/chat-messages/:messageId/read', (req, res) => ChatMessageController.markAsRead(req, res));

export default router;
