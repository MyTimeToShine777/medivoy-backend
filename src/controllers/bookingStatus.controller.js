const BookingStatus = require("../models/BookingStatus.model");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class BookingStatusController {
  /**
   * Update booking status
   */
  static async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes, updatedBy } = req.body;

      const bookingStatus = await BookingStatus.findByPk(id);
      
      if (!bookingStatus) {
        return errorResponse(res, {
          message: "Booking status not found",
        }, 404);
      }

      await bookingStatus.update({
        status,
        notes,
        updatedBy,
      });

      return successResponse(res, {
        message: "Booking status updated successfully",
        data: bookingStatus,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Get booking status history
   */
  static async getBookingStatusHistory(req, res) {
    try {
      const { id } = req.params;

      const bookingStatus = await BookingStatus.findByPk(id);
      
      if (!bookingStatus) {
        return errorResponse(res, {
          message: "Booking status not found",
        }, 404);
      }

      return successResponse(res, {
        message: "Booking status history retrieved successfully",
        data: bookingStatus,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Assign coordinator to booking
   */
  static async assignCoordinator(req, res) {
    try {
      const { id } = req.params;
      const { coordinatorId } = req.body;

      const bookingStatus = await BookingStatus.findByPk(id);
      
      if (!bookingStatus) {
        return errorResponse(res, {
          message: "Booking status not found",
        }, 404);
      }

      await bookingStatus.update({
        coordinatorId,
      });

      return successResponse(res, {
        message: "Coordinator assigned successfully",
        data: bookingStatus,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Get valid status transitions
   */
  static async getValidTransitions(req, res) {
    try {
      const { id } = req.params;

      // This would typically contain business logic for valid transitions
      const transitions = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [], // Terminal state
        cancelled: [], // Terminal state
      };

      return successResponse(res, {
        message: "Valid transitions retrieved successfully",
        data: transitions,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Get bookings by status
   */
  static async getBookingsByStatus(req, res) {
    try {
      const { status } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const bookingStatuses = await BookingStatus.findAndCountAll({
        where: { status },
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Bookings retrieved successfully",
        data: bookingStatuses.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(bookingStatuses.count / parseInt(limit, 10)),
          totalRecords: bookingStatuses.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Bulk update booking status
   */
  static async bulkUpdateStatus(req, res) {
    try {
      const { bookingIds, status, notes, updatedBy } = req.body;

      const updatedCount = await BookingStatus.update(
        { status, notes, updatedBy },
        {
          where: {
            id: bookingIds,
          },
        }
      );

      return successResponse(res, {
        message: "Bulk update completed successfully",
        data: { updatedCount: updatedCount[0] },
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Get booking status statistics
   */
  static async getStatusStatistics(req, res) {
    try {
      const statistics = await BookingStatus.findAll({
        attributes: [
          'status',
          [BookingStatus.sequelize.fn('COUNT', BookingStatus.sequelize.col('id')), 'count'],
        ],
        group: ['status'],
      });

      return successResponse(res, {
        message: "Statistics retrieved successfully",
        data: statistics,
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Get all booking statuses
   */
  static async getAllBookingStatuses(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const bookingStatuses = await BookingStatus.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Booking statuses retrieved successfully",
        data: bookingStatuses.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(bookingStatuses.count / parseInt(limit, 10)),
          totalRecords: bookingStatuses.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }

  /**
   * Delete booking status
   */
  static async deleteBookingStatus(req, res) {
    try {
      const { id } = req.params;

      const bookingStatus = await BookingStatus.findByPk(id);
      
      if (!bookingStatus) {
        return errorResponse(res, {
          message: "Booking status not found",
        }, 404);
      }

      await bookingStatus.destroy();

      return successResponse(res, {
        message: "Booking status deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, "bookingStatus");
    }
  }
}

module.exports = BookingStatusController;