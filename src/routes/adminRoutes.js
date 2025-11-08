'use strict';

import { Router } from 'express';
import HospitalController from '../controllers/HospitalController.js';
import DoctorController from '../controllers/DoctorController.js';
import TreatmentController from '../controllers/TreatmentController.js';
import PackageController from '../controllers/PackageController.js';
import BookingController from '../controllers/BookingController.js';
import PaymentController from '../controllers/PaymentController.js';
import UserController from '../controllers/UserController.js';
import SupportTicketController from '../controllers/SupportTicketController.js';
import AnalyticsController from '../controllers/AnalyticsController.js';
import InvoiceController from '../controllers/InvoiceController.js';
import AccommodationController from '../controllers/AccommodationController.js';
import AuditLogController from '../controllers/AuditLogController.js';
import HospitalDoctorController from '../controllers/HospitalDoctorController.js';
import InsuranceController from '../controllers/InsuranceController.js';
import ChatConversationController from '../controllers/ChatConversationController.js';
import RatingController from '../controllers/RatingController.js';
import LabReportController from '../controllers/LabReportController.js';
import CompanionController from '../controllers/CompanionController.js';
import ComorbidConditionController from '../controllers/ComorbidConditionController.js';
import TransactionController from '../controllers/TransactionController.js';
import EmailLogController from '../controllers/EmailLogController.js';
import SMSLogController from '../controllers/SMSLogController.js';
import ChatMessageController from '../controllers/ChatMessageController.js';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES - ULTRA-COMPREHENSIVE (129 ENDPOINTS)
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/hospital', HospitalController.getHospitalById.bind(HospitalController));
router.put('/hospital', HospitalController.updateHospital.bind(HospitalController));
router.get('/hospital/services', HospitalController.getHospitalServices.bind(HospitalController));
router.post('/hospital/services', HospitalController.addHospitalService.bind(HospitalController));
router.get('/hospital/doctors', HospitalController.getHospitalDoctors.bind(HospitalController));
router.get('/hospital/stats', HospitalController.getHospitalStats.bind(HospitalController));
router.put('/hospital/settings', HospitalController.updateHospitalSettings.bind(HospitalController));
router.get('/hospital/overview', HospitalController.getHospitalOverview.bind(HospitalController));
router.post('/hospital/branding', HospitalController.updateBranding.bind(HospitalController));

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR MANAGEMENT (12 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/doctors', DoctorController.createDoctor.bind(DoctorController));
router.get('/doctors', DoctorController.listDoctors.bind(DoctorController));
router.get('/doctors/:doctorId', DoctorController.getDoctorById.bind(DoctorController));
router.put('/doctors/:doctorId', DoctorController.updateDoctor.bind(DoctorController));
router.post('/doctors/:doctorId/availability', DoctorController.setDoctorAvailability.bind(DoctorController));
router.get('/doctors/:doctorId/appointments', DoctorController.getDoctorAppointments.bind(DoctorController));
router.get('/doctors/:doctorId/stats', DoctorController.getDoctorStats.bind(DoctorController));
router.delete('/doctors/:doctorId', DoctorController.removeDoctor.bind(DoctorController));
router.post('/doctors/:doctorId/status', DoctorController.updateDoctorStatus.bind(DoctorController));
router.get('/doctors/:doctorId/schedule', DoctorController.getDoctorSchedule.bind(DoctorController));
router.post('/doctors/:doctorId/certification', DoctorController.addCertification.bind(DoctorController));
router.get('/doctors/search', DoctorController.searchDoctors.bind(DoctorController));

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR ASSIGNMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/doctors/assign', HospitalDoctorController.assignDoctorToHospital.bind(HospitalDoctorController));
router.put('/doctors/:hospitalDoctorId/update', HospitalDoctorController.updateDoctorInfo.bind(HospitalDoctorController));
router.delete('/doctors/:hospitalDoctorId/remove', HospitalDoctorController.removeDoctorFromHospital.bind(HospitalDoctorController));
router.get('/doctors/:doctorId/earnings', HospitalDoctorController.getDoctorEarnings.bind(HospitalDoctorController));
router.put('/doctors/:hospitalDoctorId/status', HospitalDoctorController.updateDoctorStatus.bind(HospitalDoctorController));

// ─────────────────────────────────────────────────────────────────────────────
// TREATMENT & PACKAGE MANAGEMENT (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/treatments', TreatmentController.createTreatment.bind(TreatmentController));
router.get('/treatments', TreatmentController.listTreatments.bind(TreatmentController));
router.put('/treatments/:treatmentId', TreatmentController.updateTreatment.bind(TreatmentController));
router.delete('/treatments/:treatmentId', TreatmentController.deleteTreatment.bind(TreatmentController));
router.get('/treatments/:treatmentId', TreatmentController.getTreatmentById.bind(TreatmentController));
router.post('/packages', PackageController.createPackage.bind(PackageController));
router.get('/packages', PackageController.listPackages.bind(PackageController));
router.put('/packages/:packageId', PackageController.updatePackage.bind(PackageController));
router.post('/packages/:packageId/add-on', PackageController.addPackageAddOn.bind(PackageController));
router.delete('/packages/:packageId', PackageController.deletePackage.bind(PackageController));
router.get('/packages/:packageId', PackageController.getPackageById.bind(PackageController));

// ─────────────────────────────────────────────────────────────────────────────
// ACCOMMODATION MANAGEMENT (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/accommodations', AccommodationController.createAccommodation.bind(AccommodationController));
router.get('/accommodations', AccommodationController.listAccommodations.bind(AccommodationController));
router.put('/accommodations/:accommodationId', AccommodationController.updateAccommodation.bind(AccommodationController));
router.delete('/accommodations/:accommodationId', AccommodationController.deleteAccommodation.bind(AccommodationController));
router.get('/accommodations/:accommodationId', AccommodationController.getAccommodationById.bind(AccommodationController));
router.get('/accommodations/:accommodationId/bookings', AccommodationController.getAccommodationBookings.bind(AccommodationController));
router.put('/accommodations/bookings/:bookingId/status', AccommodationController.updateBookingStatus.bind(AccommodationController));

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/bookings', BookingController.getUserBookings.bind(BookingController));
router.get('/bookings/:bookingId', BookingController.getBookingById.bind(BookingController));
router.post('/bookings/:bookingId/next-step', BookingController.proceedToNextStep.bind(BookingController));
router.put('/bookings/:bookingId/status', BookingController.updateBookingStatus.bind(BookingController));
router.delete('/bookings/:bookingId/cancel', BookingController.cancelBooking.bind(BookingController));
router.get('/bookings/filter', BookingController.filterBookings.bind(BookingController));
router.get('/bookings/:bookingId/timeline', BookingController.getBookingTimeline.bind(BookingController));
router.post('/bookings/:bookingId/notes', BookingController.addBookingNotes.bind(BookingController));
router.get('/bookings/search', BookingController.searchBookings.bind(BookingController));

// ─────────────────────────────────────────────────────────────────────────────
// INVOICES & PAYMENTS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/invoices', InvoiceController.listInvoices.bind(InvoiceController));
router.post('/invoices/:bookingId', InvoiceController.createInvoice.bind(InvoiceController));
router.get('/invoices/:invoiceId', InvoiceController.getInvoiceById.bind(InvoiceController));
router.put('/invoices/:invoiceId', InvoiceController.updateInvoice.bind(InvoiceController));
router.delete('/invoices/:invoiceId', InvoiceController.deleteInvoice.bind(InvoiceController));
router.post('/payments/:bookingId', PaymentController.createPayment.bind(PaymentController));
router.get('/payments', PaymentController.listPayments.bind(PaymentController));
router.get('/payments/:paymentId', PaymentController.getPaymentById.bind(PaymentController));
router.put('/payments/:paymentId/status', PaymentController.updatePaymentStatus.bind(PaymentController));
router.post('/payments/refund', PaymentController.processRefund.bind(PaymentController));

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT & TICKETS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/support-tickets', SupportTicketController.getUserTickets.bind(SupportTicketController));
router.get('/support-tickets/:ticketId', SupportTicketController.getTicketById.bind(SupportTicketController));
router.put('/support-tickets/:ticketId', SupportTicketController.updateTicket.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/reply', SupportTicketController.addTicketReply.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/close', SupportTicketController.closeTicket.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/escalate', SupportTicketController.escalateTicket.bind(SupportTicketController));
router.get('/support-tickets/search', SupportTicketController.searchTickets.bind(SupportTicketController));
router.get('/support-tickets/statistics', SupportTicketController.getTicketStatistics.bind(SupportTicketController));

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS & REPORTS (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/analytics/dashboard', AnalyticsController.getDashboardMetrics.bind(AnalyticsController));
router.get('/analytics/revenue', AnalyticsController.getRevenueAnalytics.bind(AnalyticsController));
router.get('/analytics/bookings', AnalyticsController.getBookingTrendAnalytics.bind(AnalyticsController));
router.get('/analytics/doctors', AnalyticsController.getDoctorAnalytics.bind(AnalyticsController));
router.get('/analytics/patients', AnalyticsController.getPatientAnalytics.bind(AnalyticsController));
router.get('/analytics/appointments', AnalyticsController.getAppointmentAnalytics.bind(AnalyticsController));
router.get('/analytics/services', AnalyticsController.getServiceAnalytics.bind(AnalyticsController));
router.get('/analytics/export', AnalyticsController.exportAnalyticsReport.bind(AnalyticsController));
router.post('/analytics/report', AnalyticsController.generateCustomReport.bind(AnalyticsController));
router.get('/analytics/trends', AnalyticsController.getTrendsAnalytics.bind(AnalyticsController));
router.get('/analytics/comparison', AnalyticsController.getComparisonAnalytics.bind(AnalyticsController));

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/audit/log', AuditLogController.logAction.bind(AuditLogController));
router.get('/audit/logs', AuditLogController.getAuditLogs.bind(AuditLogController));
router.get('/audit/logs/user/:userId', AuditLogController.getUserAuditLogs.bind(AuditLogController));
router.get('/audit/logs/resource/:resourceType/:resourceId', AuditLogController.getResourceAuditLogs.bind(AuditLogController));
router.get('/audit/logs/action/:action', AuditLogController.getActionAuditLogs.bind(AuditLogController));
router.get('/audit/report', AuditLogController.generateAuditReport.bind(AuditLogController));
router.get('/audit/search', AuditLogController.searchAuditLogs.bind(AuditLogController));
router.get('/audit/export', AuditLogController.exportAuditLogs.bind(AuditLogController));
router.delete('/audit/logs/old', AuditLogController.deleteOldLogs.bind(AuditLogController));

// ─────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/users', UserController.getAllUsers.bind(UserController));
router.get('/users/:userId', UserController.getUserById.bind(UserController));
router.put('/users/:userId/role', UserController.updateUserRole.bind(UserController));
router.put('/users/:userId/status', UserController.updateUserStatus.bind(UserController));
router.get('/users/statistics', UserController.getUserStatistics.bind(UserController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT CONVERSATIONS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/tickets', ChatConversationController.getAllConversations.bind(ChatConversationController));
router.get('/tickets/:conversationId', ChatConversationController.getConversationById.bind(ChatConversationController));
router.put('/tickets/:conversationId/status', ChatConversationController.updateTicketStatus.bind(ChatConversationController));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/insurance/plans', InsuranceController.listInsurances.bind(InsuranceController));
router.get('/insurance/plans/:insuranceId', InsuranceController.getInsuranceById.bind(InsuranceController));
router.get('/insurance/claims', InsuranceController.getAllClaims.bind(InsuranceController));
router.put('/insurance/claims/:insuranceId/approve', InsuranceController.approveClaim.bind(InsuranceController));
router.put('/insurance/claims/:insuranceId/reject', InsuranceController.rejectClaim.bind(InsuranceController));
router.get('/insurance/statistics', InsuranceController.getInsuranceStatistics.bind(InsuranceController));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED ADMIN FEATURES (44 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', LabReportController.createLabReport.bind(LabReportController));
router.get('/lab-reports', LabReportController.getAllReports.bind(LabReportController));
router.get('/lab-reports/:reportId', LabReportController.getReportById.bind(LabReportController));
router.put('/lab-reports/:reportId/status', LabReportController.updateReportStatus.bind(LabReportController));
router.put('/lab-reports/:reportId/results', LabReportController.updateReportResults.bind(LabReportController));
router.delete('/lab-reports/:reportId/delete', LabReportController.deleteLabReport.bind(LabReportController));

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS MANAGEMENT (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/ratings', RatingController.getAllRatings.bind(RatingController));
router.get('/ratings/:ratingId', RatingController.getRatingById.bind(RatingController));
router.delete('/ratings/:ratingId/delete', RatingController.deleteRating.bind(RatingController));
router.get('/ratings/statistics', RatingController.getRatingStatistics.bind(RatingController));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/companions', CompanionController.getAllCompanions.bind(CompanionController));
router.get('/companions/booking/:bookingId', CompanionController.getBookingCompanions.bind(CompanionController));
router.delete('/companions/:companionId/remove', CompanionController.removeCompanion.bind(CompanionController));

// ─────────────────────────────────────────────────────────────────────────────
// CONDITIONS MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/conditions/patient/:patientId', ComorbidConditionController.getPatientConditions.bind(ComorbidConditionController));
router.get('/conditions/:conditionId', ComorbidConditionController.getConditionById.bind(ComorbidConditionController));
router.delete('/conditions/:conditionId/delete', ComorbidConditionController.deleteCondition.bind(ComorbidConditionController));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS MANAGEMENT (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/transactions/create', TransactionController.createTransaction.bind(TransactionController));
router.get('/transactions', TransactionController.getAllTransactions.bind(TransactionController));
router.get('/transactions/:transactionId', TransactionController.getTransactionById.bind(TransactionController));
router.put('/transactions/:transactionId/status', TransactionController.updateTransactionStatus.bind(TransactionController));
router.get('/transactions/gateway/:gatewayId', TransactionController.getTransactionByGatewayId.bind(TransactionController));
router.get('/transactions/statistics', TransactionController.getTransactionStatistics.bind(TransactionController));
router.get('/transactions/export', TransactionController.exportTransactions.bind(TransactionController));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LOGS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/email-logs/create', EmailLogController.logEmail.bind(EmailLogController));
router.get('/email-logs', EmailLogController.getEmailLogs.bind(EmailLogController));
router.get('/email-logs/:emailLogId', EmailLogController.getEmailLogById.bind(EmailLogController));
router.put('/email-logs/:emailLogId/status', EmailLogController.updateEmailStatus.bind(EmailLogController));
router.post('/email-logs/:emailLogId/retry', EmailLogController.retryFailedEmail.bind(EmailLogController));
router.get('/email-logs/statistics', EmailLogController.getEmailStatistics.bind(EmailLogController));

// ─────────────────────────────────────────────────────────────────────────────
// SMS LOGS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sms-logs/create', SMSLogController.logSMS.bind(SMSLogController));
router.get('/sms-logs', SMSLogController.getSMSLogs.bind(SMSLogController));
router.get('/sms-logs/:smsLogId', SMSLogController.getSMSLogById.bind(SMSLogController));
router.put('/sms-logs/:smsLogId/status', SMSLogController.updateSMSStatus.bind(SMSLogController));
router.post('/sms-logs/:smsLogId/retry', SMSLogController.retryFailedSMS.bind(SMSLogController));
router.get('/sms-logs/statistics', SMSLogController.getSMSStatistics.bind(SMSLogController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/chat-messages/conversation/:conversationId', ChatMessageController.getConversationMessages.bind(ChatMessageController));
router.delete('/chat-messages/:messageId/delete', ChatMessageController.deleteMessage.bind(ChatMessageController));
router.get('/chat-messages/statistics', ChatMessageController.getMessageStatistics.bind(ChatMessageController));

export default router;