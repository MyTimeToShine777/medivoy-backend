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

router.get('/search', (req, res) => SearchController.globalSearch(req, res));
router.get('/search/hospitals', (req, res) => SearchController.searchHospitals(req, res));
router.get('/search/doctors', (req, res) => SearchController.searchDoctors(req, res));
router.get('/search/treatments', (req, res) => SearchController.searchTreatments(req, res));
router.get('/search/advanced', (req, res) => SearchController.advancedSearch(req, res));
router.get('/search/nearby', (req, res) => SearchController.searchNearby(req, res));
router.get('/search/recommendations', (req, res) => SearchController.getRecommendations(req, res));

router.get('/filter/hospitals', (req, res) => FilterController.filterHospitals(req, res));
router.get('/filter/doctors', (req, res) => FilterController.filterDoctors(req, res));
router.get('/filter/treatments', (req, res) => FilterController.filterTreatments(req, res));
router.get('/filter/packages', (req, res) => FilterController.filterPackages(req, res));
router.get('/filter/options', (req, res) => FilterController.getFilterOptions(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES & TREATMENTS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/packages', (req, res) => PackageController.listPackages(req, res));
router.get('/packages/:packageId', (req, res) => PackageController.getPackageById(req, res));
router.get('/packages/featured', (req, res) => PackageController.getFeaturedPackages(req, res));
router.get('/packages/treatment/:treatmentId', (req, res) => PackageController.getPackagesByTreatment(req, res));
router.post('/packages/:packageId/compare', (req, res) => PackageController.comparePackages(req, res));
router.get('/packages/search', (req, res) => PackageController.searchPackages(req, res));
router.get('/packages/:packageId/reviews', (req, res) => PackageController.getPackageReviews(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING MANAGEMENT (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/bookings', (req, res) => BookingController.createBooking(req, res));
router.get('/bookings', (req, res) => BookingController.getUserBookings(req, res));
router.get('/bookings/:bookingId', (req, res) => BookingController.getBookingById(req, res));
router.put('/bookings/:bookingId', (req, res) => BookingController.updateBooking(req, res));
router.delete('/bookings/:bookingId', (req, res) => BookingController.cancelBooking(req, res));
router.get('/bookings/:bookingId/history', (req, res) => BookingController.getBookingHistory(req, res));
router.post('/bookings/:bookingId/reschedule', (req, res) => BookingController.rescheduleBooking(req, res));
router.get('/bookings/upcoming', (req, res) => BookingController.getUpcomingBookings(req, res));
router.get('/bookings/past', (req, res) => BookingController.getPastBookings(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENTS (15 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/appointments', (req, res) => AppointmentController.bookAppointment(req, res));
router.post('/appointments/book', (req, res) => AppointmentController.bookAppointment(req, res));
router.get('/appointments', (req, res) => AppointmentController.getUserAppointments(req, res));
router.get('/appointments/:appointmentId', (req, res) => AppointmentController.getAppointmentById(req, res));
router.put('/appointments/:appointmentId/reschedule', (req, res) => AppointmentController.rescheduleAppointment(req, res));
router.delete('/appointments/:appointmentId', (req, res) => AppointmentController.cancelAppointment(req, res));
router.get('/doctors/:doctorId/available-slots', (req, res) => AppointmentController.getAvailableSlots(req, res));
router.post('/appointments/:callId/start', (req, res) => AppointmentController.startConsultation(req, res));
router.get('/appointments/status/:status', (req, res) => AppointmentController.getAppointmentsByStatus(req, res));
router.get('/appointments/upcoming', (req, res) => AppointmentController.getUpcomingAppointments(req, res));
router.get('/appointments/history', (req, res) => AppointmentController.getAppointmentHistory(req, res));
router.post('/appointments/:appointmentId/reschedule-request', (req, res) => AppointmentController.requestReschedule(req, res));
router.post('/appointments/:appointmentId/confirm', (req, res) => AppointmentController.confirmAppointment(req, res));
router.get('/appointments/filter', (req, res) => AppointmentController.filterAppointments(req, res));
router.post('/appointments/:appointmentId/join-video', (req, res) => AppointmentController.joinVideoConsultation(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CONSULTATIONS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/consultations/:appointmentId/create', (req, res) => AppointmentController.createConsultation(req, res));
router.get('/consultations', (req, res) => AppointmentController.getUserConsultations(req, res));
router.post('/consultations/:callId/start', (req, res) => AppointmentController.startConsultation(req, res));
router.post('/consultations/:callId/end', (req, res) => AppointmentController.endConsultation(req, res));
router.get('/consultations/:callId', (req, res) => AppointmentController.getConsultationDetails(req, res));
router.get('/consultations/status/:status', (req, res) => AppointmentController.getConsultationsByStatus(req, res));
router.post('/consultations/:callId/save-notes', (req, res) => AppointmentController.saveConsultationNotes(req, res));
router.get('/consultations/:callId/recording', (req, res) => AppointmentController.getConsultationRecording(req, res));
router.post('/consultations/:callId/prescription', (req, res) => AppointmentController.getPrescription(req, res));
router.get('/consultations/:callId/summary', (req, res) => AppointmentController.getConsultationSummary(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PRESCRIPTIONS (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/prescriptions', (req, res) => PrescriptionController.getUserPrescriptions(req, res));
router.get('/prescriptions/:prescriptionId', (req, res) => PrescriptionController.getPrescriptionById(req, res));
router.get('/prescriptions/:prescriptionId/download', (req, res) => PrescriptionController.downloadPrescription(req, res));
router.post('/prescriptions/:prescriptionId/refill', (req, res) => PrescriptionController.refillPrescription(req, res));
router.get('/prescriptions/active', (req, res) => PrescriptionController.getActivePrescriptions(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// MEDICAL RECORDS & DOCUMENTS (15 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/medical-records', (req, res) => MedicalRecordController.createMedicalRecord(req, res));
router.get('/medical-records', (req, res) => MedicalRecordController.getUserMedicalRecords(req, res));
router.get('/medical-records/:recordId', (req, res) => MedicalRecordController.getMedicalRecordById(req, res));
router.put('/medical-records/:recordId', (req, res) => MedicalRecordController.updateMedicalRecord(req, res));
router.delete('/medical-records/:recordId', (req, res) => MedicalRecordController.deleteMedicalRecord(req, res));
router.post('/medical-records/:recordId/share', (req, res) => MedicalRecordController.shareMedicalRecord(req, res));
router.get('/medical-records/:recordId/export', (req, res) => MedicalRecordController.exportMedicalRecord(req, res));
router.post('/medical-records/:recordId/archive', (req, res) => MedicalRecordController.archiveMedicalRecord(req, res));

router.post('/documents/medical/:bookingId', (req, res) => DocumentController.uploadMedicalDocument(req, res));
router.get('/documents/medical/:bookingId', (req, res) => DocumentController.getMedicalDocuments(req, res));
router.post('/documents/patient', (req, res) => DocumentController.uploadPatientDocument(req, res));
router.get('/documents/patient', (req, res) => DocumentController.getPatientDocuments(req, res));
router.put('/documents/:documentId', (req, res) => DocumentController.updatePatientDocument(req, res));
router.delete('/documents/:documentId', (req, res) => DocumentController.deletePatientDocument(req, res));
router.get('/documents/:documentId/download', (req, res) => DocumentController.downloadDocument(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// LABORATORY (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/laboratory/order', (req, res) => LaboratoryController.orderLabTest(req, res));
router.get('/laboratory/orders', (req, res) => LaboratoryController.getUserLabOrders(req, res));
router.get('/laboratory/result/:resultId', (req, res) => LaboratoryController.getLabResult(req, res));
router.get('/laboratory/result/:resultId/download', (req, res) => LaboratoryController.downloadLabResult(req, res));
router.get('/laboratory/tests', (req, res) => LaboratoryController.getAvailableTests(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS & INVOICES (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/payments/:bookingId', (req, res) => PaymentController.createPayment(req, res));
router.post('/payments/:paymentId/verify', (req, res) => PaymentController.verifyPayment(req, res));
router.post('/payments/initialize', (req, res) => PaymentController.initializePayment(req, res));
router.get('/payments/history', (req, res) => PaymentController.getPaymentHistory(req, res));
router.get('/payments/:paymentId', (req, res) => PaymentController.getPaymentDetails(req, res));

router.get('/invoices', (req, res) => InvoiceController.listInvoices(req, res));
router.get('/invoices/:invoiceId', (req, res) => InvoiceController.getInvoiceById(req, res));
router.post('/invoices/:invoiceId/pay', (req, res) => InvoiceController.markInvoicePaid(req, res));
router.get('/invoices/:invoiceId/pdf', (req, res) => InvoiceController.generateInvoicePDF(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS & RATINGS (3 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/reviews/booking/:bookingId', (req, res) => ReviewController.createBookingReview(req, res));
router.get('/reviews/stats', (req, res) => ReviewController.getReviewStatistics(req, res));
router.get('/reviews/my-reviews', (req, res) => ReviewController.getUserReviews(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TRAVEL ARRANGEMENTS (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/travel/flights/:bookingId', (req, res) => TravelController.bookFlight(req, res));
router.get('/travel/flights/:bookingId', (req, res) => TravelController.getFlightsByBooking(req, res));
router.delete('/travel/flights/:flightId', (req, res) => TravelController.cancelFlight(req, res));
router.post('/travel/hotels/:bookingId', (req, res) => TravelController.bookHotel(req, res));
router.get('/travel/hotels/:bookingId', (req, res) => TravelController.getHotelsByBooking(req, res));
router.put('/travel/hotels/:hotelId', (req, res) => TravelController.updateHotelBooking(req, res));
router.post('/travel/transportation/:bookingId', (req, res) => TravelController.bookTransportation(req, res));
router.get('/travel/itinerary/:bookingId', (req, res) => TravelController.getCompleteItinerary(req, res));
router.get('/travel/summary/:bookingId', (req, res) => TravelController.generateTravelSummary(req, res));
router.get('/travel/bookings', (req, res) => TravelController.getAllTravelBookings(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/notifications', (req, res) => NotificationController.getNotifications(req, res));
router.put('/notifications/:notificationId/read', (req, res) => NotificationController.markNotificationRead(req, res));
router.put('/notifications/mark-all-read', (req, res) => NotificationController.markAllNotificationsRead(req, res));
router.delete('/notifications/:notificationId', (req, res) => NotificationController.deleteNotification(req, res));
router.get('/notifications/unread', (req, res) => NotificationController.getUnreadCount(req, res));
router.get('/notifications/preferences', (req, res) => NotificationController.getPreferences(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT TICKETS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/support-tickets', (req, res) => SupportTicketController.createTicket(req, res));
router.get('/support-tickets', (req, res) => SupportTicketController.getUserTickets(req, res));
router.get('/support-tickets/:ticketId', (req, res) => SupportTicketController.getTicketById(req, res));
router.put('/support-tickets/:ticketId', (req, res) => SupportTicketController.updateTicket(req, res));
router.post('/support-tickets/:ticketId/reply', (req, res) => SupportTicketController.addTicketReply(req, res));
router.post('/support-tickets/:ticketId/close', (req, res) => SupportTicketController.closeTicket(req, res));
router.get('/support-tickets/:ticketId/chat', (req, res) => SupportTicketController.getTicketChat(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE & PREFERENCES (10 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/profile', (req, res) => UserController.getUserProfile(req, res));
router.put('/profile', (req, res) => UserController.updateUserProfile(req, res));
router.post('/change-password', (req, res) => UserController.changePassword(req, res));
router.get('/preferences', (req, res) => UserController.getUserPreferences(req, res));
router.put('/preferences', (req, res) => UserController.updateUserPreferences(req, res));
router.post('/addresses', (req, res) => UserController.addUserAddress(req, res));
router.get('/addresses', (req, res) => UserController.getUserAddresses(req, res));
router.put('/addresses/:addressId', (req, res) => UserController.updateUserAddress(req, res));
router.delete('/addresses/:addressId', (req, res) => UserController.deleteUserAddress(req, res));
router.post('/profile/avatar/upload', (req, res) => UserController.uploadAvatar(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT PROFILE (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/patient-profile', (req, res) => PatientController.getPatientProfile(req, res));
router.put('/patient-profile', (req, res) => PatientController.updatePatientProfile(req, res));
router.get('/medical-history', (req, res) => PatientController.getPatientMedicalHistory(req, res));
router.post('/medical-history', (req, res) => PatientController.addPatientMedicalHistory(req, res));
router.get('/allergies', (req, res) => PatientController.getPatientAllergies(req, res));
router.post('/allergies', (req, res) => PatientController.addPatientAllergy(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT & MESSAGING (5 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/chat', (req, res) => ChatController.createChatRoom(req, res));
router.get('/chat/:chatId', (req, res) => ChatController.getChatRoom(req, res));
router.get('/chat', (req, res) => ChatController.getUserChats(req, res));
router.post('/chat/:chatId/message', (req, res) => ChatController.sendMessage(req, res));
router.get('/chat/:chatId/messages', (req, res) => ChatController.getChatMessages(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE MANAGEMENT (13 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/insurance/plans/enroll', (req, res) => InsuranceController.enrollInsurancePlan(req, res));
router.get('/insurance/my-insurance', (req, res) => InsuranceController.getUserInsurance(req, res));
router.get('/insurance/plans/:insuranceId', (req, res) => InsuranceController.getInsuranceById(req, res));
router.get('/insurance/plans', (req, res) => InsuranceController.listInsurances(req, res));
router.post('/insurance/validate-coverage', (req, res) => InsuranceController.validateCoverage(req, res));
router.get('/insurance/stats', (req, res) => InsuranceController.getInsuranceStats(req, res));
router.post('/insurance/claims/create', (req, res) => InsuranceController.createClaim(req, res));
router.get('/insurance/claims', (req, res) => InsuranceController.getUserClaims(req, res));
router.put('/insurance/plans/:insuranceId/update', (req, res) => InsuranceController.updateInsurance(req, res));
router.delete('/insurance/plans/:insuranceId/cancel', (req, res) => InsuranceController.cancelInsurance(req, res));
router.get('/insurance/claims/:claimId', (req, res) => InsuranceController.getClaimDetails(req, res));
router.put('/insurance/claims/:claimId/resubmit', (req, res) => InsuranceController.resubmitClaim(req, res));
router.get('/insurance/coverage-history', (req, res) => InsuranceController.getCoverageHistory(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE DOCUMENTS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/insurance-documents/upload', (req, res) => InsuranceDocumentController.uploadDocument(req, res));
router.get('/insurance-documents', (req, res) => InsuranceDocumentController.listDocuments(req, res));
router.get('/insurance-documents/:documentId', (req, res) => InsuranceDocumentController.getDocumentById(req, res));
router.put('/insurance-documents/:documentId/update', (req, res) => InsuranceDocumentController.updateDocument(req, res));
router.delete('/insurance-documents/:documentId/delete', (req, res) => InsuranceDocumentController.deleteDocument(req, res));
router.post('/insurance-documents/:documentId/download', (req, res) => InsuranceDocumentController.downloadDocument(req, res));
router.get('/insurance-documents/status/:status', (req, res) => InsuranceDocumentController.getDocumentsByStatus(req, res));
router.post('/insurance-documents/:documentId/share', (req, res) => InsuranceDocumentController.shareDocument(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// COUPONS (8 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/coupons', (req, res) => CouponController.listCoupons(req, res));
router.get('/coupons/:code', (req, res) => CouponController.getCouponByCode(req, res));
router.post('/coupons/validate', (req, res) => CouponController.validateCoupon(req, res));
router.post('/coupons/apply', (req, res) => CouponController.applyCoupon(req, res));
router.get('/coupons/:couponId/details', (req, res) => CouponController.getCouponDetails(req, res));
router.get('/coupons/active', (req, res) => CouponController.getActiveCoupons(req, res));
router.get('/coupons/my-redeemed', (req, res) => CouponController.getRedeemedCoupons(req, res));
router.post('/coupons/:couponId/redeem', (req, res) => CouponController.redeemCoupon(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// FLIGHTS (9 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/flights/search', (req, res) => FlightController.searchFlights(req, res));
router.get('/flights/:flightId', (req, res) => FlightController.getFlightById(req, res));
router.post('/flights/:flightId/book', (req, res) => FlightController.bookFlight(req, res));
router.delete('/flights/bookings/:bookingId/cancel', (req, res) => FlightController.cancelFlight(req, res));
router.get('/flights/bookings', (req, res) => FlightController.getUserBookings(req, res));
router.get('/flights/bookings/:bookingId', (req, res) => FlightController.getBookingDetails(req, res));
router.put('/flights/bookings/:bookingId/update', (req, res) => FlightController.updateBooking(req, res));
router.post('/flights/bookings/:bookingId/checkin', (req, res) => FlightController.checkInFlight(req, res));
router.get('/flights/bookings/:bookingId/boarding-pass', (req, res) => FlightController.getBoardingPass(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// ACCOMMODATION (11 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/accommodation', (req, res) => AccommodationController.listAccommodation(req, res));
router.get('/accommodation/:accommodationId', (req, res) => AccommodationController.getAccommodationById(req, res));
router.post('/accommodation/:accommodationId/book', (req, res) => AccommodationController.bookAccommodation(req, res));
router.get('/accommodation/bookings', (req, res) => AccommodationController.getUserBookings(req, res));
router.get('/accommodation/bookings/:bookingId', (req, res) => AccommodationController.getBookingDetails(req, res));
router.delete('/accommodation/bookings/:bookingId/cancel', (req, res) => AccommodationController.cancelBooking(req, res));
router.get('/accommodation/search', (req, res) => AccommodationController.searchAccommodation(req, res));
router.post('/accommodation/:accommodationId/review', (req, res) => AccommodationController.addReview(req, res));
router.get('/accommodation/:accommodationId/reviews', (req, res) => AccommodationController.getReviews(req, res));
router.post('/accommodation/bookings/:bookingId/checkin', (req, res) => AccommodationController.checkIn(req, res));
router.post('/accommodation/bookings/:bookingId/checkout', (req, res) => AccommodationController.checkOut(req, res));

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ENDPOINTS - EXTENDED PATIENT FEATURES (42 ENDPOINTS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MANAGEMENT (4 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/profile/details', (req, res) => ProfileController.getProfile(req, res));
router.post('/profile/create', (req, res) => ProfileController.createProfile(req, res));
router.put('/profile/details/update', (req, res) => ProfileController.updateProfile(req, res));
router.delete('/profile/details/delete', (req, res) => ProfileController.deleteProfile(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS & REVIEWS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/ratings/create', (req, res) => RatingController.createRating(req, res));
router.get('/ratings/doctor/:doctorId', (req, res) => RatingController.getRatingsByDoctor(req, res));
router.get('/ratings/hospital/:hospitalId', (req, res) => RatingController.getRatingsByHospital(req, res));
router.get('/ratings/average', (req, res) => RatingController.getAverageRating(req, res));
router.get('/ratings/:ratingId', (req, res) => RatingController.getRatingById(req, res));
router.put('/ratings/:ratingId/update', (req, res) => RatingController.updateRating(req, res));
router.delete('/ratings/:ratingId/delete', (req, res) => RatingController.deleteRating(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// LAB REPORTS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/lab-reports', (req, res) => LabReportController.getPatientReports(req, res));
router.get('/lab-reports/:reportId', (req, res) => LabReportController.getReportById(req, res));
router.get('/lab-reports/:reportId/download', (req, res) => LabReportController.downloadReport(req, res));
router.get('/lab-reports/status/:status', (req, res) => LabReportController.getReportsByStatus(req, res));
router.get('/lab-reports/search', (req, res) => LabReportController.searchReports(req, res));
router.get('/lab-reports/statistics', (req, res) => LabReportController.getReportStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIONS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/companions/add', (req, res) => CompanionController.addCompanion(req, res));
router.get('/companions/booking/:bookingId', (req, res) => CompanionController.getBookingCompanions(req, res));
router.get('/companions/my-companions', (req, res) => CompanionController.getPatientCompanions(req, res));
router.get('/companions/:companionId', (req, res) => CompanionController.getCompanionById(req, res));
router.put('/companions/:companionId/update', (req, res) => CompanionController.updateCompanion(req, res));
router.delete('/companions/:companionId/remove', (req, res) => CompanionController.removeCompanion(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// COMORBID CONDITIONS (7 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/conditions/add', (req, res) => ComorbidConditionController.addCondition(req, res));
router.get('/conditions/my-conditions', (req, res) => ComorbidConditionController.getPatientConditions(req, res));
router.get('/conditions/:conditionId', (req, res) => ComorbidConditionController.getConditionById(req, res));
router.put('/conditions/:conditionId/update', (req, res) => ComorbidConditionController.updateCondition(req, res));
router.put('/conditions/:conditionId/status', (req, res) => ComorbidConditionController.updateConditionStatus(req, res));
router.delete('/conditions/:conditionId/delete', (req, res) => ComorbidConditionController.deleteCondition(req, res));
router.get('/conditions/count', (req, res) => ComorbidConditionController.getActiveConditionsCount(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/transactions/my-transactions', (req, res) => TransactionController.getUserTransactions(req, res));
router.get('/transactions/payment/:paymentId', (req, res) => TransactionController.getTransactionsByPayment(req, res));
router.get('/transactions/:transactionId', (req, res) => TransactionController.getTransactionById(req, res));
router.get('/transactions/search', (req, res) => TransactionController.searchTransactions(req, res));
router.get('/transactions/status/:status', (req, res) => TransactionController.getTransactionsByStatus(req, res));
router.get('/transactions/statistics', (req, res) => TransactionController.getTransactionStatistics(req, res));

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGES (6 ENDPOINTS)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/chat-messages/send', (req, res) => ChatMessageController.sendMessage(req, res));
router.get('/chat-messages/conversation/:conversationId', (req, res) => ChatMessageController.getConversationMessages(req, res));
router.get('/chat-messages/unread/:conversationId', (req, res) => ChatMessageController.getUnreadCount(req, res));
router.put('/chat-messages/:messageId/read', (req, res) => ChatMessageController.markAsRead(req, res));
router.put('/chat-messages/conversation/:conversationId/read-all', (req, res) => ChatMessageController.markConversationAsRead(req, res));
router.delete('/chat-messages/:messageId/delete', (req, res) => ChatMessageController.deleteMessage(req, res));

export default router;
