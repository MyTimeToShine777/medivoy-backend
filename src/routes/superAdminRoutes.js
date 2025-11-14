'use strict';

import { Router } from 'express';

import RoleController from '../controllers/RoleController.js';
import PermissionController from '../controllers/PermissionController.js';
import UserController from '../controllers/UserController.js';
import HospitalController from '../controllers/HospitalController.js';
import SpecializationController from '../controllers/SpecializationController.js';
import TreatmentController from '../controllers/TreatmentController.js';
import PackageController from '../controllers/PackageController.js';
import EmailTemplateController from '../controllers/EmailTemplateController.js';
import SMSTemplateController from '../controllers/SMSTemplateController.js';
import TranslationController from '../controllers/TranslationController.js';
import WebsiteContentController from '../controllers/WebsiteContentController.js';
import AnalyticsController from '../controllers/AnalyticsController.js';
import FAQController from '../controllers/FAQController.js';
import AuditLogController from '../controllers/AuditLogController.js';
import InsuranceController from '../controllers/InsuranceController.js';
import SettingsController from '../controllers/SettingsController.js';
import ProfileController from '../controllers/ProfileController.js';
import RatingController from '../controllers/RatingController.js';
import LabReportController from '../controllers/LabReportController.js';
import CompanionController from '../controllers/CompanionController.js';
import ComorbidConditionController from '../controllers/ComorbidConditionController.js';
import TransactionController from '../controllers/TransactionController.js';
import EmailLogController from '../controllers/EmailLogController.js';
import SMSLogController from '../controllers/SMSLogController.js';
import ChatMessageController from '../controllers/ChatMessageController.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN ROUTES - ULTRA-COMPREHENSIVE (150+ ENDPOINTS)
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// ROLE MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/roles', (req, res) => RoleController.createRole(req, res));
router.get('/roles/:roleId', (req, res) => RoleController.getRoleById(req, res));
router.get('/roles', (req, res) => RoleController.listRoles(req, res));
router.put('/roles/:roleId', (req, res) => RoleController.updateRole(req, res));
router.delete('/roles/:roleId', (req, res) => RoleController.deleteRole(req, res));
router.post('/roles/:roleId/permissions/:permissionId', (req, res) => RoleController.assignPermissionToRole(req, res));
router.delete('/roles/:roleId/permissions/:permissionId', (req, res) => RoleController.removePermissionFromRole(req, res));
router.get('/roles/:roleId/permissions', (req, res) => RoleController.getRolePermissions(req, res));
router.post('/roles/clone/:roleId', (req, res) => RoleController.cloneRole(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PERMISSION MANAGEMENT (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/permissions', (req, res) => PermissionController.createPermission(req, res));
router.get('/permissions/:permissionId', (req, res) => PermissionController.getPermissionById(req, res));
router.get('/permissions', (req, res) => PermissionController.listPermissions(req, res));
router.put('/permissions/:permissionId', (req, res) => PermissionController.updatePermission(req, res));
router.delete('/permissions/:permissionId', (req, res) => PermissionController.deletePermission(req, res));
router.get('/permissions/module/:module', (req, res) => PermissionController.getPermissionsByModule(req, res));
router.post('/permissions/bulk-assign', (req, res) => PermissionController.bulkAssignPermissions(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/users', (req, res) => UserController.listUsers(req, res));
router.get('/users/:userId/profile', (req, res) => UserController.getUserProfile(req, res));
router.put('/users/:userId/profile', (req, res) => UserController.updateUserProfile(req, res));
router.put('/users/:userId/deactivate', (req, res) => UserController.deactivateUser(req, res));
router.put('/users/:userId/reactivate', (req, res) => UserController.reactivateUser(req, res));
router.post('/users', (req, res) => UserController.createUser(req, res));
router.delete('/users/:userId', (req, res) => UserController.deleteUser(req, res));
router.post('/users/:userId/role/change', (req, res) => UserController.changeUserRole(req, res));
router.post('/users/:userId/ban', (req, res) => UserController.banUser(req, res));
router.post('/users/:userId/unban', (req, res) => UserController.unbanUser(req, res));
router.get('/users/statistics', (req, res) => UserController.getUserStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/hospitals', (req, res) => HospitalController.createHospital(req, res));
router.get('/hospitals', (req, res) => HospitalController.listHospitals(req, res));
router.get('/hospitals/:hospitalId', (req, res) => HospitalController.getHospitalById(req, res));
router.put('/hospitals/:hospitalId', (req, res) => HospitalController.updateHospital(req, res));
router.delete('/hospitals/:hospitalId', (req, res) => HospitalController.deleteHospital(req, res));
router.post('/hospitals/:hospitalId/services', (req, res) => HospitalController.addHospitalService(req, res));
router.get('/hospitals/:hospitalId/services', (req, res) => HospitalController.getHospitalServices(req, res));
router.put('/hospitals/:hospitalId/status', (req, res) => HospitalController.updateHospitalStatus(req, res));
router.get('/hospitals/statistics', (req, res) => HospitalController.getHospitalStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIZATION MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/specializations', (req, res) => SpecializationController.createSpecialization(req, res));
router.get('/specializations', (req, res) => SpecializationController.listSpecializations(req, res));
router.put('/specializations/:specializationId', (req, res) => SpecializationController.updateSpecialization(req, res));
router.delete('/specializations/:specializationId', (req, res) => SpecializationController.deleteSpecialization(req, res));
router.get('/specializations/:specializationId', (req, res) => SpecializationController.getSpecializationById(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TREATMENT & PACKAGE MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/treatments', (req, res) => TreatmentController.createTreatment(req, res));
router.get('/treatments', (req, res) => TreatmentController.listTreatments(req, res));
router.put('/treatments/:treatmentId', (req, res) => TreatmentController.updateTreatment(req, res));
router.delete('/treatments/:treatmentId', (req, res) => TreatmentController.deleteTreatment(req, res));
router.post('/packages', (req, res) => PackageController.createPackage(req, res));
router.get('/packages', (req, res) => PackageController.listPackages(req, res));
router.put('/packages/:packageId', (req, res) => PackageController.updatePackage(req, res));
router.delete('/packages/:packageId', (req, res) => PackageController.deletePackage(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATE MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/email-templates', (req, res) => EmailTemplateController.createEmailTemplate(req, res));
router.get('/email-templates', (req, res) => EmailTemplateController.listEmailTemplates(req, res));
router.put('/email-templates/:templateId', (req, res) => EmailTemplateController.updateEmailTemplate(req, res));
router.delete('/email-templates/:templateId', (req, res) => EmailTemplateController.deleteEmailTemplate(req, res));
router.post('/email-templates/:templateId/preview', (req, res) => EmailTemplateController.previewTemplate(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SMS TEMPLATE MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sms-templates', (req, res) => SMSTemplateController.createSMSTemplate(req, res));
router.get('/sms-templates', (req, res) => SMSTemplateController.listSMSTemplates(req, res));
router.put('/sms-templates/:templateId', (req, res) => SMSTemplateController.updateSMSTemplate(req, res));
router.delete('/sms-templates/:templateId', (req, res) => SMSTemplateController.deleteSMSTemplate(req, res));
router.post('/sms-templates/:templateId/preview', (req, res) => SMSTemplateController.previewTemplate(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/translations', (req, res) => TranslationController.addTranslation(req, res));
router.get('/translations/:language', (req, res) => TranslationController.getTranslationsByLanguage(req, res));
router.put('/translations/:translationId', (req, res) => TranslationController.updateTranslation(req, res));
router.delete('/translations/:translationId', (req, res) => TranslationController.deleteTranslation(req, res));
router.get('/translations/languages/list', (req, res) => TranslationController.listLanguages(req, res));
router.post('/translations/export/:language', (req, res) => TranslationController.exportTranslations(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE CONTENT MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/website-content', (req, res) => WebsiteContentController.createContent(req, res));
router.get('/website-content', (req, res) => WebsiteContentController.listContent(req, res));
router.put('/website-content/:contentId', (req, res) => WebsiteContentController.updateContent(req, res));
router.delete('/website-content/:contentId', (req, res) => WebsiteContentController.deleteContent(req, res));
router.get('/website-content/:contentId', (req, res) => WebsiteContentController.getContentById(req, res));
router.post('/website-content/publish/:contentId', (req, res) => WebsiteContentController.publishContent(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// FAQ MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/faq', (req, res) => FAQController.createFAQ(req, res));
router.get('/faq', (req, res) => FAQController.listFAQs(req, res));
router.put('/faq/:faqId', (req, res) => FAQController.updateFAQ(req, res));
router.delete('/faq/:faqId', (req, res) => FAQController.deleteFAQ(req, res));
router.get('/faq/:faqId', (req, res) => FAQController.getFAQById(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS & REPORTING (13 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/analytics/dashboard', (req, res) => AnalyticsController.getDashboardMetrics(req, res));
router.get('/analytics/revenue', (req, res) => AnalyticsController.getRevenueAnalytics(req, res));
router.get('/analytics/bookings', (req, res) => AnalyticsController.getBookingTrendAnalytics(req, res));
router.get('/analytics/reports/bookings', (req, res) => AnalyticsController.generateBookingReport(req, res));
router.get('/analytics/top-hospitals', (req, res) => AnalyticsController.getTopHospitals(req, res));
router.get('/analytics/users', (req, res) => AnalyticsController.getUserAnalytics(req, res));
router.get('/analytics/appointments', (req, res) => AnalyticsController.getAppointmentAnalytics(req, res));
router.get('/analytics/services', (req, res) => AnalyticsController.getServiceAnalytics(req, res));
router.get('/analytics/export', (req, res) => AnalyticsController.exportAnalyticsReport(req, res));
router.post('/analytics/report', (req, res) => AnalyticsController.generateCustomReport(req, res));
router.get('/analytics/trends', (req, res) => AnalyticsController.getTrendsAnalytics(req, res));
router.get('/analytics/comparison', (req, res) => AnalyticsController.getComparisonAnalytics(req, res));
router.get('/analytics/system-health', (req, res) => AnalyticsController.getSystemHealth(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/audit/all', (req, res) => AuditLogController.getAllAuditLogs(req, res));
router.get('/audit/report/system', (req, res) => AuditLogController.generateSystemReport(req, res));
router.get('/audit/report/detailed', (req, res) => AuditLogController.generateDetailedReport(req, res));
router.get('/audit/export', (req, res) => AuditLogController.exportAuditLogs(req, res));
router.delete('/audit/clear', (req, res) => AuditLogController.clearOldLogs(req, res));
router.get('/audit/statistics', (req, res) => AuditLogController.getAuditStatistics(req, res));
router.post('/audit/archive', (req, res) => AuditLogController.archiveOldLogs(req, res));
router.get('/audit/search/advanced', (req, res) => AuditLogController.advancedSearchAuditLogs(req, res));
router.get('/audit/logs/suspicious', (req, res) => AuditLogController.getSuspiciousActivities(req, res));
router.post('/audit/alerts/:alertId/acknowledge', (req, res) => AuditLogController.acknowledgeAlert(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/insurance/plans/create', (req, res) => InsuranceController.createInsurancePlan(req, res));
router.get('/insurance/plans', (req, res) => InsuranceController.listInsurances(req, res));
router.get('/insurance/plans/:insuranceId', (req, res) => InsuranceController.getInsuranceById(req, res));
router.put('/insurance/plans/:insuranceId/update', (req, res) => InsuranceController.updateInsurance(req, res));
router.delete('/insurance/plans/:insuranceId/delete', (req, res) => InsuranceController.deleteInsurance(req, res));
router.post('/insurance/claims/:insuranceId/approve', (req, res) => InsuranceController.approveClaim(req, res));
router.post('/insurance/claims/:insuranceId/reject', (req, res) => InsuranceController.rejectClaim(req, res));
router.get('/insurance/statistics', (req, res) => InsuranceController.getSystemInsuranceStatistics(req, res));
router.get('/insurance/claims/pending', (req, res) => InsuranceController.getPendingClaims(req, res));
router.get('/insurance/report', (req, res) => InsuranceController.generateInsuranceReport(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM SETTINGS (12 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/settings', (req, res) => SettingsController.getSystemSettings(req, res));
router.put('/settings/update', (req, res) => SettingsController.updateSystemSettings(req, res));
router.get('/settings/email', (req, res) => SettingsController.getEmailSettings(req, res));
router.put('/settings/email/update', (req, res) => SettingsController.updateEmailSettings(req, res));
router.get('/settings/sms', (req, res) => SettingsController.getSMSSettings(req, res));
router.put('/settings/sms/update', (req, res) => SettingsController.updateSMSSettings(req, res));
router.get('/settings/payment', (req, res) => SettingsController.getPaymentSettings(req, res));
router.put('/settings/payment/update', (req, res) => SettingsController.updatePaymentSettings(req, res));
router.post('/settings/backup/create', (req, res) => SettingsController.createBackup(req, res));
router.get('/settings/backup/list', (req, res) => SettingsController.listBackups(req, res));
router.post('/settings/backup/:backupId/restore', (req, res) => SettingsController.restoreBackup(req, res));
router.get('/settings/security', (req, res) => SettingsController.getSecuritySettings(req, res));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - COMPREHENSIVE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/profiles', (req, res) => ProfileController.getAllProfiles(req, res));
router.get('/profiles/:userId', (req, res) => ProfileController.getProfile(req, res));
router.put('/profiles/:userId/update', (req, res) => ProfileController.updateProfile(req, res));
router.delete('/profiles/:userId/delete', (req, res) => ProfileController.deleteProfile(req, res));
router.get('/profiles/statistics', (req, res) => ProfileController.getProfileStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', (req, res) => LabReportController.createLabReport(req, res));
router.get('/lab-reports', (req, res) => LabReportController.getAllReports(req, res));
router.get('/lab-reports/:reportId', (req, res) => LabReportController.getReportById(req, res));
router.put('/lab-reports/:reportId/status', (req, res) => LabReportController.updateReportStatus(req, res));
router.put('/lab-reports/:reportId/results', (req, res) => LabReportController.updateReportResults(req, res));
router.delete('/lab-reports/:reportId/delete', (req, res) => LabReportController.deleteLabReport(req, res));
router.get('/lab-reports/statistics', (req, res) => LabReportController.getReportStatistics(req, res));
router.get('/lab-reports/export', (req, res) => LabReportController.exportReports(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/ratings', (req, res) => RatingController.getAllRatings(req, res));
router.get('/ratings/:ratingId', (req, res) => RatingController.getRatingById(req, res));
router.delete('/ratings/:ratingId/delete', (req, res) => RatingController.deleteRating(req, res));
router.get('/ratings/statistics', (req, res) => RatingController.getRatingStatistics(req, res));
router.get('/ratings/reports', (req, res) => RatingController.getReportedRatings(req, res));
router.put('/ratings/:ratingId/verify', (req, res) => RatingController.verifyRating(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/companions', (req, res) => CompanionController.getAllCompanions(req, res));
router.get('/companions/:companionId', (req, res) => CompanionController.getCompanionById(req, res));
router.get('/companions/booking/:bookingId', (req, res) => CompanionController.getBookingCompanions(req, res));
router.delete('/companions/:companionId/remove', (req, res) => CompanionController.removeCompanion(req, res));
router.get('/companions/statistics', (req, res) => CompanionController.getCompanionStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CONDITIONS MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/conditions', (req, res) => ComorbidConditionController.getAllConditions(req, res));
router.get('/conditions/patient/:patientId', (req, res) => ComorbidConditionController.getPatientConditions(req, res));
router.get('/conditions/:conditionId', (req, res) => ComorbidConditionController.getConditionById(req, res));
router.delete('/conditions/:conditionId/delete', (req, res) => ComorbidConditionController.deleteCondition(req, res));
router.get('/conditions/statistics', (req, res) => ComorbidConditionController.getConditionStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS MANAGEMENT (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/transactions/create', (req, res) => TransactionController.createTransaction(req, res));
router.get('/transactions', (req, res) => TransactionController.getAllTransactions(req, res));
router.get('/transactions/:transactionId', (req, res) => TransactionController.getTransactionById(req, res));
router.put('/transactions/:transactionId/status', (req, res) => TransactionController.updateTransactionStatus(req, res));
router.get('/transactions/gateway/:gatewayId', (req, res) => TransactionController.getTransactionByGatewayId(req, res));
router.get('/transactions/statistics', (req, res) => TransactionController.getTransactionStatistics(req, res));
router.get('/transactions/export', (req, res) => TransactionController.exportTransactions(req, res));
router.get('/transactions/failed', (req, res) => TransactionController.getFailedTransactions(req, res));
router.post('/transactions/:transactionId/refund', (req, res) => TransactionController.refundTransaction(req, res));
router.get('/transactions/revenue-report', (req, res) => TransactionController.getRevenueReport(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LOGS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/email-logs/create', (req, res) => EmailLogController.logEmail(req, res));
router.get('/email-logs', (req, res) => EmailLogController.getEmailLogs(req, res));
router.get('/email-logs/:emailLogId', (req, res) => EmailLogController.getEmailLogById(req, res));
router.put('/email-logs/:emailLogId/status', (req, res) => EmailLogController.updateEmailStatus(req, res));
router.post('/email-logs/:emailLogId/retry', (req, res) => EmailLogController.retryFailedEmail(req, res));
router.get('/email-logs/statistics', (req, res) => EmailLogController.getEmailStatistics(req, res));
router.get('/email-logs/failed', (req, res) => EmailLogController.getFailedEmails(req, res));
router.delete('/email-logs/cleanup', (req, res) => EmailLogController.cleanupOldLogs(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SMS LOGS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sms-logs/create', (req, res) => SMSLogController.logSMS(req, res));
router.get('/sms-logs', (req, res) => SMSLogController.getSMSLogs(req, res));
router.get('/sms-logs/:smsLogId', (req, res) => SMSLogController.getSMSLogById(req, res));
router.put('/sms-logs/:smsLogId/status', (req, res) => SMSLogController.updateSMSStatus(req, res));
router.post('/sms-logs/:smsLogId/retry', (req, res) => SMSLogController.retryFailedSMS(req, res));
router.get('/sms-logs/statistics', (req, res) => SMSLogController.getSMSStatistics(req, res));
router.get('/sms-logs/failed', (req, res) => SMSLogController.getFailedSMS(req, res));
router.delete('/sms-logs/cleanup', (req, res) => SMSLogController.cleanupOldLogs(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/chat-messages', (req, res) => ChatMessageController.getAllMessages(req, res));
router.get('/chat-messages/conversation/:conversationId', (req, res) => ChatMessageController.getConversationMessages(req, res));
router.delete('/chat-messages/:messageId/delete', (req, res) => ChatMessageController.deleteMessage(req, res));
router.get('/chat-messages/statistics', (req, res) => ChatMessageController.getMessageStatistics(req, res));
router.get('/chat-messages/flagged', (req, res) => ChatMessageController.getFlaggedMessages(req, res));
router.post('/chat-messages/:messageId/moderate', (req, res) => ChatMessageController.moderateMessage(req, res));

export default router;