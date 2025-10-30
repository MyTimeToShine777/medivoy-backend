const Booking = require("../models/Booking.model");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class BookingController {
  /**
   * Create a new booking
   */
  static async createBooking(req, res) {
    try {
      const { patientId, treatmentId, hospitalId, notes } = req.body;

      // Create booking
      const booking = await Booking.create({
        patientId,
        treatmentId,
        hospitalId,
        notes,
      });

      return successResponse(
        res,
        {
          message: "Booking created successfully",
          data: booking,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, "Failed to create booking");
    }
  }

  /**
   * Get booking by ID
   */
  static async getBooking(req, res) {
    try {
      const { id } = req.params;

      // Find booking
      const booking = await Booking.findByPk(id);

      if (!booking) {
        return errorResponse(
          res,
          {
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Booking retrieved successfully",
        data: booking,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "Failed to retrieve booking");
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const { notes, status } = req.body;

      // Find booking
      const booking = await Booking.findByPk(id);

      if (!booking) {
        return errorResponse(
          res,
          {
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
          },
          404,
        );
      }

      // Update booking
      await booking.update({
        notes,
        status,
      });

      return successResponse(res, {
        message: "Booking updated successfully",
        data: booking,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "Failed to update booking");
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Find booking
      const booking = await Booking.findByPk(id);

      if (!booking) {
        return errorResponse(
          res,
          {
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
          },
          404,
        );
      }

      // Update booking status
      await booking.update({ status });

      return successResponse(res, {
        message: "Booking status updated successfully",
        data: booking,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "Failed to update booking status");
    }
  }

  /**
   * Get all bookings
   */
  static async getAllBookings(req, res) {
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
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Bookings retrieved successfully",
        data: bookings.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(bookings.count / parseInt(limit, 10)),
          totalRecords: bookings.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, "Failed to retrieve bookings");
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(req, res) {
    try {
      const { id } = req.params;

      // Find booking
      const booking = await Booking.findByPk(id);

      if (!booking) {
        return errorResponse(
          res,
          {
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
          },
          404,
        );
      }

      // Update booking status to cancelled
      await booking.update({ status: "cancelled" });

      return successResponse(res, {
        message: "Booking cancelled successfully",
        data: booking,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "Failed to cancel booking");
    }
  }

  /**
   * Get patient bookings
   */
  static async getPatientBookings(req, res) {
    try {
      const { patientId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Build where clause
      const where = { patient_id: patientId };
      if (status) where.status = status;

      // Get bookings with pagination
      const bookings = await Booking.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["created_at", "DESC"]],
      });

      return successResponse(res, {
        message: "Patient bookings retrieved successfully",
        data: bookings.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(bookings.count / parseInt(limit, 10)),
          totalRecords: bookings.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(
        error,
        res,
        "Failed to retrieve patient bookings",
      );
    }
  }

  /**
   * Get hospital bookings
   */
  static async getHospitalBookings(req, res) {
    try {
      const { hospitalId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Build where clause
      const where = { hospital_id: hospitalId };
      if (status) where.status = status;

      // Get bookings with pagination
      const bookings = await Booking.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["created_at", "DESC"]],
      });

      return successResponse(res, {
        message: "Hospital bookings retrieved successfully",
        data: bookings.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(bookings.count / parseInt(limit, 10)),
          totalRecords: bookings.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(
        error,
        res,
        "Failed to retrieve hospital bookings",
      );
    }
  }
}

/**
 * Delete booking
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Booking.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await item.destroy();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = BookingController;
