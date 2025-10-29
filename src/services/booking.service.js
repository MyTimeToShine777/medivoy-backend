const Booking = require('../models/Booking.model');
const logger = require('../utils/logger');

class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      logger.error('Create booking service error:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id) {
    try {
      const booking = await Booking.findByPk(id);
      return booking;
    } catch (error) {
      logger.error('Get booking by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update booking
   */
  async updateBooking(id, data) {
    try {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        throw new Error('Booking not found');
      }

      await booking.update(data);
      return booking;
    } catch (error) {
      logger.error('Update booking service error:', error);
      throw error;
    }
  }

  /**
   * Delete booking
   */
  async deleteBooking(id) {
    try {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        throw new Error('Booking not found');
      }

      await booking.destroy();
      return true;
    } catch (error) {
      logger.error('Delete booking service error:', error);
      throw error;
    }
  }

  /**
   * Get all bookings
   */
  async getAllBookings(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const bookings = await Booking.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return bookings;
    } catch (error) {
      logger.error('Get all bookings service error:', error);
      throw error;
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(id, status) {
    try {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        throw new Error('Booking not found');
      }

      await booking.update({ status });
      return booking;
    } catch (error) {
      logger.error('Update booking status service error:', error);
      throw error;
    }
  }
}

module.exports = new BookingService();
