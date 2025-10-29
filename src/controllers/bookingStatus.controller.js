/**
 * Booking Status Controller
 * Handles booking status management and history tracking
 */

const { Op } = require('sequelize');
const {
  Booking,
  BookingStatusHistory,
  Patient,
  Hospital,
  Treatment,
  User,
} = require('../models');

/**
 * Valid status transitions
 */
const VALID_TRANSITIONS = {
  requested: ['under_review', 'rejected', 'cancelled'],
  under_review: ['accepted', 'rejected', 'cancelled'],
  accepted: ['quotation_sent', 'cancelled'],
  quotation_sent: ['payment_details', 'cancelled'],
  payment_details: ['confirmation_sent', 'cancelled'],
  confirmation_sent: ['payment_received', 'cancelled'],
  payment_received: ['confirmation_completed', 'cancelled'],
  confirmation_completed: ['invoice_sent', 'cancelled'],
  invoice_sent: ['travel_arrangements', 'cancelled'],
  travel_arrangements: ['consultation_scheduled', 'cancelled'],
  consultation_scheduled: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: ['feedback_received'],
  feedback_received: [],
  rejected: [],
  cancelled: [],
};

/**
 * Update booking status with validation and history tracking
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status, sub_status, reason, notes, changed_by, changed_by_type,
    } = req.body;

    // Get booking
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const currentStatus = booking.status;

    // Validate status transition
    if (!VALID_TRANSITIONS[currentStatus]) {
      return res.status(400).json({
        success: false,
        message: `Invalid current status: ${currentStatus}`,
      });
    }

    if (!VALID_TRANSITIONS[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to ${status}. Valid transitions: ${VALID_TRANSITIONS[currentStatus].join(', ')}`,
      });
    }

    // Update booking status
    await booking.update({
      status,
      sub_status,
      ...(status === 'cancelled' && {
        cancellation_reason: reason,
        cancelled_by: changed_by,
        cancelled_at: new Date(),
      }),
      ...(status === 'accepted'
        && !booking.confirmed_date && {
        confirmed_date: new Date(),
      }),
      ...(status === 'completed'
        && !booking.completion_date && {
        completion_date: new Date(),
      }),
    });

    // Create status history record
    await BookingStatusHistory.create({
      booking_id: id,
      from_status: currentStatus,
      to_status: status,
      changed_by,
      changed_by_type: changed_by_type || 'system',
      reason,
      notes,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
    });

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user' }],
        },
        { model: Hospital, as: 'hospital' },
        { model: Treatment, as: 'treatment' },
      ],
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message,
    });
  }
};

/**
 * Get booking status history
 */
exports.getBookingStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const history = await BookingStatusHistory.findAll({
      where: { booking_id: id },
      include: [
        {
          model: User,
          as: 'changedBy',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        booking_id: id,
        current_status: booking.status,
        history,
      },
    });
  } catch (error) {
    console.error('Error fetching booking status history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking status history',
      error: error.message,
    });
  }
};

/**
 * Assign coordinator to booking
 */
exports.assignCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const { coordinator_id, notes } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Validate coordinator exists
    const coordinator = await User.findByPk(coordinator_id);
    if (!coordinator) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found',
      });
    }

    const previousCoordinator = booking.coordinator_id;
    await booking.update({ coordinator_id, notes });

    // Create history record
    await BookingStatusHistory.create({
      booking_id: id,
      from_status: booking.status,
      to_status: booking.status,
      changed_by: coordinator_id,
      changed_by_type: 'staff',
      reason: 'Coordinator assigned',
      notes: `Coordinator changed from ${previousCoordinator || 'none'} to ${coordinator_id}`,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
    });

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'coordinator',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Coordinator assigned successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error assigning coordinator:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning coordinator',
      error: error.message,
    });
  }
};

/**
 * Get bookings by status
 */
exports.getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const {
      page = 1, limit = 10, hospitalId, coordinatorId,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { status };

    if (hospitalId) whereClause.hospital_id = hospitalId;
    if (coordinatorId) whereClause.coordinator_id = coordinatorId;

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user' }],
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'name', 'city', 'country'],
        },
        { model: Treatment, as: 'treatment', attributes: ['id', 'name'] },
        {
          model: User,
          as: 'coordinator',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings by status',
      error: error.message,
    });
  }
};

/**
 * Get valid status transitions for a booking
 */
exports.getValidTransitions = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const validTransitions = VALID_TRANSITIONS[booking.status] || [];

    res.json({
      success: true,
      data: {
        current_status: booking.status,
        valid_transitions: validTransitions,
      },
    });
  } catch (error) {
    console.error('Error fetching valid transitions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching valid transitions',
      error: error.message,
    });
  }
};

/**
 * Bulk update booking status
 */
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const {
      booking_ids, status, reason, notes, changed_by, changed_by_type,
    } = req.body;

    if (!Array.isArray(booking_ids) || booking_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'booking_ids array is required',
      });
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const bookingId of booking_ids) {
      try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
          results.failed.push({
            booking_id: bookingId,
            reason: 'Booking not found',
          });
          continue;
        }

        const currentStatus = booking.status;

        // Validate transition
        if (!VALID_TRANSITIONS[currentStatus].includes(status)) {
          results.failed.push({
            booking_id: bookingId,
            reason: `Invalid transition from ${currentStatus} to ${status}`,
          });
          continue;
        }

        // Update booking
        await booking.update({ status });

        // Create history
        await BookingStatusHistory.create({
          booking_id: bookingId,
          from_status: currentStatus,
          to_status: status,
          changed_by,
          changed_by_type: changed_by_type || 'system',
          reason,
          notes,
          ip_address: req.ip,
          user_agent: req.get('user-agent'),
        });

        results.success.push(bookingId);
      } catch (error) {
        results.failed.push({ booking_id: bookingId, reason: error.message });
      }
    }

    res.json({
      success: true,
      message: `Updated ${results.success.length} bookings, ${results.failed.length} failed`,
      data: results,
    });
  } catch (error) {
    console.error('Error bulk updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk updating status',
      error: error.message,
    });
  }
};

/**
 * Get booking status statistics
 */
exports.getStatusStatistics = async (req, res) => {
  try {
    const { hospitalId, startDate, endDate } = req.query;

    const whereClause = {};
    if (hospitalId) whereClause.hospital_id = hospitalId;
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const statusCounts = await Booking.findAll({
      where: whereClause,
      attributes: [
        'status',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('id')),
          'count',
        ],
      ],
      group: ['status'],
      raw: true,
    });

    const total = statusCounts.reduce(
      (sum, item) => sum + parseInt(item.count, 10),
      0,
    );

    const statistics = statusCounts.map((item) => ({
      status: item.status,
      count: parseInt(item.count, 10),
      percentage:
        total > 0 ? ((parseInt(item.count, 10) / total) * 100).toFixed(2) : 0,
    }));

    res.json({
      success: true,
      data: {
        total,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error fetching status statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching status statistics',
      error: error.message,
    });
  }
};
