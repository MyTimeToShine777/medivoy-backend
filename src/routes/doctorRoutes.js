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

router.get('/appointments', AppointmentController.getUserAppointments.bind(AppointmentController));
router.get('/appointments/:appointmentId', AppointmentController.getAppointmentById.bind(AppointmentController));
router.post('/appointments/:appointmentId/start', AppointmentController.startConsultation.bind(AppointmentController));
router.post('/appointments/:appointmentId/end', AppointmentController.endConsultation.bind(AppointmentController));
router.post('/appointments/:doctorId/slots', AppointmentController.createSlots.bind(AppointmentController));
router.get('/appointments/status/:status', AppointmentController.getAppointmentsByStatus.bind(AppointmentController));
router.get('/appointments/today', AppointmentController.getTodayAppointments.bind(AppointmentController));
router.get('/appointments/upcoming', AppointmentController.getUpcomingAppointments.bind(AppointmentController));
router.put('/appointments/:appointmentId/status', AppointmentController.updateAppointmentStatus.bind(AppointmentController));
router.get('/appointments/filter', AppointmentController.filterAppointments.bind(AppointmentController));

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/schedule/create', AppointmentController.createDoctorSchedule.bind(AppointmentController));
router.get('/schedule', AppointmentController.getDoctorSchedules.bind(AppointmentController));
router.get('/schedule/:scheduleId', AppointmentController.getScheduleById.bind(AppointmentController));
router.put('/schedule/:scheduleId/update', AppointmentController.updateDoctorSchedule.bind(AppointmentController));
router.delete('/schedule/:scheduleId/delete', AppointmentController.deleteSchedule.bind(AppointmentController));
router.get('/schedule/slots', AppointmentController.getAvailableSlots.bind(AppointmentController));
router.get('/schedule/slots/:slotId/details', AppointmentController.getSlotDetails.bind(AppointmentController));
router.post('/schedule/bulk-create', AppointmentController.bulkCreateSlots.bind(AppointmentController));

// ─────────────────────────────────────────────────────────────────────────────
// PRESCRIPTION MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/appointments/:appointmentId/prescription', PrescriptionController.createPrescription.bind(PrescriptionController));
router.get('/prescriptions', PrescriptionController.getDoctorPrescriptions.bind(PrescriptionController));
router.get('/prescriptions/:prescriptionId', PrescriptionController.getPrescriptionById.bind(PrescriptionController));
router.put('/prescriptions/:prescriptionId', PrescriptionController.updatePrescription.bind(PrescriptionController));
router.post('/prescriptions/:prescriptionId/revoke', PrescriptionController.revokePrescription.bind(PrescriptionController));
router.get('/prescriptions/filter', PrescriptionController.filterPrescriptions.bind(PrescriptionController));

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/patients', PatientController.listPatients.bind(PatientController));
router.get('/patients/:patientId', PatientController.getPatientProfile.bind(PatientController));
router.get('/patients/:patientId/medical-history', PatientController.getPatientMedicalHistory.bind(PatientController));
router.post('/patients/:patientId/medical-history', PatientController.addPatientMedicalHistory.bind(PatientController));
router.get('/patients/:patientId/allergies', PatientController.getPatientAllergies.bind(PatientController));
router.post('/patients/:patientId/allergies', PatientController.addPatientAllergy.bind(PatientController));
router.get('/patients/:patientId/appointments', PatientController.getPatientAppointments.bind(PatientController));
router.post('/patients/:patientId/notes', PatientController.addPatientNotes.bind(PatientController));
router.get('/patients/search', PatientController.searchPatients.bind(PatientController));

// ─────────────────────────────────────────────────────────────────────────────
// MEDICAL RECORDS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/medical-records', MedicalRecordController.createMedicalRecord.bind(MedicalRecordController));
router.get('/medical-records/:recordId', MedicalRecordController.getMedicalRecordById.bind(MedicalRecordController));
router.get('/medical-records', MedicalRecordController.getUserMedicalRecords.bind(MedicalRecordController));
router.put('/medical-records/:recordId', MedicalRecordController.updateMedicalRecord.bind(MedicalRecordController));
router.post('/medical-records/:recordId/share', MedicalRecordController.shareMedicalRecord.bind(MedicalRecordController));

// ─────────────────────────────────────────────────────────────────────────────
// LABORATORY ORDERS (2 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/laboratory/order', LaboratoryController.orderLabTest.bind(LaboratoryController));
router.get('/laboratory/result/:resultId', LaboratoryController.getLabResult.bind(LaboratoryController));

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS & RATINGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/reviews', ReviewController.getMedicalReviewsForDoctor.bind(ReviewController));
router.get('/reviews/statistics', ReviewController.getReviewStatistics.bind(ReviewController));
router.post('/reviews/:reviewId/response', ReviewController.respondToReview.bind(ReviewController));

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE & ACCOUNT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/profile', UserController.getUserProfile.bind(UserController));
router.put('/profile', UserController.updateUserProfile.bind(UserController));
router.post('/change-password', UserController.changePassword.bind(UserController));
router.post('/profile/avatar/upload', UserController.uploadAvatar.bind(UserController));
router.get('/profile/preferences', UserController.getUserPreferences.bind(UserController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT & MESSAGING (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/chat/conversations', ChatConversationController.getUserConversations.bind(ChatConversationController));
router.get('/chat/conversations/:conversationId', ChatConversationController.getConversationById.bind(ChatConversationController));
router.post('/chat/:conversationId/messages', ChatConversationController.addMessage.bind(ChatConversationController));
router.get('/chat/:conversationId/messages', ChatConversationController.getMessages.bind(ChatConversationController));
router.put('/chat/:conversationId/mark-read', ChatConversationController.markAsRead.bind(ChatConversationController));

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL & EARNINGS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/hospitals', HospitalDoctorController.getDoctorHospitals.bind(HospitalDoctorController));
router.get('/earnings', HospitalDoctorController.getEarnings.bind(HospitalDoctorController));
router.get('/earnings/breakdown', HospitalDoctorController.getEarningsBreakdown.bind(HospitalDoctorController));
router.get('/statistics', HospitalDoctorController.getStatistics.bind(HospitalDoctorController));
router.get('/performance', HospitalDoctorController.getPerformanceMetrics.bind(HospitalDoctorController));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED DOCTOR FEATURES (12 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', LabReportController.createLabReport.bind(LabReportController));
router.get('/lab-reports/patient/:patientId', LabReportController.getPatientReports.bind(LabReportController));
router.put('/lab-reports/:reportId/results', LabReportController.updateReportResults.bind(LabReportController));
router.put('/lab-reports/:reportId/status', LabReportController.updateReportStatus.bind(LabReportController));

// ─────────────────────────────────────────────────────────────────────────────
// CONDITIONS MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/conditions/add', ComorbidConditionController.addCondition.bind(ComorbidConditionController));
router.get('/conditions/patient/:patientId', ComorbidConditionController.getPatientConditions.bind(ComorbidConditionController));
router.put('/conditions/:conditionId/update', ComorbidConditionController.updateCondition.bind(ComorbidConditionController));
router.put('/conditions/:conditionId/status', ComorbidConditionController.updateConditionStatus.bind(ComorbidConditionController));
router.get('/conditions/:conditionId', ComorbidConditionController.getConditionById.bind(ComorbidConditionController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/chat-messages/send', ChatMessageController.sendMessage.bind(ChatMessageController));
router.get('/chat-messages/conversation/:conversationId', ChatMessageController.getConversationMessages.bind(ChatMessageController));
router.put('/chat-messages/:messageId/read', ChatMessageController.markAsRead.bind(ChatMessageController));

export default router;