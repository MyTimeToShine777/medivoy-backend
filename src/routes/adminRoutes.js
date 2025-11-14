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

router.get('/hospital', (req, res) => HospitalController.getHospitalById(req, res));
router.put('/hospital', (req, res) => HospitalController.updateHospital(req, res));
router.get('/hospital/services', (req, res) => HospitalController.getHospitalServices(req, res));
router.post('/hospital/services', (req, res) => HospitalController.addHospitalService(req, res));
router.get('/hospital/doctors', (req, res) => HospitalController.getHospitalDoctors(req, res));
router.get('/hospital/stats', (req, res) => HospitalController.getHospitalStats(req, res));
router.put('/hospital/settings', (req, res) => HospitalController.updateHospitalSettings(req, res));
router.get('/hospital/overview', (req, res) => HospitalController.getHospitalOverview(req, res));
router.post('/hospital/branding', (req, res) => HospitalController.updateBranding(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR MANAGEMENT (12 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/doctors', (req, res) => DoctorController.createDoctor(req, res));
router.get('/doctors', (req, res) => DoctorController.listDoctors(req, res));
router.get('/doctors/:doctorId', (req, res) => DoctorController.getDoctorById(req, res));
router.put('/doctors/:doctorId', (req, res) => DoctorController.updateDoctor(req, res));
router.post('/doctors/:doctorId/availability', (req, res) => DoctorController.setDoctorAvailability(req, res));
router.get('/doctors/:doctorId/appointments', (req, res) => DoctorController.getDoctorAppointments(req, res));
router.get('/doctors/:doctorId/stats', (req, res) => DoctorController.getDoctorStats(req, res));
router.delete('/doctors/:doctorId', (req, res) => DoctorController.removeDoctor(req, res));
router.post('/doctors/:doctorId/status', (req, res) => DoctorController.updateDoctorStatus(req, res));
router.get('/doctors/:doctorId/schedule', (req, res) => DoctorController.getDoctorSchedule(req, res));
router.post('/doctors/:doctorId/certification', (req, res) => DoctorController.addCertification(req, res));
router.get('/doctors/search', (req, res) => DoctorController.searchDoctors(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR ASSIGNMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/doctors/assign', (req, res) => HospitalDoctorController.assignDoctorToHospital(req, res));
router.put('/doctors/:hospitalDoctorId/update', (req, res) => HospitalDoctorController.updateDoctorInfo(req, res));
router.delete('/doctors/:hospitalDoctorId/remove', (req, res) => HospitalDoctorController.removeDoctorFromHospital(req, res));
router.get('/doctors/:doctorId/earnings', (req, res) => HospitalDoctorController.getDoctorEarnings(req, res));
router.put('/doctors/:hospitalDoctorId/status', (req, res) => HospitalDoctorController.updateDoctorStatus(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TREATMENT & PACKAGE MANAGEMENT (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/treatments', (req, res) => TreatmentController.createTreatment(req, res));
router.get('/treatments', (req, res) => TreatmentController.listTreatments(req, res));
router.put('/treatments/:treatmentId', (req, res) => TreatmentController.updateTreatment(req, res));
router.delete('/treatments/:treatmentId', (req, res) => TreatmentController.deleteTreatment(req, res));
router.get('/treatments/:treatmentId', (req, res) => TreatmentController.getTreatmentById(req, res));
router.post('/packages', (req, res) => PackageController.createPackage(req, res));
router.get('/packages', (req, res) => PackageController.listPackages(req, res));
router.put('/packages/:packageId', (req, res) => PackageController.updatePackage(req, res));
router.post('/packages/:packageId/add-on', (req, res) => PackageController.addPackageAddOn(req, res));
router.delete('/packages/:packageId', (req, res) => PackageController.deletePackage(req, res));
router.get('/packages/:packageId', (req, res) => PackageController.getPackageById(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// ACCOMMODATION MANAGEMENT (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/accommodations', (req, res) => AccommodationController.createAccommodation(req, res));
router.get('/accommodations', (req, res) => AccommodationController.listAccommodations(req, res));
router.put('/accommodations/:accommodationId', (req, res) => AccommodationController.updateAccommodation(req, res));
router.delete('/accommodations/:accommodationId', (req, res) => AccommodationController.deleteAccommodation(req, res));
router.get('/accommodations/:accommodationId', (req, res) => AccommodationController.getAccommodationById(req, res));
router.get('/accommodations/:accommodationId/bookings', (req, res) => AccommodationController.getAccommodationBookings(req, res));
router.put('/accommodations/bookings/:bookingId/status', (req, res) => AccommodationController.updateBookingStatus(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/bookings', (req, res) => BookingController.getUserBookings(req, res));
router.get('/bookings/:bookingId', (req, res) => BookingController.getBookingById(req, res));
router.post('/bookings/:bookingId/next-step', (req, res) => BookingController.proceedToNextStep(req, res));
router.put('/bookings/:bookingId/status', (req, res) => BookingController.updateBookingStatus(req, res));
router.delete('/bookings/:bookingId/cancel', (req, res) => BookingController.cancelBooking(req, res));
router.get('/bookings/filter', (req, res) => BookingController.filterBookings(req, res));
router.get('/bookings/:bookingId/timeline', (req, res) => BookingController.getBookingTimeline(req, res));
router.post('/bookings/:bookingId/notes', (req, res) => BookingController.addBookingNotes(req, res));
router.get('/bookings/search', (req, res) => BookingController.searchBookings(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// INVOICES & PAYMENTS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/invoices', (req, res) => InvoiceController.listInvoices(req, res));
router.post('/invoices/:bookingId', (req, res) => InvoiceController.createInvoice(req, res));
router.get('/invoices/:invoiceId', (req, res) => InvoiceController.getInvoiceById(req, res));
router.put('/invoices/:invoiceId', (req, res) => InvoiceController.updateInvoice(req, res));
router.delete('/invoices/:invoiceId', (req, res) => InvoiceController.deleteInvoice(req, res));
router.post('/payments/:bookingId', (req, res) => PaymentController.createPayment(req, res));
router.get('/payments', (req, res) => PaymentController.listPayments(req, res));
router.get('/payments/:paymentId', (req, res) => PaymentController.getPaymentById(req, res));
router.put('/payments/:paymentId/status', (req, res) => PaymentController.updatePaymentStatus(req, res));
router.post('/payments/refund', (req, res) => PaymentController.processRefund(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT & TICKETS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/support-tickets', (req, res) => SupportTicketController.getUserTickets(req, res));
router.get('/support-tickets/:ticketId', (req, res) => SupportTicketController.getTicketById(req, res));
router.put('/support-tickets/:ticketId', (req, res) => SupportTicketController.updateTicket(req, res));
router.post('/support-tickets/:ticketId/reply', (req, res) => SupportTicketController.addTicketReply(req, res));
router.post('/support-tickets/:ticketId/close', (req, res) => SupportTicketController.closeTicket(req, res));
router.post('/support-tickets/:ticketId/escalate', (req, res) => SupportTicketController.escalateTicket(req, res));
router.get('/support-tickets/search', (req, res) => SupportTicketController.searchTickets(req, res));
router.get('/support-tickets/statistics', (req, res) => SupportTicketController.getTicketStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS & REPORTS (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/analytics/dashboard', (req, res) => AnalyticsController.getDashboardMetrics(req, res));
router.get('/analytics/revenue', (req, res) => AnalyticsController.getRevenueAnalytics(req, res));
router.get('/analytics/bookings', (req, res) => AnalyticsController.getBookingTrendAnalytics(req, res));
router.get('/analytics/doctors', (req, res) => AnalyticsController.getDoctorAnalytics(req, res));
router.get('/analytics/patients', (req, res) => AnalyticsController.getPatientAnalytics(req, res));
router.get('/analytics/appointments', (req, res) => AnalyticsController.getAppointmentAnalytics(req, res));
router.get('/analytics/services', (req, res) => AnalyticsController.getServiceAnalytics(req, res));
router.get('/analytics/export', (req, res) => AnalyticsController.exportAnalyticsReport(req, res));
router.post('/analytics/report', (req, res) => AnalyticsController.generateCustomReport(req, res));
router.get('/analytics/trends', (req, res) => AnalyticsController.getTrendsAnalytics(req, res));
router.get('/analytics/comparison', (req, res) => AnalyticsController.getComparisonAnalytics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/audit/log', (req, res) => AuditLogController.logAction(req, res));
router.get('/audit/logs', (req, res) => AuditLogController.getAuditLogs(req, res));
router.get('/audit/logs/user/:userId', (req, res) => AuditLogController.getUserAuditLogs(req, res));
router.get('/audit/logs/resource/:resourceType/:resourceId', (req, res) => AuditLogController.getResourceAuditLogs(req, res));
router.get('/audit/logs/action/:action', (req, res) => AuditLogController.getActionAuditLogs(req, res));
router.get('/audit/report', (req, res) => AuditLogController.generateAuditReport(req, res));
router.get('/audit/search', (req, res) => AuditLogController.searchAuditLogs(req, res));
router.get('/audit/export', (req, res) => AuditLogController.exportAuditLogs(req, res));
router.delete('/audit/logs/old', (req, res) => AuditLogController.deleteOldLogs(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/users', (req, res) => UserController.getAllUsers(req, res));
router.get('/users/:userId', (req, res) => UserController.getUserById(req, res));
router.put('/users/:userId/role', (req, res) => UserController.updateUserRole(req, res));
router.put('/users/:userId/status', (req, res) => UserController.updateUserStatus(req, res));
router.get('/users/statistics', (req, res) => UserController.getUserStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT CONVERSATIONS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/tickets', (req, res) => ChatConversationController.getAllConversations(req, res));
router.get('/tickets/:conversationId', (req, res) => ChatConversationController.getConversationById(req, res));
router.put('/tickets/:conversationId/status', (req, res) => ChatConversationController.updateTicketStatus(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/insurance/plans', (req, res) => InsuranceController.listInsurances(req, res));
router.get('/insurance/plans/:insuranceId', (req, res) => InsuranceController.getInsuranceById(req, res));
router.get('/insurance/claims', (req, res) => InsuranceController.getAllClaims(req, res));
router.put('/insurance/claims/:insuranceId/approve', (req, res) => InsuranceController.approveClaim(req, res));
router.put('/insurance/claims/:insuranceId/reject', (req, res) => InsuranceController.rejectClaim(req, res));
router.get('/insurance/statistics', (req, res) => InsuranceController.getInsuranceStatistics(req, res));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED ADMIN FEATURES (44 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', (req, res) => LabReportController.createLabReport(req, res));
router.get('/lab-reports', (req, res) => LabReportController.getAllReports(req, res));
router.get('/lab-reports/:reportId', (req, res) => LabReportController.getReportById(req, res));
router.put('/lab-reports/:reportId/status', (req, res) => LabReportController.updateReportStatus(req, res));
router.put('/lab-reports/:reportId/results', (req, res) => LabReportController.updateReportResults(req, res));
router.delete('/lab-reports/:reportId/delete', (req, res) => LabReportController.deleteLabReport(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS MANAGEMENT (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/ratings', (req, res) => RatingController.getAllRatings(req, res));
router.get('/ratings/:ratingId', (req, res) => RatingController.getRatingById(req, res));
router.delete('/ratings/:ratingId/delete', (req, res) => RatingController.deleteRating(req, res));
router.get('/ratings/statistics', (req, res) => RatingController.getRatingStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/companions', (req, res) => CompanionController.getAllCompanions(req, res));
router.get('/companions/booking/:bookingId', (req, res) => CompanionController.getBookingCompanions(req, res));
router.delete('/companions/:companionId/remove', (req, res) => CompanionController.removeCompanion(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CONDITIONS MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/conditions/patient/:patientId', (req, res) => ComorbidConditionController.getPatientConditions(req, res));
router.get('/conditions/:conditionId', (req, res) => ComorbidConditionController.getConditionById(req, res));
router.delete('/conditions/:conditionId/delete', (req, res) => ComorbidConditionController.deleteCondition(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS MANAGEMENT (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/transactions/create', (req, res) => TransactionController.createTransaction(req, res));
router.get('/transactions', (req, res) => TransactionController.getAllTransactions(req, res));
router.get('/transactions/:transactionId', (req, res) => TransactionController.getTransactionById(req, res));
router.put('/transactions/:transactionId/status', (req, res) => TransactionController.updateTransactionStatus(req, res));
router.get('/transactions/gateway/:gatewayId', (req, res) => TransactionController.getTransactionByGatewayId(req, res));
router.get('/transactions/statistics', (req, res) => TransactionController.getTransactionStatistics(req, res));
router.get('/transactions/export', (req, res) => TransactionController.exportTransactions(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LOGS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/email-logs/create', (req, res) => EmailLogController.logEmail(req, res));
router.get('/email-logs', (req, res) => EmailLogController.getEmailLogs(req, res));
router.get('/email-logs/:emailLogId', (req, res) => EmailLogController.getEmailLogById(req, res));
router.put('/email-logs/:emailLogId/status', (req, res) => EmailLogController.updateEmailStatus(req, res));
router.post('/email-logs/:emailLogId/retry', (req, res) => EmailLogController.retryFailedEmail(req, res));
router.get('/email-logs/statistics', (req, res) => EmailLogController.getEmailStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SMS LOGS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sms-logs/create', (req, res) => SMSLogController.logSMS(req, res));
router.get('/sms-logs', (req, res) => SMSLogController.getSMSLogs(req, res));
router.get('/sms-logs/:smsLogId', (req, res) => SMSLogController.getSMSLogById(req, res));
router.put('/sms-logs/:smsLogId/status', (req, res) => SMSLogController.updateSMSStatus(req, res));
router.post('/sms-logs/:smsLogId/retry', (req, res) => SMSLogController.retryFailedSMS(req, res));
router.get('/sms-logs/statistics', (req, res) => SMSLogController.getSMSStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES MANAGEMENT (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/chat-messages/conversation/:conversationId', (req, res) => ChatMessageController.getConversationMessages(req, res));
router.delete('/chat-messages/:messageId/delete', (req, res) => ChatMessageController.deleteMessage(req, res));
router.get('/chat-messages/statistics', (req, res) => ChatMessageController.getMessageStatistics(req, res));

export default router;
