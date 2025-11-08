'use strict';

import { Router } from 'express';
import BookingController from '../controllers/BookingController.js';
import AppointmentController from '../controllers/AppointmentController.js';
import PrescriptionController from '../controllers/PrescriptionController.js';
import MedicalRecordController from '../controllers/MedicalRecordController.js';
import DocumentController from '../controllers/DocumentController.js';
import ReviewController from '../controllers/ReviewController.js';
import PaymentController from '../controllers/PaymentController.js';
import InvoiceController from '../controllers/InvoiceController.js';
import SearchController from '../controllers/SearchController.js';
import FilterController from '../controllers/FilterController.js';
import PackageController from '../controllers/PackageController.js';
import LaboratoryController from '../controllers/LaboratoryController.js';
import UserController from '../controllers/UserController.js';
import NotificationController from '../controllers/NotificationController.js';
import SupportTicketController from '../controllers/SupportTicketController.js';
import TravelController from '../controllers/TravelController.js';
import PatientController from '../controllers/PatientController.js';
import ChatController from '../controllers/ChatController.js';
import InsuranceController from '../controllers/InsuranceController.js';
import CouponController from '../controllers/CouponController.js';
import FlightController from '../controllers/FlightController.js';
import AccommodationController from '../controllers/AccommodationController.js';
import InsuranceDocumentController from '../controllers/InsuranceDocumentController.js';
import ProfileController from '../controllers/ProfileController.js';
import RatingController from '../controllers/RatingController.js';
import LabReportController from '../controllers/LabReportController.js';
import CompanionController from '../controllers/CompanionController.js';
import ComorbidConditionController from '../controllers/ComorbidConditionController.js';
import TransactionController from '../controllers/TransactionController.js';
import ChatMessageController from '../controllers/ChatMessageController.js';

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT ROUTES - ULTRA-COMPREHENSIVE (220 ENDPOINTS)
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH & DISCOVERY (12 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/search', SearchController.globalSearch.bind(SearchController));
router.get('/search/hospitals', SearchController.searchHospitals.bind(SearchController));
router.get('/search/doctors', SearchController.searchDoctors.bind(SearchController));
router.get('/search/treatments', SearchController.searchTreatments.bind(SearchController));
router.get('/search/advanced', SearchController.advancedSearch.bind(SearchController));
router.get('/search/nearby', SearchController.searchNearby.bind(SearchController));
router.get('/search/recommendations', SearchController.getRecommendations.bind(SearchController));

router.get('/filter/hospitals', FilterController.filterHospitals.bind(FilterController));
router.get('/filter/doctors', FilterController.filterDoctors.bind(FilterController));
router.get('/filter/treatments', FilterController.filterTreatments.bind(FilterController));
router.get('/filter/packages', FilterController.filterPackages.bind(FilterController));
router.get('/filter/options', FilterController.getFilterOptions.bind(FilterController));

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES & TREATMENTS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/packages', PackageController.listPackages.bind(PackageController));
router.get('/packages/:packageId', PackageController.getPackageById.bind(PackageController));
router.get('/packages/featured', PackageController.getFeaturedPackages.bind(PackageController));
router.get('/packages/treatment/:treatmentId', PackageController.getPackagesByTreatment.bind(PackageController));
router.post('/packages/:packageId/compare', PackageController.comparePackages.bind(PackageController));
router.get('/packages/search', PackageController.searchPackages.bind(PackageController));
router.get('/packages/:packageId/reviews', PackageController.getPackageReviews.bind(PackageController));

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/bookings', BookingController.createBooking.bind(BookingController));
router.get('/bookings', BookingController.getUserBookings.bind(BookingController));
router.get('/bookings/:bookingId', BookingController.getBookingById.bind(BookingController));
router.put('/bookings/:bookingId', BookingController.updateBooking.bind(BookingController));
router.delete('/bookings/:bookingId', BookingController.cancelBooking.bind(BookingController));
router.get('/bookings/:bookingId/history', BookingController.getBookingHistory.bind(BookingController));
router.post('/bookings/:bookingId/reschedule', BookingController.rescheduleBooking.bind(BookingController));
router.get('/bookings/upcoming', BookingController.getUpcomingBookings.bind(BookingController));
router.get('/bookings/past', BookingController.getPastBookings.bind(BookingController));

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENTS (15 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/appointments', AppointmentController.bookAppointment.bind(AppointmentController));
router.post('/appointments/book', AppointmentController.bookAppointment.bind(AppointmentController));
router.get('/appointments', AppointmentController.getUserAppointments.bind(AppointmentController));
router.get('/appointments/:appointmentId', AppointmentController.getAppointmentById.bind(AppointmentController));
router.put('/appointments/:appointmentId/reschedule', AppointmentController.rescheduleAppointment.bind(AppointmentController));
router.delete('/appointments/:appointmentId', AppointmentController.cancelAppointment.bind(AppointmentController));
router.get('/doctors/:doctorId/available-slots', AppointmentController.getAvailableSlots.bind(AppointmentController));
router.post('/appointments/:callId/start', AppointmentController.startConsultation.bind(AppointmentController));
router.get('/appointments/status/:status', AppointmentController.getAppointmentsByStatus.bind(AppointmentController));
router.get('/appointments/upcoming', AppointmentController.getUpcomingAppointments.bind(AppointmentController));
router.get('/appointments/history', AppointmentController.getAppointmentHistory.bind(AppointmentController));
router.post('/appointments/:appointmentId/reschedule-request', AppointmentController.requestReschedule.bind(AppointmentController));
router.post('/appointments/:appointmentId/confirm', AppointmentController.confirmAppointment.bind(AppointmentController));
router.get('/appointments/filter', AppointmentController.filterAppointments.bind(AppointmentController));
router.post('/appointments/:appointmentId/join-video', AppointmentController.joinVideoConsultation.bind(AppointmentController));

// ─────────────────────────────────────────────────────────────────────────────
// CONSULTATIONS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/consultations/:appointmentId/create', AppointmentController.createConsultation.bind(AppointmentController));
router.get('/consultations', AppointmentController.getUserConsultations.bind(AppointmentController));
router.post('/consultations/:callId/start', AppointmentController.startConsultation.bind(AppointmentController));
router.post('/consultations/:callId/end', AppointmentController.endConsultation.bind(AppointmentController));
router.get('/consultations/:callId', AppointmentController.getConsultationDetails.bind(AppointmentController));
router.get('/consultations/status/:status', AppointmentController.getConsultationsByStatus.bind(AppointmentController));
router.post('/consultations/:callId/save-notes', AppointmentController.saveConsultationNotes.bind(AppointmentController));
router.get('/consultations/:callId/recording', AppointmentController.getConsultationRecording.bind(AppointmentController));
router.post('/consultations/:callId/prescription', AppointmentController.getPrescription.bind(AppointmentController));
router.get('/consultations/:callId/summary', AppointmentController.getConsultationSummary.bind(AppointmentController));

// ─────────────────────────────────────────────────────────────────────────────
// PRESCRIPTIONS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/prescriptions', PrescriptionController.getUserPrescriptions.bind(PrescriptionController));
router.get('/prescriptions/:prescriptionId', PrescriptionController.getPrescriptionById.bind(PrescriptionController));
router.get('/prescriptions/:prescriptionId/download', PrescriptionController.downloadPrescription.bind(PrescriptionController));
router.post('/prescriptions/:prescriptionId/refill', PrescriptionController.refillPrescription.bind(PrescriptionController));
router.get('/prescriptions/active', PrescriptionController.getActivePrescriptions.bind(PrescriptionController));

// ─────────────────────────────────────────────────────────────────────────────
// MEDICAL RECORDS & DOCUMENTS (15 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/medical-records', MedicalRecordController.createMedicalRecord.bind(MedicalRecordController));
router.get('/medical-records', MedicalRecordController.getUserMedicalRecords.bind(MedicalRecordController));
router.get('/medical-records/:recordId', MedicalRecordController.getMedicalRecordById.bind(MedicalRecordController));
router.put('/medical-records/:recordId', MedicalRecordController.updateMedicalRecord.bind(MedicalRecordController));
router.delete('/medical-records/:recordId', MedicalRecordController.deleteMedicalRecord.bind(MedicalRecordController));
router.post('/medical-records/:recordId/share', MedicalRecordController.shareMedicalRecord.bind(MedicalRecordController));
router.get('/medical-records/:recordId/export', MedicalRecordController.exportMedicalRecord.bind(MedicalRecordController));
router.post('/medical-records/:recordId/archive', MedicalRecordController.archiveMedicalRecord.bind(MedicalRecordController));

router.post('/documents/medical/:bookingId', DocumentController.uploadMedicalDocument.bind(DocumentController));
router.get('/documents/medical/:bookingId', DocumentController.getMedicalDocuments.bind(DocumentController));
router.post('/documents/patient', DocumentController.uploadPatientDocument.bind(DocumentController));
router.get('/documents/patient', DocumentController.getPatientDocuments.bind(DocumentController));
router.put('/documents/:documentId', DocumentController.updatePatientDocument.bind(DocumentController));
router.delete('/documents/:documentId', DocumentController.deletePatientDocument.bind(DocumentController));
router.get('/documents/:documentId/download', DocumentController.downloadDocument.bind(DocumentController));

// ─────────────────────────────────────────────────────────────────────────────
// LABORATORY (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/laboratory/order', LaboratoryController.orderLabTest.bind(LaboratoryController));
router.get('/laboratory/orders', LaboratoryController.getUserLabOrders.bind(LaboratoryController));
router.get('/laboratory/result/:resultId', LaboratoryController.getLabResult.bind(LaboratoryController));
router.get('/laboratory/result/:resultId/download', LaboratoryController.downloadLabResult.bind(LaboratoryController));
router.get('/laboratory/tests', LaboratoryController.getAvailableTests.bind(LaboratoryController));

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS & INVOICES (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/payments/:bookingId', PaymentController.createPayment.bind(PaymentController));
router.post('/payments/:paymentId/verify', PaymentController.verifyPayment.bind(PaymentController));
router.post('/payments/initialize', PaymentController.initializePayment.bind(PaymentController));
router.get('/payments/history', PaymentController.getPaymentHistory.bind(PaymentController));
router.get('/payments/:paymentId', PaymentController.getPaymentDetails.bind(PaymentController));

router.get('/invoices', InvoiceController.listInvoices.bind(InvoiceController));
router.get('/invoices/:invoiceId', InvoiceController.getInvoiceById.bind(InvoiceController));
router.post('/invoices/:invoiceId/pay', InvoiceController.markInvoicePaid.bind(InvoiceController));
router.get('/invoices/:invoiceId/pdf', InvoiceController.generateInvoicePDF.bind(InvoiceController));

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS & RATINGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/reviews/booking/:bookingId', ReviewController.createBookingReview.bind(ReviewController));
router.get('/reviews/stats', ReviewController.getReviewStatistics.bind(ReviewController));
router.get('/reviews/my-reviews', ReviewController.getUserReviews.bind(ReviewController));

// ─────────────────────────────────────────────────────────────────────────────
// TRAVEL ARRANGEMENTS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/travel/flights/:bookingId', TravelController.bookFlight.bind(TravelController));
router.get('/travel/flights/:bookingId', TravelController.getFlightsByBooking.bind(TravelController));
router.delete('/travel/flights/:flightId', TravelController.cancelFlight.bind(TravelController));
router.post('/travel/hotels/:bookingId', TravelController.bookHotel.bind(TravelController));
router.get('/travel/hotels/:bookingId', TravelController.getHotelsByBooking.bind(TravelController));
router.put('/travel/hotels/:hotelId', TravelController.updateHotelBooking.bind(TravelController));
router.post('/travel/transportation/:bookingId', TravelController.bookTransportation.bind(TravelController));
router.get('/travel/itinerary/:bookingId', TravelController.getCompleteItinerary.bind(TravelController));
router.get('/travel/summary/:bookingId', TravelController.generateTravelSummary.bind(TravelController));
router.get('/travel/bookings', TravelController.getAllTravelBookings.bind(TravelController));

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/notifications', NotificationController.getNotifications.bind(NotificationController));
router.put('/notifications/:notificationId/read', NotificationController.markNotificationRead.bind(NotificationController));
router.put('/notifications/mark-all-read', NotificationController.markAllNotificationsRead.bind(NotificationController));
router.delete('/notifications/:notificationId', NotificationController.deleteNotification.bind(NotificationController));
router.get('/notifications/unread', NotificationController.getUnreadCount.bind(NotificationController));
router.get('/notifications/preferences', NotificationController.getPreferences.bind(NotificationController));

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT TICKETS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/support-tickets', SupportTicketController.createTicket.bind(SupportTicketController));
router.get('/support-tickets', SupportTicketController.getUserTickets.bind(SupportTicketController));
router.get('/support-tickets/:ticketId', SupportTicketController.getTicketById.bind(SupportTicketController));
router.put('/support-tickets/:ticketId', SupportTicketController.updateTicket.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/reply', SupportTicketController.addTicketReply.bind(SupportTicketController));
router.post('/support-tickets/:ticketId/close', SupportTicketController.closeTicket.bind(SupportTicketController));
router.get('/support-tickets/:ticketId/chat', SupportTicketController.getTicketChat.bind(SupportTicketController));

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE & PREFERENCES (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/profile', UserController.getUserProfile.bind(UserController));
router.put('/profile', UserController.updateUserProfile.bind(UserController));
router.post('/change-password', UserController.changePassword.bind(UserController));
router.get('/preferences', UserController.getUserPreferences.bind(UserController));
router.put('/preferences', UserController.updateUserPreferences.bind(UserController));
router.post('/addresses', UserController.addUserAddress.bind(UserController));
router.get('/addresses', UserController.getUserAddresses.bind(UserController));
router.put('/addresses/:addressId', UserController.updateUserAddress.bind(UserController));
router.delete('/addresses/:addressId', UserController.deleteUserAddress.bind(UserController));
router.post('/profile/avatar/upload', UserController.uploadAvatar.bind(UserController));

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT PROFILE (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/patient-profile', PatientController.getPatientProfile.bind(PatientController));
router.put('/patient-profile', PatientController.updatePatientProfile.bind(PatientController));
router.get('/medical-history', PatientController.getPatientMedicalHistory.bind(PatientController));
router.post('/medical-history', PatientController.addPatientMedicalHistory.bind(PatientController));
router.get('/allergies', PatientController.getPatientAllergies.bind(PatientController));
router.post('/allergies', PatientController.addPatientAllergy.bind(PatientController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT & MESSAGING (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/chat', ChatController.createChatRoom.bind(ChatController));
router.get('/chat/:chatId', ChatController.getChatRoom.bind(ChatController));
router.get('/chat', ChatController.getUserChats.bind(ChatController));
router.post('/chat/:chatId/message', ChatController.sendMessage.bind(ChatController));
router.get('/chat/:chatId/messages', ChatController.getChatMessages.bind(ChatController));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (13 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/insurance/plans/enroll', InsuranceController.enrollInsurancePlan.bind(InsuranceController));
router.get('/insurance/my-insurance', InsuranceController.getUserInsurance.bind(InsuranceController));
router.get('/insurance/plans/:insuranceId', InsuranceController.getInsuranceById.bind(InsuranceController));
router.get('/insurance/plans', InsuranceController.listInsurances.bind(InsuranceController));
router.post('/insurance/validate-coverage', InsuranceController.validateCoverage.bind(InsuranceController));
router.get('/insurance/stats', InsuranceController.getInsuranceStats.bind(InsuranceController));
router.post('/insurance/claims/create', InsuranceController.createClaim.bind(InsuranceController));
router.get('/insurance/claims', InsuranceController.getUserClaims.bind(InsuranceController));
router.put('/insurance/plans/:insuranceId/update', InsuranceController.updateInsurance.bind(InsuranceController));
router.delete('/insurance/plans/:insuranceId/cancel', InsuranceController.cancelInsurance.bind(InsuranceController));
router.get('/insurance/claims/:claimId', InsuranceController.getClaimDetails.bind(InsuranceController));
router.put('/insurance/claims/:claimId/resubmit', InsuranceController.resubmitClaim.bind(InsuranceController));
router.get('/insurance/coverage-history', InsuranceController.getCoverageHistory.bind(InsuranceController));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE DOCUMENTS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/insurance-documents/upload', InsuranceDocumentController.uploadDocument.bind(InsuranceDocumentController));
router.get('/insurance-documents', InsuranceDocumentController.listDocuments.bind(InsuranceDocumentController));
router.get('/insurance-documents/:documentId', InsuranceDocumentController.getDocumentById.bind(InsuranceDocumentController));
router.put('/insurance-documents/:documentId/update', InsuranceDocumentController.updateDocument.bind(InsuranceDocumentController));
router.delete('/insurance-documents/:documentId/delete', InsuranceDocumentController.deleteDocument.bind(InsuranceDocumentController));
router.post('/insurance-documents/:documentId/download', InsuranceDocumentController.downloadDocument.bind(InsuranceDocumentController));
router.get('/insurance-documents/status/:status', InsuranceDocumentController.getDocumentsByStatus.bind(InsuranceDocumentController));
router.post('/insurance-documents/:documentId/share', InsuranceDocumentController.shareDocument.bind(InsuranceDocumentController));

// ─────────────────────────────────────────────────────────────────────────────
// COUPONS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/coupons', CouponController.listCoupons.bind(CouponController));
router.get('/coupons/:code', CouponController.getCouponByCode.bind(CouponController));
router.post('/coupons/validate', CouponController.validateCoupon.bind(CouponController));
router.post('/coupons/apply', CouponController.applyCoupon.bind(CouponController));
router.get('/coupons/:couponId/details', CouponController.getCouponDetails.bind(CouponController));
router.get('/coupons/active', CouponController.getActiveCoupons.bind(CouponController));
router.get('/coupons/my-redeemed', CouponController.getRedeemedCoupons.bind(CouponController));
router.post('/coupons/:couponId/redeem', CouponController.redeemCoupon.bind(CouponController));

// ─────────────────────────────────────────────────────────────────────────────
// FLIGHTS (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/flights/search', FlightController.searchFlights.bind(FlightController));
router.get('/flights/:flightId', FlightController.getFlightById.bind(FlightController));
router.post('/flights/:flightId/book', FlightController.bookFlight.bind(FlightController));
router.delete('/flights/bookings/:bookingId/cancel', FlightController.cancelFlight.bind(FlightController));
router.get('/flights/bookings', FlightController.getUserBookings.bind(FlightController));
router.get('/flights/bookings/:bookingId', FlightController.getBookingDetails.bind(FlightController));
router.put('/flights/bookings/:bookingId/update', FlightController.updateBooking.bind(FlightController));
router.post('/flights/bookings/:bookingId/checkin', FlightController.checkInFlight.bind(FlightController));
router.get('/flights/bookings/:bookingId/boarding-pass', FlightController.getBoardingPass.bind(FlightController));

// ─────────────────────────────────────────────────────────────────────────────
// ACCOMMODATION (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/accommodation', AccommodationController.listAccommodation.bind(AccommodationController));
router.get('/accommodation/:accommodationId', AccommodationController.getAccommodationById.bind(AccommodationController));
router.post('/accommodation/:accommodationId/book', AccommodationController.bookAccommodation.bind(AccommodationController));
router.get('/accommodation/bookings', AccommodationController.getUserBookings.bind(AccommodationController));
router.get('/accommodation/bookings/:bookingId', AccommodationController.getBookingDetails.bind(AccommodationController));
router.delete('/accommodation/bookings/:bookingId/cancel', AccommodationController.cancelBooking.bind(AccommodationController));
router.get('/accommodation/search', AccommodationController.searchAccommodation.bind(AccommodationController));
router.post('/accommodation/:accommodationId/review', AccommodationController.addReview.bind(AccommodationController));
router.get('/accommodation/:accommodationId/reviews', AccommodationController.getReviews.bind(AccommodationController));
router.post('/accommodation/bookings/:bookingId/checkin', AccommodationController.checkIn.bind(AccommodationController));
router.post('/accommodation/bookings/:bookingId/checkout', AccommodationController.checkOut.bind(AccommodationController));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED PATIENT FEATURES (42 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MANAGEMENT (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/profile/details', ProfileController.getProfile.bind(ProfileController));
router.post('/profile/create', ProfileController.createProfile.bind(ProfileController));
router.put('/profile/details/update', ProfileController.updateProfile.bind(ProfileController));
router.delete('/profile/details/delete', ProfileController.deleteProfile.bind(ProfileController));

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS & REVIEWS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/ratings/create', RatingController.createRating.bind(RatingController));
router.get('/ratings/doctor/:doctorId', RatingController.getRatingsByDoctor.bind(RatingController));
router.get('/ratings/hospital/:hospitalId', RatingController.getRatingsByHospital.bind(RatingController));
router.get('/ratings/average', RatingController.getAverageRating.bind(RatingController));
router.get('/ratings/:ratingId', RatingController.getRatingById.bind(RatingController));
router.put('/ratings/:ratingId/update', RatingController.updateRating.bind(RatingController));
router.delete('/ratings/:ratingId/delete', RatingController.deleteRating.bind(RatingController));

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/lab-reports', LabReportController.getPatientReports.bind(LabReportController));
router.get('/lab-reports/:reportId', LabReportController.getReportById.bind(LabReportController));
router.get('/lab-reports/:reportId/download', LabReportController.downloadReport.bind(LabReportController));
router.get('/lab-reports/status/:status', LabReportController.getReportsByStatus.bind(LabReportController));
router.get('/lab-reports/search', LabReportController.searchReports.bind(LabReportController));
router.get('/lab-reports/statistics', LabReportController.getReportStatistics.bind(LabReportController));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/companions/add', CompanionController.addCompanion.bind(CompanionController));
router.get('/companions/booking/:bookingId', CompanionController.getBookingCompanions.bind(CompanionController));
router.get('/companions/my-companions', CompanionController.getPatientCompanions.bind(CompanionController));
router.get('/companions/:companionId', CompanionController.getCompanionById.bind(CompanionController));
router.put('/companions/:companionId/update', CompanionController.updateCompanion.bind(CompanionController));
router.delete('/companions/:companionId/remove', CompanionController.removeCompanion.bind(CompanionController));

// ─────────────────────────────────────────────────────────────────────────────
// COMORBID CONDITIONS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/conditions/add', ComorbidConditionController.addCondition.bind(ComorbidConditionController));
router.get('/conditions/my-conditions', ComorbidConditionController.getPatientConditions.bind(ComorbidConditionController));
router.get('/conditions/:conditionId', ComorbidConditionController.getConditionById.bind(ComorbidConditionController));
router.put('/conditions/:conditionId/update', ComorbidConditionController.updateCondition.bind(ComorbidConditionController));
router.put('/conditions/:conditionId/status', ComorbidConditionController.updateConditionStatus.bind(ComorbidConditionController));
router.delete('/conditions/:conditionId/delete', ComorbidConditionController.deleteCondition.bind(ComorbidConditionController));
router.get('/conditions/count', ComorbidConditionController.getActiveConditionsCount.bind(ComorbidConditionController));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/transactions/my-transactions', TransactionController.getUserTransactions.bind(TransactionController));
router.get('/transactions/payment/:paymentId', TransactionController.getTransactionsByPayment.bind(TransactionController));
router.get('/transactions/:transactionId', TransactionController.getTransactionById.bind(TransactionController));
router.get('/transactions/search', TransactionController.searchTransactions.bind(TransactionController));
router.get('/transactions/status/:status', TransactionController.getTransactionsByStatus.bind(TransactionController));
router.get('/transactions/statistics', TransactionController.getTransactionStatistics.bind(TransactionController));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/chat-messages/send', ChatMessageController.sendMessage.bind(ChatMessageController));
router.get('/chat-messages/conversation/:conversationId', ChatMessageController.getConversationMessages.bind(ChatMessageController));
router.get('/chat-messages/unread/:conversationId', ChatMessageController.getUnreadCount.bind(ChatMessageController));
router.put('/chat-messages/:messageId/read', ChatMessageController.markAsRead.bind(ChatMessageController));
router.put('/chat-messages/conversation/:conversationId/read-all', ChatMessageController.markConversationAsRead.bind(ChatMessageController));
router.delete('/chat-messages/:messageId/delete', ChatMessageController.deleteMessage.bind(ChatMessageController));

export default router;