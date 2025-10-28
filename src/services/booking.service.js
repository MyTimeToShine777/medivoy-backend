const { Booking, Patient, Hospital, Treatment, Payment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateBookingNumber } = require('../utils/helpers');
const { BOOKING_STATUS } = require('../constants/status-codes');
const logger = require('../utils/logger');

class BookingService {
  async createBooking(bookingData) {
    try {
      const booking_number = generateBookingNumber();
      const booking = await Booking.create({
        ...bookingData,
        booking_number,
        status: BOOKING_STATUS.REQUESTED
      });
      logger.info(`Booking created: ${booking.id}`);
      return booking;
    } catch (error) {
      logger.error('Error creating booking:', error);
      throw new AppError('Failed to create booking', 500);
    }
  }

  async getBookingById(bookingId) {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Hospital, as: 'hospital' },
        { model: Treatment, as: 'treatment' },
        { model: Payment, as: 'payments' }
      ]
    });
    
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }
    
    return booking;
  }

  async updateBooking(bookingId, updateData) {
    const booking = await this.getBookingById(bookingId);
    await booking.update(updateData);
    logger.info(`Booking updated: ${bookingId}`);
    return booking;
  }

  async updateBookingStatus(bookingId, status, notes = null) {
    const booking = await this.getBookingById(bookingId);
    
    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(booking.status);
    if (!validTransitions.includes(status)) {
      throw new AppError(`Invalid status transition from ${booking.status} to ${status}`, 400);
    }
    
    await booking.update({ status, status_notes: notes });
    logger.info(`Booking status updated: ${bookingId} - ${status}`);
    return booking;
  }

  getValidStatusTransitions(currentStatus) {
    const transitions = {
      [BOOKING_STATUS.REQUESTED]: [BOOKING_STATUS.UNDER_REVIEW, BOOKING_STATUS.REJECTED],
      [BOOKING_STATUS.UNDER_REVIEW]: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED],
      [BOOKING_STATUS.ACCEPTED]: [BOOKING_STATUS.AWAITING_MEDICAL_DETAILS],
      [BOOKING_STATUS.AWAITING_MEDICAL_DETAILS]: [BOOKING_STATUS.QUOTATION_SENT],
      [BOOKING_STATUS.QUOTATION_SENT]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.REJECTED],
      [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.PAYMENT_COMPLETED],
      [BOOKING_STATUS.PAYMENT_COMPLETED]: [BOOKING_STATUS.INVOICE_SENT],
      [BOOKING_STATUS.INVOICE_SENT]: [BOOKING_STATUS.TRAVEL_ARRANGEMENT],
      [BOOKING_STATUS.TRAVEL_ARRANGEMENT]: [BOOKING_STATUS.IN_TREATMENT],
      [BOOKING_STATUS.IN_TREATMENT]: [BOOKING_STATUS.COMPLETED],
      [BOOKING_STATUS.COMPLETED]: [BOOKING_STATUS.FEEDBACK_RECEIVED]
    };
    
    return transitions[currentStatus] || [];
  }

  async getAllBookings(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Patient, as: 'patient' },
        { model: Hospital, as: 'hospital' },
        { model: Treatment, as: 'treatment' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      bookings: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async cancelBooking(bookingId, reason) {
    const booking = await this.getBookingById(bookingId);
    await booking.update({
      status: BOOKING_STATUS.REJECTED,
      cancellation_reason: reason
    });
    logger.info(`Booking cancelled: ${bookingId}`);
    return booking;
  }
}

module.exports = new BookingService();
