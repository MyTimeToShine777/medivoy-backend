'use strict';

import { Router } from 'express';
import BookingController from '../controllers/BookingController.js';
import SupportTicketController from '../controllers/SupportTicketController.js';
import NotificationController from '../controllers/NotificationController.js';
import AppointmentController from '../controllers/AppointmentController.js';
import UserController from '../controllers/UserController.js';
import ChatController from '../controllers/ChatController.js';
import ReviewController from '../controllers/ReviewController.js';
import LaboratoryController from '../controllers/LaboratoryController.js';
import HospitalDoctorController from '../controllers/HospitalDoctorController.js';
import AccommodationController from '../controllers/AccommodationController.js';
import InsuranceDocumentController from '../controllers/InsuranceDocumentController.js';
import InsuranceController from '../controllers/InsuranceController.js';
import PaymentController from '../controllers/PaymentController.js';
import LabReportController from '../controllers/LabReportController.js';
import CompanionController from '../controllers/CompanionController.js';
import TransactionController from '../controllers/TransactionController.js';
import EmailLogController from '../controllers/EmailLogController.js';
import SMSLogController from '../controllers/SMSLogController.js';
import ChatMessageController from '../controllers/ChatMessageController.js';

// ═══════════════════════════════════════════════════════════════════════════════
// STAFF/HOSPITAL ADMIN ROUTES - ULTRA-COMPREHENSIVE (98 ENDPOINTS)
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING COORDINATION (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/bookings', (req, res) => BookingController.getUserBookings(req, res));
router.get('/bookings/:bookingId', (req, res) => BookingController.getBookingById(req, res));
router.post('/bookings/:bookingId/next-step', (req, res) => BookingController.proceedToNextStep(req, res));
router.put('/bookings/:bookingId/status', (req, res) => BookingController.updateBookingStatus(req, res));
router.delete('/bookings/:bookingId/cancel', (req, res) => BookingController.cancelBooking(req, res));
router.get('/bookings/filter', (req, res) => BookingController.filterBookings(req, res));
router.get('/bookings/:bookingId/timeline', (req, res) => BookingController.getBookingTimeline(req, res));
router.post('/bookings/:bookingId/notes', (req, res) => BookingController.addBookingNotes(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT & TICKETS (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/support-tickets', (req, res) => SupportTicketController.getUserTickets(req, res));
router.get('/support-tickets/:ticketId', (req, res) => SupportTicketController.getTicketById(req, res));
router.put('/support-tickets/:ticketId', (req, res) => SupportTicketController.updateTicket(req, res));
router.post('/support-tickets/:ticketId/reply', (req, res) => SupportTicketController.addTicketReply(req, res));
router.post('/support-tickets/:ticketId/close', (req, res) => SupportTicketController.closeTicket(req, res));
router.post('/support-tickets/:ticketId/escalate', (req, res) => SupportTicketController.escalateTicket(req, res));
router.get('/support-tickets/search', (req, res) => SupportTicketController.searchTickets(req, res));
router.get('/support-tickets/statistics', (req, res) => SupportTicketController.getTicketStatistics(req, res));
router.post('/support-tickets/assign/:ticketId', (req, res) => SupportTicketController.assignTicket(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/notifications/email', (req, res) => NotificationController.sendEmailNotification(req, res));
router.post('/notifications/sms', (req, res) => NotificationController.sendSMSNotification(req, res));
router.post('/notifications/bulk-email', (req, res) => NotificationController.sendBulkEmail(req, res));
router.get('/notifications', (req, res) => NotificationController.getNotifications(req, res));
router.post('/notifications/push', (req, res) => NotificationController.sendPushNotification(req, res));
router.get('/notifications/templates', (req, res) => NotificationController.getTemplates(req, res));
router.post('/notifications/schedule', (req, res) => NotificationController.scheduleNotification(req, res));
router.put('/notifications/preferences', (req, res) => NotificationController.updatePreferences(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENT COORDINATION (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/appointments', (req, res) => AppointmentController.getUserAppointments(req, res));
router.get('/appointments/:appointmentId', (req, res) => AppointmentController.getAppointmentById(req, res));
router.put('/appointments/:appointmentId/reschedule', (req, res) => AppointmentController.rescheduleAppointment(req, res));
router.get('/appointments/status/:status', (req, res) => AppointmentController.getAppointmentsByStatus(req, res));
router.put('/appointments/:appointmentId/status', (req, res) => AppointmentController.updateAppointmentStatus(req, res));
router.get('/appointments/today', (req, res) => AppointmentController.getTodayAppointments(req, res));
router.get('/appointments/upcoming', (req, res) => AppointmentController.getUpcomingAppointments(req, res));
router.get('/appointments/filter', (req, res) => AppointmentController.filterAppointments(req, res));
router.post('/appointments/:appointmentId/confirm', (req, res) => AppointmentController.confirmAppointment(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/doctors/assign', (req, res) => HospitalDoctorController.assignDoctorToHospital(req, res));
router.get('/doctors', (req, res) => HospitalDoctorController.getHospitalDoctors(req, res));
router.get('/doctors/:doctorId', (req, res) => HospitalDoctorController.getDoctorDetails(req, res));
router.put('/doctors/:hospitalDoctorId/update', (req, res) => HospitalDoctorController.updateDoctorInfo(req, res));
router.delete('/doctors/:hospitalDoctorId/remove', (req, res) => HospitalDoctorController.removeDoctorFromHospital(req, res));
router.get('/doctors/:doctorId/schedule', (req, res) => HospitalDoctorController.getDoctorSchedule(req, res));
router.get('/doctors/:doctorId/earnings', (req, res) => HospitalDoctorController.getDoctorEarnings(req, res));
router.put('/doctors/:hospitalDoctorId/status', (req, res) => HospitalDoctorController.updateDoctorStatus(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// ACCOMMODATION MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/accommodation/create', (req, res) => AccommodationController.createAccommodation(req, res));
router.get('/accommodation', (req, res) => AccommodationController.getHospitalAccommodation(req, res));
router.get('/accommodation/:accommodationId', (req, res) => AccommodationController.getAccommodationById(req, res));
router.put('/accommodation/:accommodationId/update', (req, res) => AccommodationController.updateAccommodation(req, res));
router.delete('/accommodation/:accommodationId/delete', (req, res) => AccommodationController.deleteAccommodation(req, res));
router.get('/accommodation/:accommodationId/bookings', (req, res) => AccommodationController.getAccommodationBookings(req, res));
router.put('/accommodation/bookings/:bookingId/status', (req, res) => AccommodationController.updateBookingStatus(req, res));
router.get('/accommodation/statistics', (req, res) => AccommodationController.getAccommodationStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// LABORATORY COORDINATION (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/laboratory/orders', (req, res) => LaboratoryController.getUserLabOrders(req, res));
router.get('/laboratory/orders/:orderId', (req, res) => LaboratoryController.getLabOrderDetails(req, res));
router.put('/laboratory/orders/:orderId/status', (req, res) => LaboratoryController.updateOrderStatus(req, res));
router.post('/laboratory/results/upload', (req, res) => LaboratoryController.uploadLabResult(req, res));
router.get('/laboratory/statistics', (req, res) => LaboratoryController.getLabStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/insurance/plans', (req, res) => InsuranceController.listInsurances(req, res));
router.get('/insurance/plans/:insuranceId', (req, res) => InsuranceController.getInsuranceById(req, res));
router.get('/insurance/claims', (req, res) => InsuranceController.getAllClaims(req, res));
router.put('/insurance/claims/:insuranceId/approve', (req, res) => InsuranceController.approveClaim(req, res));
router.put('/insurance/claims/:insuranceId/reject', (req, res) => InsuranceController.rejectClaim(req, res));
router.get('/insurance/statistics', (req, res) => InsuranceController.getInsuranceStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE DOCUMENTS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/insurance-documents', (req, res) => InsuranceDocumentController.getAllDocuments(req, res));
router.get('/insurance-documents/:documentId', (req, res) => InsuranceDocumentController.getDocumentById(req, res));
router.post('/insurance-documents/:documentId/verify', (req, res) => InsuranceDocumentController.verifyDocument(req, res));
router.post('/insurance-documents/:documentId/reject', (req, res) => InsuranceDocumentController.rejectDocument(req, res));
router.get('/insurance-documents/status/:status', (req, res) => InsuranceDocumentController.getDocumentsByStatus(req, res));
router.get('/insurance-documents/statistics', (req, res) => InsuranceDocumentController.getDocumentStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNICATION (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/chat', (req, res) => ChatController.createChatRoom(req, res));
router.get('/chat/:chatId', (req, res) => ChatController.getChatRoom(req, res));
router.get('/chat', (req, res) => ChatController.getUserChats(req, res));
router.post('/chat/:chatId/message', (req, res) => ChatController.sendMessage(req, res));
router.get('/chat/:chatId/messages', (req, res) => ChatController.getChatMessages(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS & RATINGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/reviews', (req, res) => ReviewController.getMedicalReviewsForDoctor(req, res));
router.get('/reviews/statistics', (req, res) => ReviewController.getReviewStatistics(req, res));
router.post('/reviews/:reviewId/response', (req, res) => ReviewController.respondToReview(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT MANAGEMENT (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/payments', (req, res) => PaymentController.listPayments(req, res));
router.get('/payments/:paymentId', (req, res) => PaymentController.getPaymentById(req, res));
router.put('/payments/:paymentId/status', (req, res) => PaymentController.updatePaymentStatus(req, res));
router.post('/payments/refund', (req, res) => PaymentController.processRefund(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/profile', (req, res) => UserController.getUserProfile(req, res));
router.put('/profile', (req, res) => UserController.updateUserProfile(req, res));
router.post('/change-password', (req, res) => UserController.changePassword(req, res));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED STAFF FEATURES (26 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', (req, res) => LabReportController.createLabReport(req, res));
router.get('/lab-reports', (req, res) => LabReportController.getAllReports(req, res));
router.get('/lab-reports/:reportId', (req, res) => LabReportController.getReportById(req, res));
router.put('/lab-reports/:reportId/status', (req, res) => LabReportController.updateReportStatus(req, res));
router.put('/lab-reports/:reportId/results', (req, res) => LabReportController.updateReportResults(req, res));
router.get('/lab-reports/statistics', (req, res) => LabReportController.getReportStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/companions', (req, res) => CompanionController.getAllCompanions(req, res));
router.get('/companions/booking/:bookingId', (req, res) => CompanionController.getBookingCompanions(req, res));
router.get('/companions/:companionId', (req, res) => CompanionController.getCompanionById(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/transactions', (req, res) => TransactionController.getAllTransactions(req, res));
router.get('/transactions/:transactionId', (req, res) => TransactionController.getTransactionById(req, res));
router.put('/transactions/:transactionId/status', (req, res) => TransactionController.updateTransactionStatus(req, res));
router.get('/transactions/payment/:paymentId', (req, res) => TransactionController.getTransactionsByPayment(req, res));
router.get('/transactions/statistics', (req, res) => TransactionController.getTransactionStatistics(req, res));
router.get('/transactions/search', (req, res) => TransactionController.searchTransactions(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LOGS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/email-logs', (req, res) => EmailLogController.getEmailLogs(req, res));
router.get('/email-logs/:emailLogId', (req, res) => EmailLogController.getEmailLogById(req, res));
router.put('/email-logs/:emailLogId/status', (req, res) => EmailLogController.updateEmailStatus(req, res));
router.post('/email-logs/:emailLogId/retry', (req, res) => EmailLogController.retryFailedEmail(req, res));
router.get('/email-logs/statistics', (req, res) => EmailLogController.getEmailStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SMS LOGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/sms-logs', (req, res) => SMSLogController.getSMSLogs(req, res));
router.get('/sms-logs/:smsLogId', (req, res) => SMSLogController.getSMSLogById(req, res));
router.get('/sms-logs/statistics', (req, res) => SMSLogController.getSMSStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/chat-messages/conversation/:conversationId', (req, res) => ChatMessageController.getConversationMessages(req, res));
router.delete('/chat-messages/:messageId/delete', (req, res) => ChatMessageController.deleteMessage(req, res));
router.get('/chat-messages/statistics', (req, res) => ChatMessageController.getMessageStatistics(req, res));

export default router;
