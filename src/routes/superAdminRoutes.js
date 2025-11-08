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
router.post('/roles', RoleController.createRole.bind(RoleController));
router.get('/roles/:roleId', RoleController.getRoleById.bind(RoleController));
router.get('/roles', RoleController.listRoles.bind(RoleController));
router.put('/roles/:roleId', RoleController.updateRole.bind(RoleController));
router.delete('/roles/:roleId', RoleController.deleteRole.bind(RoleController));
router.post('/roles/:roleId/permissions/:permissionId', RoleController.assignPermissionToRole.bind(RoleController));
router.delete('/roles/:roleId/permissions/:permissionId', RoleController.removePermissionFromRole.bind(RoleController));
router.get('/roles/:roleId/permissions', RoleController.getRolePermissions.bind(RoleController));
router.post('/roles/clone/:roleId', RoleController.cloneRole.bind(RoleController));

// ─────────────────────────────────────────────────────────────────────────────
// PERMISSION MANAGEMENT (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/permissions', PermissionController.createPermission.bind(PermissionController));
router.get('/permissions/:permissionId', PermissionController.getPermissionById.bind(PermissionController));
router.get('/permissions', PermissionController.listPermissions.bind(PermissionController));
router.put('/permissions/:permissionId', PermissionController.updatePermission.bind(PermissionController));
router.delete('/permissions/:permissionId', PermissionController.deletePermission.bind(PermissionController));
router.get('/permissions/module/:module', PermissionController.getPermissionsByModule.bind(PermissionController));
router.post('/permissions/bulk-assign', PermissionController.bulkAssignPermissions.bind(PermissionController));

// ─────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/users', UserController.listUsers.bind(UserController));
router.get('/users/:userId/profile', UserController.getUserProfile.bind(UserController));
router.put('/users/:userId/profile', UserController.updateUserProfile.bind(UserController));
router.put('/users/:userId/deactivate', UserController.deactivateUser.bind(UserController));
router.put('/users/:userId/reactivate', UserController.reactivateUser.bind(UserController));
router.post('/users', UserController.createUser.bind(UserController));
router.delete('/users/:userId', UserController.deleteUser.bind(UserController));
router.post('/users/:userId/role/change', UserController.changeUserRole.bind(UserController));
router.post('/users/:userId/ban', UserController.banUser.bind(UserController));
router.post('/users/:userId/unban', UserController.unbanUser.bind(UserController));
router.get('/users/statistics', UserController.getUserStatistics.bind(UserController));

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/hospitals', HospitalController.createHospital.bind(HospitalController));
router.get('/hospitals', HospitalController.listHospitals.bind(HospitalController));
router.get('/hospitals/:hospitalId', HospitalController.getHospitalById.bind(HospitalController));
router.put('/hospitals/:hospitalId', HospitalController.updateHospital.bind(HospitalController));
router.delete('/hospitals/:hospitalId', HospitalController.deleteHospital.bind(HospitalController));
router.post('/hospitals/:hospitalId/services', HospitalController.addHospitalService.bind(HospitalController));
router.get('/hospitals/:hospitalId/services', HospitalController.getHospitalServices.bind(HospitalController));
router.put('/hospitals/:hospitalId/status', HospitalController.updateHospitalStatus.bind(HospitalController));
router.get('/hospitals/statistics', HospitalController.getHospitalStatistics.bind(HospitalController));

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIZATION MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/specializations', SpecializationController.createSpecialization.bind(SpecializationController));
router.get('/specializations', SpecializationController.listSpecializations.bind(SpecializationController));
router.put('/specializations/:specializationId', SpecializationController.updateSpecialization.bind(SpecializationController));
router.delete('/specializations/:specializationId', SpecializationController.deleteSpecialization.bind(SpecializationController));
router.get('/specializations/:specializationId', SpecializationController.getSpecializationById.bind(SpecializationController));

// ─────────────────────────────────────────────────────────────────────────────
// TREATMENT & PACKAGE MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/treatments', TreatmentController.createTreatment.bind(TreatmentController));
router.get('/treatments', TreatmentController.listTreatments.bind(TreatmentController));
router.put('/treatments/:treatmentId', TreatmentController.updateTreatment.bind(TreatmentController));
router.delete('/treatments/:treatmentId', TreatmentController.deleteTreatment.bind(TreatmentController));
router.post('/packages', PackageController.createPackage.bind(PackageController));
router.get('/packages', PackageController.listPackages.bind(PackageController));
router.put('/packages/:packageId', PackageController.updatePackage.bind(PackageController));
router.delete('/packages/:packageId', PackageController.deletePackage.bind(PackageController));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATE MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/email-templates', EmailTemplateController.createEmailTemplate.bind(EmailTemplateController));
router.get('/email-templates', EmailTemplateController.listEmailTemplates.bind(EmailTemplateController));
router.put('/email-templates/:templateId', EmailTemplateController.updateEmailTemplate.bind(EmailTemplateController));
router.delete('/email-templates/:templateId', EmailTemplateController.deleteEmailTemplate.bind(EmailTemplateController));
router.post('/email-templates/:templateId/preview', EmailTemplateController.previewTemplate.bind(EmailTemplateController));

// ─────────────────────────────────────────────────────────────────────────────
// SMS TEMPLATE MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sms-templates', SMSTemplateController.createSMSTemplate.bind(SMSTemplateController));
router.get('/sms-templates', SMSTemplateController.listSMSTemplates.bind(SMSTemplateController));
router.put('/sms-templates/:templateId', SMSTemplateController.updateSMSTemplate.bind(SMSTemplateController));
router.delete('/sms-templates/:templateId', SMSTemplateController.deleteSMSTemplate.bind(SMSTemplateController));
router.post('/sms-templates/:templateId/preview', SMSTemplateController.previewTemplate.bind(SMSTemplateController));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/translations', TranslationController.addTranslation.bind(TranslationController));
router.get('/translations/:language', TranslationController.getTranslationsByLanguage.bind(TranslationController));
router.put('/translations/:translationId', TranslationController.updateTranslation.bind(TranslationController));
router.delete('/translations/:translationId', TranslationController.deleteTranslation.bind(TranslationController));
router.get('/translations/languages/list', TranslationController.listLanguages.bind(TranslationController));
router.post('/translations/export/:language', TranslationController.exportTranslations.bind(TranslationController));

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE CONTENT MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/website-content', WebsiteContentController.createContent.bind(WebsiteContentController));
router.get('/website-content', WebsiteContentController.listContent.bind(WebsiteContentController));
router.put('/website-content/:contentId', WebsiteContentController.updateContent.bind(WebsiteContentController));
router.delete('/website-content/:contentId', WebsiteContentController.deleteContent.bind(WebsiteContentController));
router.get('/website-content/:contentId', WebsiteContentController.getContentById.bind(WebsiteContentController));
router.post('/website-content/publish/:contentId', WebsiteContentController.publishContent.bind(WebsiteContentController));

// ─────────────────────────────────────────────────────────────────────────────
// FAQ MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/faq', FAQController.createFAQ.bind(FAQController));
router.get('/faq', FAQController.listFAQs.bind(FAQController));
router.put('/faq/:faqId', FAQController.updateFAQ.bind(FAQController));
router.delete('/faq/:faqId', FAQController.deleteFAQ.bind(FAQController));
router.get('/faq/:faqId', FAQController.getFAQById.bind(FAQController));

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS & REPORTING (13 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/analytics/dashboard', AnalyticsController.getDashboardMetrics.bind(AnalyticsController));
router.get('/analytics/revenue', AnalyticsController.getRevenueAnalytics.bind(AnalyticsController));
router.get('/analytics/bookings', AnalyticsController.getBookingTrendAnalytics.bind(AnalyticsController));
router.get('/analytics/reports/bookings', AnalyticsController.generateBookingReport.bind(AnalyticsController));
router.get('/analytics/top-hospitals', AnalyticsController.getTopHospitals.bind(AnalyticsController));
router.get('/analytics/users', AnalyticsController.getUserAnalytics.bind(AnalyticsController));
router.get('/analytics/appointments', AnalyticsController.getAppointmentAnalytics.bind(AnalyticsController));
router.get('/analytics/services', AnalyticsController.getServiceAnalytics.bind(AnalyticsController));
router.get('/analytics/export', AnalyticsController.exportAnalyticsReport.bind(AnalyticsController));
router.post('/analytics/report', AnalyticsController.generateCustomReport.bind(AnalyticsController));
router.get('/analytics/trends', AnalyticsController.getTrendsAnalytics.bind(AnalyticsController));
router.get('/analytics/comparison', AnalyticsController.getComparisonAnalytics.bind(AnalyticsController));
router.get('/analytics/system-health', AnalyticsController.getSystemHealth.bind(AnalyticsController));

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/audit/all', AuditLogController.getAllAuditLogs.bind(AuditLogController));
router.get('/audit/report/system', AuditLogController.generateSystemReport.bind(AuditLogController));
router.get('/audit/report/detailed', AuditLogController.generateDetailedReport.bind(AuditLogController));
router.get('/audit/export', AuditLogController.exportAuditLogs.bind(AuditLogController));
router.delete('/audit/clear', AuditLogController.clearOldLogs.bind(AuditLogController));
router.get('/audit/statistics', AuditLogController.getAuditStatistics.bind(AuditLogController));
router.post('/audit/archive', AuditLogController.archiveOldLogs.bind(AuditLogController));
router.get('/audit/search/advanced', AuditLogController.advancedSearchAuditLogs.bind(AuditLogController));
router.get('/audit/logs/suspicious', AuditLogController.getSuspiciousActivities.bind(AuditLogController));
router.post('/audit/alerts/:alertId/acknowledge', AuditLogController.acknowledgeAlert.bind(AuditLogController));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/insurance/plans/create', InsuranceController.createInsurancePlan.bind(InsuranceController));
router.get('/insurance/plans', InsuranceController.listInsurances.bind(InsuranceController));
router.get('/insurance/plans/:insuranceId', InsuranceController.getInsuranceById.bind(InsuranceController));
router.put('/insurance/plans/:insuranceId/update', InsuranceController.updateInsurance.bind(InsuranceController));
router.delete('/insurance/plans/:insuranceId/delete', InsuranceController.deleteInsurance.bind(InsuranceController));
router.post('/insurance/claims/:insuranceId/approve', InsuranceController.approveClaim.bind(InsuranceController));
router.post('/insurance/claims/:insuranceId/reject', InsuranceController.rejectClaim.bind(InsuranceController));
router.get('/insurance/statistics', InsuranceController.getSystemInsuranceStatistics.bind(InsuranceController));
router.get('/insurance/claims/pending', InsuranceController.getPendingClaims.bind(InsuranceController));
router.get('/insurance/report', InsuranceController.generateInsuranceReport.bind(InsuranceController));

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM SETTINGS (12 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/settings', SettingsController.getSystemSettings.bind(SettingsController));
router.put('/settings/update', SettingsController.updateSystemSettings.bind(SettingsController));
router.get('/settings/email', SettingsController.getEmailSettings.bind(SettingsController));
router.put('/settings/email/update', SettingsController.updateEmailSettings.bind(SettingsController));
router.get('/settings/sms', SettingsController.getSMSSettings.bind(SettingsController));
router.put('/settings/sms/update', SettingsController.updateSMSSettings.bind(SettingsController));
router.get('/settings/payment', SettingsController.getPaymentSettings.bind(SettingsController));
router.put('/settings/payment/update', SettingsController.updatePaymentSettings.bind(SettingsController));
router.post('/settings/backup/create', SettingsController.createBackup.bind(SettingsController));
router.get('/settings/backup/list', SettingsController.listBackups.bind(SettingsController));
router.post('/settings/backup/:backupId/restore', SettingsController.restoreBackup.bind(SettingsController));
router.get('/settings/security', SettingsController.getSecuritySettings.bind(SettingsController));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - COMPREHENSIVE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/profiles', ProfileController.getAllProfiles.bind(ProfileController));
router.get('/profiles/:userId', ProfileController.getProfile.bind(ProfileController));
router.put('/profiles/:userId/update', ProfileController.updateProfile.bind(ProfileController));
router.delete('/profiles/:userId/delete', ProfileController.deleteProfile.bind(ProfileController));
router.get('/profiles/statistics', ProfileController.getProfileStatistics.bind(ProfileController));

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS MANAGEMENT (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/lab-reports/create', LabReportController.createLabReport.bind(LabReportController));
router.get('/lab-reports', LabReportController.getAllReports.bind(LabReportController));
router.get('/lab-reports/:reportId', LabReportController.getReportById.bind(LabReportController));
router.put('/lab-reports/:reportId/status', LabReportController.updateReportStatus.bind(LabReportController));
router.put('/lab-reports/:reportId/results', LabReportController.updateReportResults.bind(LabReportController));
router.delete('/lab-reports/:reportId/delete', LabReportController.deleteLabReport.bind(LabReportController));
router.get('/lab-reports/statistics', LabReportController.getReportStatistics.bind(LabReportController));
router.get('/lab-reports/export', LabReportController.exportReports.bind(LabReportController));

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/ratings', RatingController.getAllRatings.bind(RatingController));
router.get('/ratings/:ratingId', RatingController.getRatingById.bind(RatingController));
router.delete('/ratings/:ratingId/delete', RatingController.deleteRating.bind(RatingController));
router.get('/ratings/statistics', RatingController.getRatingStatistics.bind(RatingController));
router.get('/ratings/reports', RatingController.getReportedRatings.bind(RatingController));
router.put('/ratings/:ratingId/verify', RatingController.verifyRating.bind(RatingController));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/companions', CompanionController.getAllCompanions.bind(CompanionController));
router.get('/companions/:companionId', CompanionController.getCompanionById.bind(CompanionController));
router.get('/companions/booking/:bookingId', CompanionController.getBookingCompanions.bind(CompanionController));
router.delete('/companions/:companionId/remove', CompanionController.removeCompanion.bind(CompanionController));
router.get('/companions/statistics', CompanionController.getCompanionStatistics.bind(CompanionController));

// ─────────────────────────────────────────────────────────────────────────────
// CONDITIONS MANAGEMENT (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/conditions', ComorbidConditionController.getAllConditions.bind(ComorbidConditionController));
router.get('/conditions/patient/:patientId', ComorbidConditionController.getPatientConditions.bind(ComorbidConditionController));
router.get('/conditions/:conditionId', ComorbidConditionController.getConditionById.bind(ComorbidConditionController));
router.delete('/conditions/:conditionId/delete', ComorbidConditionController.deleteCondition.bind(ComorbidConditionController));
router.get('/conditions/statistics', ComorbidConditionController.getConditionStatistics.bind(ComorbidConditionController));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS MANAGEMENT (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/transactions/create', TransactionController.createTransaction.bind(TransactionController));
router.get('/transactions', TransactionController.getAllTransactions.bind(TransactionController));
router.get('/transactions/:transactionId', TransactionController.getTransactionById.bind(TransactionController));
router.put('/transactions/:transactionId/status', TransactionController.updateTransactionStatus.bind(TransactionController));
router.get('/transactions/gateway/:gatewayId', TransactionController.getTransactionByGatewayId.bind(TransactionController));
router.get('/transactions/statistics', TransactionController.getTransactionStatistics.bind(TransactionController));
router.get('/transactions/export', TransactionController.exportTransactions.bind(TransactionController));
router.get('/transactions/failed', TransactionController.getFailedTransactions.bind(TransactionController));
router.post('/transactions/:transactionId/refund', TransactionController.refundTransaction.bind(TransactionController));
router.get('/transactions/revenue-report', TransactionController.getRevenueReport.bind(TransactionController));

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LOGS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/email-logs/create', EmailLogController.logEmail.bind(EmailLogController));
router.get('/email-logs', EmailLogController.getEmailLogs.bind(EmailLogController));
router.get('/email-logs/:emailLogId', EmailLogController.getEmailLogById.bind(EmailLogController));
router.put('/email-logs/:emailLogId/status', EmailLogController.updateEmailStatus.bind(EmailLogController));
router.post('/email-logs/:emailLogId/retry', EmailLogController.retryFailedEmail.bind(EmailLogController));
router.get('/email-logs/statistics', EmailLogController.getEmailStatistics.bind(EmailLogController));
router.get('/email-logs/failed', EmailLogController.getFailedEmails.bind(EmailLogController));
router.delete('/email-logs/cleanup', EmailLogController.cleanupOldLogs.bind(EmailLogController));

// ─────────────────────────────────────────────────────────────────────────────
// SMS LOGS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sms-logs/create', SMSLogController.logSMS.bind(SMSLogController));
router.get('/sms-logs', SMSLogController.getSMSLogs.bind(SMSLogController));
router.get('/sms-logs/:smsLogId', SMSLogController.getSMSLogById.bind(SMSLogController));
router.put('/sms-logs/:smsLogId/status', SMSLogController.updateSMSStatus.bind(SMSLogController));
router.post('/sms-logs/:smsLogId/retry', SMSLogController.retryFailedSMS.bind(SMSLogController));
router.get('/sms-logs/statistics', SMSLogController.getSMSStatistics.bind(SMSLogController));
router.get('/sms-logs/failed', SMSLogController.getFailedSMS.bind(SMSLogController));
router.delete('/sms-logs/cleanup', SMSLogController.cleanupOldLogs.bind(SMSLogController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES MANAGEMENT (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/chat-messages', ChatMessageController.getAllMessages.bind(ChatMessageController));
router.get('/chat-messages/conversation/:conversationId', ChatMessageController.getConversationMessages.bind(ChatMessageController));
router.delete('/chat-messages/:messageId/delete', ChatMessageController.deleteMessage.bind(ChatMessageController));
router.get('/chat-messages/statistics', ChatMessageController.getMessageStatistics.bind(ChatMessageController));
router.get('/chat-messages/flagged', ChatMessageController.getFlaggedMessages.bind(ChatMessageController));
router.post('/chat-messages/:messageId/moderate', ChatMessageController.moderateMessage.bind(ChatMessageController));

export default router;