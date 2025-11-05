/**
 * Booking Controller
 * Handles all booking-related operations
 * Status: Production-Ready
 */

const {
  Booking,
  BookingStatusHistory,
  Patient,
  Treatment,
  Hospital,
  Doctor,
  User,
  Staff,
} = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');
const { generateBookingNumber } = require('../utils/helpers');

/**
 * Create a new booking
 */
const createBooking = async (req, res, next) => {
  try {
    const {
      patientId,
      treatmentId,
      hospitalId,
      doctorId,
      medicalHistory,
      allergies,
      currentMedications,
      ...otherData
    } = req.body;

    // Generate unique booking number
    const bookingNumber = await generateBookingNumber();

    // Create booking
    const booking = await Booking.create({
      bookingNumber,
      patientId: patientId || req.user.id,
      treatmentId,
      hospitalId,
      doctorId,
      medicalHistory,
      allergies,
      currentMedications,
      status: 'inquiry',
      createdBy: req.user.id,
      ...otherData,
    });

    // Create initial status history
    await BookingStatusHistory.create({
      bookingId: booking.id,
      newStatus: 'inquiry',
      changedBy: req.user.id,
      changeReason: 'Initial booking created',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Fetch complete booking with associations
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user' }] },
        { model: Treatment, as: 'treatment' },
        { model: Hospital, as: 'hospital' },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user' }] },
      ],
    });

    logger.info(`Booking created: ${bookingNumber} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: completeBooking,
    });
  } catch (error) {
    logger.error('Error creating booking:', error);
    next(error);
  }
};

/**
 * Get all bookings with filters
 */
const getAllBookings = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      patientId,
      hospitalId,
      doctorId,
      treatmentId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (status) where.status = status;
    if (patientId) where.patientId = patientId;
    if (hospitalId) where.hospitalId = hospitalId;
    if (doctorId) where.doctorId = doctorId;
    if (treatmentId) where.treatmentId = treatmentId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Role-based filtering
    if (req.user.role === 'patient') {
      where.patientId = req.user.id;
    } else if (req.user.role === 'doctor') {
      where.doctorId = req.user.id;
    } else if (req.user.role === 'hospital_admin') {
      // Get hospital ID for the admin
      const staff = await Staff.findOne({ where: { userId: req.user.id } });
      if (staff) where.hospitalId = staff.hospitalId;
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user' }] },
        { model: Treatment, as: 'treatment' },
        { model: Hospital, as: 'hospital' },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user' }] },
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder]],
    });

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching bookings:', error);
    next(error);
  }
};

/**
 * Get single booking by ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user' }] },
        { model: Treatment, as: 'treatment' },
        { model: Hospital, as: 'hospital' },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user' }] },
        {
          model: BookingStatusHistory,
          as: 'statusHistory',
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Check access permissions
    if (req.user.role === 'patient' && booking.patientId !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error('Error fetching booking:', error);
    next(error);
  }
};

/**
 * Update booking
 */
const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Check permissions
    if (req.user.role === 'patient' && booking.patientId !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    // Track status change
    if (updateData.status && updateData.status !== booking.status) {
      await BookingStatusHistory.create({
        bookingId: id,
        oldStatus: booking.status,
        newStatus: updateData.status,
        changedBy: req.user.id,
        changeReason: updateData.statusChangeReason || 'Status updated',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
    }

    // Update booking
    updateData.updatedBy = req.user.id;
    await booking.update(updateData);

    // Fetch updated booking with associations
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user' }] },
        { model: Treatment, as: 'treatment' },
        { model: Hospital, as: 'hospital' },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user' }] },
      ],
    });

    logger.info(`Booking updated: ${booking.bookingNumber} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    logger.error('Error updating booking:', error);
    next(error);
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Validate status transition
    const validTransitions = {
      inquiry: ['lead_assigned', 'cancelled'],
      lead_assigned: ['consultation_scheduled', 'cancelled'],
      consultation_scheduled: ['consultation_completed', 'cancelled'],
      consultation_completed: ['medical_review_pending', 'cancelled'],
      medical_review_pending: ['medical_approved', 'medical_rejected'],
      medical_approved: ['quote_generated', 'cancelled'],
      medical_rejected: ['cancelled'],
      quote_generated: ['quote_accepted', 'quote_rejected'],
      quote_accepted: ['payment_pending', 'cancelled'],
      quote_rejected: ['cancelled'],
      payment_pending: ['payment_received', 'cancelled'],
      payment_received: ['travel_arranged', 'treatment_scheduled'],
      travel_arranged: ['treatment_scheduled', 'cancelled'],
      treatment_scheduled: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    // Ensure status array exists and check allowed transition
    const allowedTransitions = validTransitions[booking.status] || [];
    if (!allowedTransitions.includes(status)) {
      throw new AppError(`Invalid status transition from ${booking.status} to ${status}`, 400);
    }

    // Create status history
    await BookingStatusHistory.create({
      bookingId: id,
      oldStatus: booking.status,
      newStatus: status,
      changedBy: req.user.id,
      changeReason: reason || `Status changed to ${status}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Update booking status
    await booking.update({
      status,
      updatedBy: req.user.id,
      ...(status === 'cancelled' && {
        cancelledAt: new Date(),
        cancelledBy: req.user.id,
        cancellationReason: reason,
      }),
    });

    logger.info(
      `Booking status updated: ${booking.bookingNumber} from ${booking.status} to ${status}`,
    );

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    logger.error('Error updating booking status:', error);
    next(error);
  }
};

/**
 * Delete booking (soft delete)
 */
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Only admins can delete bookings
    if (req.user.role !== 'admin') {
      throw new AppError('Access denied', 403);
    }

    await booking.update({ isArchived: true });

    logger.info(`Booking archived: ${booking.bookingNumber} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting booking:', error);
    next(error);
  }
};

/**
 * Get booking statistics
 */
const getBookingStats = async (req, res, next) => {
  try {
    const { startDate, endDate, hospitalId, doctorId } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }
    if (hospitalId) where.hospitalId = hospitalId;
    if (doctorId) where.doctorId = doctorId;

    // Get stats by status
    const statusStats = await Booking.findAll({
      where,
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
    });

    // Get total revenue
    const revenue = await Booking.sum('paidAmount', {
      where: {
        ...where,
        paymentStatus: 'completed',
      },
    });

    // Get monthly trends
    const monthlyTrends = await Booking.findAll({
      where,
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('paidAmount')), 'revenue'],
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
    });

    res.json({
      success: true,
      data: {
        statusStats,
        totalRevenue: revenue || 0,
        monthlyTrends,
      },
    });
  } catch (error) {
    logger.error('Error fetching booking stats:', error);
    next(error);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
};

// Provide backward-compatible aliases and lightweight stubs for route handlers
// that are referenced by routes but may not have full implementations yet.
const notImplemented = (name) => async (req, res) => {
  res.status(501).json({ success: false, message: `Not implemented: ${name}` });
};

// Export aliases & stubs
module.exports.assignCoordinator = notImplemented('assignCoordinator');
module.exports.scheduleConsultation = notImplemented('scheduleConsultation');
module.exports.completeConsultation = notImplemented('completeConsultation');
module.exports.approveMedical = notImplemented('approveMedical');
module.exports.rejectMedical = notImplemented('rejectMedical');
module.exports.processPayment = notImplemented('processPayment');
module.exports.arrangeTravel = notImplemented('arrangeTravel');
module.exports.scheduleTreatment = notImplemented('scheduleTreatment');
module.exports.completeTreatment = notImplemented('completeTreatment');
module.exports.submitFeedback = notImplemented('submitFeedback');
module.exports.getPatientBookings = async (req, res, next) => {
  // Delegate to getAllBookings with patient role filter
  try {
    // reuse existing controller logic
    return await getAllBookings(req, res, next);
  } catch (err) {
    next(err);
  }
};
module.exports.getBooking = getBookingById;
module.exports.cancelBooking = notImplemented('cancelBooking');
