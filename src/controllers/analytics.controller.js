/**
 * Analytics Controller
 * Handles analytics and dashboard statistics
 */

const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const {
  Booking,
  Appointment,
  Patient,
  Doctor,
  Hospital,
  Treatment,
  Payment,
  Review,
  User,
} = require('../models');

/**
 * Get overall dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate, hospitalId } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Build hospital filter
    const hospitalFilter = hospitalId ? { hospital_id: hospitalId } : {};

    // Get total counts
    const [
      totalBookings,
      totalAppointments,
      totalPatients,
      totalDoctors,
      totalHospitals,
      totalRevenue,
      pendingBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      Booking.count({ where: { ...dateFilter, ...hospitalFilter } }),
      Appointment.count({ where: dateFilter }),
      Patient.count(),
      Doctor.count(),
      Hospital.count(),
      Payment.sum('amount', {
        where: { ...dateFilter, payment_status: 'completed' },
      }),
      Booking.count({
        where: {
          ...dateFilter,
          ...hospitalFilter,
          status: { [Op.in]: ['requested', 'under_review', 'quotation_sent'] },
        },
      }),
      Booking.count({
        where: { ...dateFilter, ...hospitalFilter, status: 'completed' },
      }),
      Booking.count({
        where: { ...dateFilter, ...hospitalFilter, status: 'cancelled' },
      }),
    ]);

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      where: { ...dateFilter, ...hospitalFilter },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user' }],
        },
        { model: Hospital, as: 'hospital' },
        { model: Treatment, as: 'treatment' },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    // Get booking status distribution
    const statusDistribution = await Booking.findAll({
      where: { ...dateFilter, ...hospitalFilter },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Get monthly revenue trend (last 12 months)
    const monthlyRevenue = await Payment.findAll({
      where: {
        payment_status: 'completed',
        created_at: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      attributes: [
        [
          sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')),
          'month',
        ],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
      order: [
        [
          sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')),
          'ASC',
        ],
      ],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalBookings,
          totalAppointments,
          totalPatients,
          totalDoctors,
          totalHospitals,
          totalRevenue: totalRevenue || 0,
          pendingBookings,
          completedBookings,
          cancelledBookings,
        },
        recentBookings,
        statusDistribution,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message,
    });
  }
};

/**
 * Get booking analytics
 */
exports.getBookingAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, hospitalId, groupBy = 'day' } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const hospitalFilter = hospitalId ? { hospital_id: hospitalId } : {};

    // Determine date truncation based on groupBy
    let dateTrunc = 'day';
    if (groupBy === 'week') dateTrunc = 'week';
    if (groupBy === 'month') dateTrunc = 'month';
    if (groupBy === 'year') dateTrunc = 'year';

    // Get bookings over time
    const bookingsOverTime = await Booking.findAll({
      where: { ...dateFilter, ...hospitalFilter },
      attributes: [
        [
          sequelize.fn('DATE_TRUNC', dateTrunc, sequelize.col('created_at')),
          'period',
        ],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        'status',
      ],
      group: [
        sequelize.fn('DATE_TRUNC', dateTrunc, sequelize.col('created_at')),
        'status',
      ],
      order: [
        [
          sequelize.fn('DATE_TRUNC', dateTrunc, sequelize.col('created_at')),
          'ASC',
        ],
      ],
      raw: true,
    });

    // Get bookings by treatment
    const bookingsByTreatment = await Booking.findAll({
      where: { ...dateFilter, ...hospitalFilter },
      include: [{ model: Treatment, as: 'treatment', attributes: ['name'] }],
      attributes: [
        'treatment_id',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count'],
      ],
      group: ['treatment_id', 'treatment.id', 'treatment.name'],
      order: [[sequelize.fn('COUNT', sequelize.col('Booking.id')), 'DESC']],
      limit: 10,
      raw: false,
    });

    // Get bookings by hospital
    const bookingsByHospital = await Booking.findAll({
      where: { ...dateFilter, ...hospitalFilter },
      include: [{ model: Hospital, as: 'hospital', attributes: ['name'] }],
      attributes: [
        'hospital_id',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count'],
      ],
      group: ['hospital_id', 'hospital.id', 'hospital.name'],
      order: [[sequelize.fn('COUNT', sequelize.col('Booking.id')), 'DESC']],
      limit: 10,
      raw: false,
    });

    // Get conversion rate
    const totalRequests = await Booking.count({
      where: { ...dateFilter, ...hospitalFilter },
    });
    const completedBookings = await Booking.count({
      where: { ...dateFilter, ...hospitalFilter, status: 'completed' },
    });
    const conversionRate =
      totalRequests > 0 ? (completedBookings / totalRequests) * 100 : 0;

    res.json({
      success: true,
      data: {
        bookingsOverTime,
        bookingsByTreatment,
        bookingsByHospital,
        conversionRate: conversionRate.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error fetching booking analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking analytics',
      error: error.message,
    });
  }
};

/**
 * Get revenue analytics
 */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, hospitalId, groupBy = 'month' } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Determine date truncation
    let dateTrunc = 'month';
    if (groupBy === 'day') dateTrunc = 'day';
    if (groupBy === 'week') dateTrunc = 'week';
    if (groupBy === 'year') dateTrunc = 'year';

    // Get revenue over time
    const revenueOverTime = await Payment.findAll({
      where: { ...dateFilter, payment_status: 'completed' },
      attributes: [
        [
          sequelize.fn('DATE_TRUNC', dateTrunc, sequelize.col('created_at')),
          'period',
        ],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'transactions'],
      ],
      group: [
        sequelize.fn('DATE_TRUNC', dateTrunc, sequelize.col('created_at')),
      ],
      order: [
        [
          sequelize.fn('DATE_TRUNC', dateTrunc, sequelize.col('created_at')),
          'ASC',
        ],
      ],
      raw: true,
    });

    // Get revenue by payment method
    const revenueByMethod = await Payment.findAll({
      where: { ...dateFilter, payment_status: 'completed' },
      attributes: [
        'payment_method',
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['payment_method'],
      raw: true,
    });

    // Get total revenue stats
    const totalRevenue = await Payment.sum('amount', {
      where: { ...dateFilter, payment_status: 'completed' },
    });

    const averageTransactionValue = await Payment.findOne({
      where: { ...dateFilter, payment_status: 'completed' },
      attributes: [[sequelize.fn('AVG', sequelize.col('amount')), 'average']],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue || 0,
        averageTransactionValue: averageTransactionValue?.average || 0,
        revenueOverTime,
        revenueByMethod,
      },
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue analytics',
      error: error.message,
    });
  }
};

/**
 * Get top hospitals
 */
exports.getTopHospitals = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const topHospitals = await Hospital.findAll({
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: dateFilter,
          attributes: [],
          required: false,
        },
        {
          model: Review,
          as: 'reviews',
          attributes: [],
          required: false,
        },
      ],
      attributes: [
        'id',
        'name',
        'city',
        'country',
        [sequelize.fn('COUNT', sequelize.col('bookings.id')), 'totalBookings'],
        [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'averageRating'],
      ],
      group: ['Hospital.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('bookings.id')), 'DESC']],
      limit: parseInt(limit, 10),
      subQuery: false,
    });

    res.json({
      success: true,
      data: topHospitals,
    });
  } catch (error) {
    console.error('Error fetching top hospitals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top hospitals',
      error: error.message,
    });
  }
};

/**
 * Get top treatments
 */
exports.getTopTreatments = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const topTreatments = await Treatment.findAll({
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: dateFilter,
          attributes: [],
          required: false,
        },
      ],
      attributes: [
        'id',
        'name',
        'description',
        [sequelize.fn('COUNT', sequelize.col('bookings.id')), 'totalBookings'],
      ],
      group: ['Treatment.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('bookings.id')), 'DESC']],
      limit: parseInt(limit, 10),
      subQuery: false,
    });

    res.json({
      success: true,
      data: topTreatments,
    });
  } catch (error) {
    console.error('Error fetching top treatments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top treatments',
      error: error.message,
    });
  }
};

/**
 * Get patient demographics
 */
exports.getPatientDemographics = async (req, res) => {
  try {
    // Get patients by country
    const patientsByCountry = await Patient.findAll({
      attributes: [
        'country',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['country'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    // Get patients by age group
    const patientsByAge = await Patient.findAll({
      attributes: [
        [
          sequelize.literal(`
            CASE 
              WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) < 18 THEN 'Under 18'
              WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 18 AND 30 THEN '18-30'
              WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 31 AND 45 THEN '31-45'
              WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 46 AND 60 THEN '46-60'
              ELSE 'Over 60'
            END
          `),
          'ageGroup',
        ],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['ageGroup'],
      raw: true,
    });

    // Get patients by gender
    const patientsByGender = await Patient.findAll({
      attributes: [
        'gender',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['gender'],
      raw: true,
    });

    // Get total patients
    const totalPatients = await Patient.count();

    res.json({
      success: true,
      data: {
        totalPatients,
        patientsByCountry,
        patientsByAge,
        patientsByGender,
      },
    });
  } catch (error) {
    console.error('Error fetching patient demographics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient demographics',
      error: error.message,
    });
  }
};

/**
 * Get doctor performance analytics
 */
exports.getDoctorAnalytics = async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const doctorFilter = doctorId ? { doctor_id: doctorId } : {};

    const doctorStats = await Doctor.findAll({
      where: doctorId ? { id: doctorId } : {},
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email'],
        },
        {
          model: Appointment,
          as: 'appointments',
          where: dateFilter,
          attributes: [],
          required: false,
        },
        {
          model: Review,
          as: 'reviews',
          attributes: [],
          required: false,
        },
      ],
      attributes: [
        'id',
        'specialization',
        [
          sequelize.fn('COUNT', sequelize.col('appointments.id')),
          'totalAppointments',
        ],
        [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'totalReviews'],
      ],
      group: ['Doctor.id', 'user.id'],
      order: [
        [sequelize.fn('COUNT', sequelize.col('appointments.id')), 'DESC'],
      ],
      limit: 20,
      subQuery: false,
    });

    res.json({
      success: true,
      data: doctorStats,
    });
  } catch (error) {
    console.error('Error fetching doctor analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor analytics',
      error: error.message,
    });
  }
};
