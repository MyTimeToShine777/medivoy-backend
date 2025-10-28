const bookingService = require('../services/booking.service');
const { successResponse } = require('../utils/response');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.body);
      return successResponse(res, booking, 'Booking created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getBooking(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      return successResponse(res, booking, 'Booking retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req, res, next) {
    try {
      const booking = await bookingService.updateBooking(req.params.id, req.body);
      return successResponse(res, booking, 'Booking updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateBookingStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const booking = await bookingService.updateBookingStatus(req.params.id, status, notes);
      return successResponse(res, booking, 'Booking status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await bookingService.getAllBookings(filters, { page, limit });
      return successResponse(res, result, 'Bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const { reason } = req.body;
      const booking = await bookingService.cancelBooking(req.params.id, reason);
      return successResponse(res, booking, 'Booking cancelled successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
