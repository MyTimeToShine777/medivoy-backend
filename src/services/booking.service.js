// src/services/booking.service.js
const {
  Booking,
  BookingStatusHistory,
  Patient,
  Treatment,
  Hospital,
  Doctor,
  User,
} = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class BookingService {
  static async createBooking(patientId, bookingData) {
    const bookingNumber = await this.generateBookingNumber();

    const booking = await Booking.create({
      bookingNumber,
      patientId,
      ...bookingData,
      status: 'inquiry',
    });

    await BookingStatusHistory.create({
      bookingId: booking.id,
      newStatus: 'inquiry',
      changeReason: 'Initial booking created',
    });

    return booking;
  }

  static async assignSalesCoordinator(bookingId, coordinatorId) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      salesCoordinatorId: coordinatorId,
      status: 'lead_assigned',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'lead_assigned',
      changedBy: coordinatorId,
      changeReason: 'Sales coordinator assigned',
    });

    return booking;
  }

  static async scheduleConsultation(bookingId, consultationDate, doctorId) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      consultationDate,
      doctorId,
      status: 'consultation_scheduled',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'consultation_scheduled',
      changeReason: 'Consultation scheduled',
    });

    return booking;
  }

  static async completeConsultation(bookingId, notes) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      salesNotes: notes,
      status: 'consultation_completed',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'consultation_completed',
      changeReason: 'Consultation completed',
    });

    return booking;
  }

  static async approveMedical(bookingId, reviewerId, notes, estimatedCost) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      medicalReviewerId: reviewerId,
      medicalReviewNotes: notes,
      estimatedCost,
      status: 'medical_approved',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'medical_approved',
      changedBy: reviewerId,
      changeReason: 'Medical review approved',
    });

    return booking;
  }

  static async rejectMedical(bookingId, reviewerId, rejectionReason) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      medicalReviewerId: reviewerId,
      medicalReviewNotes: rejectionReason,
      status: 'medical_rejected',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'medical_rejected',
      changedBy: reviewerId,
      changeReason: rejectionReason,
    });

    return booking;
  }

  static async processPayment(bookingId, amount, paymentMethod, paymentReference) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      paidAmount: amount,
      paymentMethod,
      paymentReference,
      paidAt: new Date(),
      paymentStatus: 'completed',
      status: 'payment_received',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'payment_received',
      changeReason: 'Payment processed',
    });

    return booking;
  }

  static async arrangeTravel(bookingId, departureDate, returnDate, flightInfo, hotelInfo) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      departureDate,
      returnDate,
      flightBooked: !!flightInfo,
      hotelBooked: !!hotelInfo,
      travelNotes: JSON.stringify({ flightInfo, hotelInfo }),
      status: 'travel_arranged',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'travel_arranged',
      changeReason: 'Travel arrangements completed',
    });

    return booking;
  }

  static async scheduleTreatment(bookingId, treatmentDate, treatmentTime, location, duration) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      treatmentDate,
      treatmentTime,
      treatmentLocation: location,
      treatmentDuration: duration,
      status: 'treatment_scheduled',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'treatment_scheduled',
      changeReason: 'Treatment scheduled',
    });

    return booking;
  }

  static async completeTreatment(bookingId, medicalOutcome) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      treatmentOutcome: medicalOutcome,
      status: 'completed',
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'completed',
      changeReason: 'Treatment completed successfully',
    });

    return booking;
  }

  static async submitFeedback(bookingId, ratings, feedback, recommendations) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      ratings,
      feedback,
      recommendations,
    });

    return booking;
  }

  static async getBookingDetails(bookingId) {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Treatment, as: 'treatment' },
        { model: Hospital, as: 'hospital' },
        { model: Doctor, as: 'doctor' },
        { model: BookingStatusHistory, as: 'statusHistory' },
      ],
    });

    if (!booking) throw new Error('Booking not found');
    return booking;
  }

  static async cancelBooking(bookingId, cancelledBy, reason) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw new Error('Booking not found');

    await booking.update({
      status: 'cancelled',
      cancelledBy,
      cancellationReason: reason,
      cancelledAt: new Date(),
    });

    await BookingStatusHistory.create({
      bookingId,
      oldStatus: booking.status,
      newStatus: 'cancelled',
      changedBy: cancelledBy,
      changeReason: reason,
    });

    return booking;
  }

  static async generateBookingNumber() {
    const prefix = 'BK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

module.exports = BookingService;
