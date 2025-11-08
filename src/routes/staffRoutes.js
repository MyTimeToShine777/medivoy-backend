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

router.get('/bookings', BookingController.getUserBookings.bind(BookingController));
router.get('/bookings/:bookingId', BookingController.getBookingById.bind(BookingController));
router.post('/bookings/:bookingId/next-step', BookingController.proceedToNextStep.bind(BookingController));
router.put('/bookings/:bookingId/status', BookingController.updateBookingStatus.bind(BookingController));
router.delete('/bookings/:bookingId/cancel', BookingController.cancelBooking.bind(BookingController));
router.get('/bookings/filter', BookingController.filterBookings.bind(BookingController));
router.get('/bookings/:bookingId/timeline', BookingController.getBookingTimeline.bind(BookingController));
router.post('/bookings/:bookingId/notes', BookingController.addBookingNotes.bind(BookingController));

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT & TICKETS (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/support-tickets', SupportTicketController.getUserTickets.bind(SupportTicketController));
router.get('/support-tickets/:ticketId', SupportTicketController.getTicketById.bind(SupportTicketController));
router.put('/support-tickets/:ticketId', SupportTicketController.updateTicket.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/reply', SupportTicketController.addTicketReply.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/close', SupportTicketController.closeTicket.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/escalate', SupportTicketController.escalateTicket.bind(SupportTicketController));
router.get('/support-tickets/search', SupportTicketController.searchTickets.bind(SupportTicketController));
router.get('/support-tickets/statistics', SupportTicketController.getTicketStatistics.bind(SupportTicketController));
router.post('/support-tickets/assign/:ticketId', SupportTicketController.assignTicket.bind(SupportTicketController));

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/notifications/email', NotificationController.sendEmailNotification.bind(NotificationController));
router.post('/notifications/sms', NotificationController.sendSMSNotification.bind(NotificationController));
router.post('/notifications/bulk-email', NotificationController.sendBulkEmail.bind(NotificationController));
router.get('/notifications', NotificationController.getNotifications.bind(NotificationController));
router.post('/notifications/push', NotificationController.sendPushNotification.bind(NotificationController));
router.get('/notifications/templates', NotificationController.getTemplates.bind(NotificationController));
router.post('/notifications/schedule', NotificationController.scheduleNotification.bind(NotificationController));
router.put('/notifications/preferences', NotificationController.updatePreferences.bind(NotificationController));

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENT COORDINATION (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/appointments', AppointmentController.getUserAppointments.bind(AppointmentController));
router.get('/appointments/:appointmentId', AppointmentController.getAppointmentById.bind(AppointmentController));
router.put('/appointments/:appointmentId/reschedule', AppointmentController.rescheduleAppointment.bind(AppointmentController));
router.get('/appointments/status/:status', AppointmentController.getAppointmentsByStatus.bind(AppointmentController));
router.put('/appointments/:appointmentId/status', AppointmentController.updateAppointmentStatus.bind(AppointmentController));
router.get('/appointments/today', AppointmentController.getTodayAppointments.bind(AppointmentController));
router.get('/appointments/upcoming', AppointmentController.getUpcomingAppointments.bind(AppointmentController));
router.get('/appointments/filter', AppointmentController.filterAppointments.bind(AppointmentController));
router.post('/appointments/:appointmentId/confirm', AppointmentController.confirmAppointment.bind(AppointmentController));

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/doctors/assign', HospitalDoctorController.assignDoctorToHospital.bind(HospitalDoctorController));
router.get('/doctors', HospitalDoctorController.getHospitalDoctors.bind(HospitalDoctorController));
router.get('/doctors/:doctorId', HospitalDoctorController.getDoctorDetails.bind(HospitalDoctorController));
router.put('/doctors/:hospitalDoctorId/update', HospitalDoctorController.updateDoctorInfo.bind(HospitalDoctorController));
router.delete('/doctors/:hospitalDoctorId/remove', HospitalDoctorController.removeDoctorFromHospital.bind(HospitalDoctorController));
router.get('/doctors/:doctorId/schedule', HospitalDoctorController.getDoctorSchedule.bind(HospitalDoctorController));
router.get('/doctors/:doctorId/earnings', HospitalDoctorController.getDoctorEarnings.bind(HospitalDoctorController));
router.put('/doctors/:hospitalDoctorId/status', HospitalDoctorController.updateDoctorStatus.bind(HospitalDoctorController));

// ─────────────────────────────────────────────────────────────────────────────
// ACCOMMODATION MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/accommodation/create', AccommodationController.createAccommodation.bind(AccommodationController));
router.get('/accommodation', AccommodationController.getHospitalAccommodation.bind(AccommodationController));
router.get('/accommodation/:accommodationId', AccommodationController.getAccommodationById.bind(AccommodationController));
router.put('/accommodation/:accommodationId/update', AccommodationController.updateAccommodation.bind(AccommodationController));
router.delete('/accommodation/:accommodationId/delete', AccommodationController.deleteAccommodation.bind(AccommodationController));
router.get('/accommodation/:accommodationId/bookings', AccommodationController.getAccommodationBookings.bind(AccommodationController));
router.put('/accommodation/bookings/:bookingId/status', AccommodationController.updateBookingStatus.bind(AccommodationController));
router.get('/accommodation/statistics', AccommodationController.getAccommodationStatistics.bind(AccommodationController));

// ─────────────────────────────────────────────────────────────────────────────
// LABORATORY COORDINATION (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/laboratory/orders', LaboratoryController.getUserLabOrders.bind(LaboratoryController));
router.get('/laboratory/orders/:orderId', LaboratoryController.getLabOrderDetails.bind(LaboratoryController));
router.put('/laboratory/orders/:orderId/status', LaboratoryController.updateOrderStatus.bind(LaboratoryController));
router.post('/laboratory/results/upload', LaboratoryController.uploadLabResult.bind(LaboratoryController));
router.get('/laboratory/statistics', LaboratoryController.getLabStatistics.bind(LaboratoryController));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/insurance/plans', InsuranceController.listInsurances.bind(InsuranceController));
router.get('/insurance/plans/:insuranceId', InsuranceController.getInsuranceById.bind(InsuranceController));
router.get('/insurance/claims', InsuranceController.getAllClaims.bind(InsuranceController));
router.put('/insurance/claims/:insuranceId/approve', InsuranceController.approveClaim.bind(InsuranceController));
router.put('/insurance/claims/:insuranceId/reject', InsuranceController.rejectClaim.bind(InsuranceController));
router.get('/insurance/statistics', InsuranceController.getInsuranceStatistics.bind(InsuranceController));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE DOCUMENTS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/insurance-documents', InsuranceDocumentController.getAllDocuments.bind(InsuranceDocumentController));
router.get('/insurance-documents/:documentId', InsuranceDocumentController.getDocumentById.bind(InsuranceDocumentController));
router.post('/insurance-documents/:documentId/verify', InsuranceDocumentController.verifyDocument.bind(InsuranceDocumentController));
router.post('/insurance-documents/:documentId/reject', InsuranceDocumentController.rejectDocument.bind(InsuranceDocumentController));
router.get('/insurance-documents/status/:status', InsuranceDocumentController.getDocumentsByStatus.bind(InsuranceDocumentController));
router.get('/insurance-documents/statistics', InsuranceDocumentController.getDocumentStatistics.bind(InsuranceDocumentController));

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNICATION (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/chat', ChatController.createChatRoom.bind(ChatController));
router.get('/chat/:chatId', ChatController.getChatRoom.bind(ChatController));
router.get('/chat', ChatController.getUserChats.bind(ChatController));
router.post('/chat/:chatId/message', ChatController.sendMessage.bind(ChatController));
router.get('/chat/:chatId/messages', ChatController.getChatMessages.bind(ChatController));

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS & RATINGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/reviews', ReviewController.getMedicalReviewsForDoctor.bind(ReviewController));
router.get('/reviews/statistics', ReviewController.getReviewStatistics.bind(ReviewController));
router.post('/reviews/:reviewId/response', ReviewController.respondToReview.bind(ReviewController));

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT MANAGEMENT (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/payments', PaymentController.listPayments.bind(PaymentController));
router.get('/payments/:paymentId', PaymentController.getPaymentById.bind(PaymentController));
router.put('/payments/:paymentId/status', PaymentController.updatePaymentStatus.bind(PaymentController));
router.post('/payments/refund', PaymentController.processRefund.bind(PaymentController));

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/profile', UserController.getUserProfile.bind(UserController));
router.put('/profile', UserController.updateUserProfile.bind(UserController));
router.post('/change-password', UserController.changePassword.bind(UserController));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED STAFF FEATURES (26 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', LabReportController.createLabReport.bind(LabReportController));
router.get('/lab-reports', LabReportController.getAllReports.bind(LabReportController));
router.get('/lab-reports/:reportId', LabReportController.getReportById.bind(LabReportController));
router.put('/lab-reports/:reportId/status', LabReportController.updateReportStatus.bind(LabReportController));
router.put('/lab-reports/:reportId/results', LabReportController.updateReportResults.bind(LabReportController));
router.get('/lab-reports/statistics', LabReportController.getReportStatistics.bind(LabReportController));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/companions', CompanionController.getAllCompanions.bind(CompanionController));
router.get('/companions/booking/:bookingId', CompanionController.getBookingCompanions.bind(CompanionController));
router.get('/companions/:companionId', CompanionController.getCompanionById.bind(CompanionController));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/transactions', TransactionController.getAllTransactions.bind(TransactionController));
router.get('/transactions/:transactionId', TransactionController.getTransactionById.bind(TransactionController));
router.put('/transactions/:transactionId/status', TransactionController.updateTransactionStatus.bind(TransactionController));
router.get('/transactions/payment/:paymentId', TransactionController.getTransactionsByPayment.bind(TransactionController));
router.get('/transactions/statistics', TransactionController.getTransactionStatistics.bind(TransactionController));
router.get('/transactions/search', TransactionController.searchTransactions.bind(TransactionController));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LOGS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/email-logs', EmailLogController.getEmailLogs.bind(EmailLogController));
router.get('/email-logs/:emailLogId', EmailLogController.getEmailLogById.bind(EmailLogController));
router.put('/email-logs/:emailLogId/status', EmailLogController.updateEmailStatus.bind(EmailLogController));
router.post('/email-logs/:emailLogId/retry', EmailLogController.retryFailedEmail.bind(EmailLogController));
router.get('/email-logs/statistics', EmailLogController.getEmailStatistics.bind(EmailLogController));

// ─────────────────────────────────────────────────────────────────────────────
// SMS LOGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/sms-logs', SMSLogController.getSMSLogs.bind(SMSLogController));
router.get('/sms-logs/:smsLogId', SMSLogController.getSMSLogById.bind(SMSLogController));
router.get('/sms-logs/statistics', SMSLogController.getSMSStatistics.bind(SMSLogController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/chat-messages/conversation/:conversationId', ChatMessageController.getConversationMessages.bind(ChatMessageController));
router.delete('/chat-messages/:messageId/delete', ChatMessageController.deleteMessage.bind(ChatMessageController));
router.get('/chat-messages/statistics', ChatMessageController.getMessageStatistics.bind(ChatMessageController));

export default router;