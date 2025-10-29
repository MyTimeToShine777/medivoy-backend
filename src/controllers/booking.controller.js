const Booking = require('../models/Booking.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class BookingController {
  /**
   * Create a new booking
   */
  async createBooking(req, res) {
    try {
      const { patientId, treatmentId, hospitalId, notes } = req.body;
      
      // Create booking
      const booking = await Booking.create({
        patientId,
        treatmentId,
        hospitalId,
        notes,
      });
      
      return successResponse(res, {
        message: 'Booking created successfully',
        data: booking,
      }, 201);
    } catch (error) {
      logger.error('Create booking error:', error);
      return errorResponse(res, {
        message: 'Failed to create booking',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get booking by ID
   */
  async getBooking(req, res) {
    try {
      const { id } = req.params;
      
      // Find booking
      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return errorResponse(res, {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Booking retrieved successfully',
        data: booking,
      });
    } catch (error) {
      logger.error('Get booking error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve booking',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update booking
   */
  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const { notes, status } = req.body;
      
      // Find booking
      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return errorResponse(res, {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND',
        }, 404);
      }
      
      // Update booking
      await booking.update({
        notes,
        status,
      });
      
      return successResponse(res, {
        message: 'Booking updated successfully',
        data: booking,
      });
    } catch (error) {
      logger.error('Update booking error:', error);
      return errorResponse(res, {
        message: 'Failed to update booking',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Find booking
      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return errorResponse(res, {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND',
        }, 404);
      }
      
      // Update booking status
      await booking.update({ status });
      
      return successResponse(res, {
        message: 'Booking status updated successfully',
        data: booking,
      });
    } catch (error) {
      logger.error('Update booking status error:', error);
      return errorResponse(res, {
        message: 'Failed to update booking status',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all bookings
   */
  async getAllBookings(req, res) {
    try {
      const { page = 1, limit = 10, status, patientId, hospitalId } = req.query;
      
      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (patientId) where.patientId = patientId;
      if (hospitalId) where.hospitalId = hospitalId;
      
      // Get bookings with pagination
      const bookings = await Booking.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return successResponse(res, {
        message: 'Bookings retrieved successfully',
        data: bookings.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(bookings.count / parseInt(limit, 10)),
          totalRecords: bookings.count,
        },
      });
    } catch (error) {
      logger.error('Get all bookings error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve bookings',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      
      // Find booking
      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return errorResponse(res, {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND',
        }, 404);
      }
      
      // Update booking status to cancelled
      await booking.update({ status: 'cancelled' });
      
      return successResponse(res, {
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      logger.error('Cancel booking error:', error);
      return errorResponse(res, {
        message: 'Failed to cancel booking',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new BookingController();