/**
 * Main Routes Index
 * Aggregates all API routes
 */

const express = require('express');
const router = express.Router();

// Import v1 routes
const authRoutes = require('./v1/auth.routes');
const usersRoutes = require('./v1/users.routes');
const patientsRoutes = require('./v1/patients.routes');
const doctorsRoutes = require('./v1/doctors.routes');
const hospitalsRoutes = require('./v1/hospitals.routes');
const treatmentsRoutes = require('./v1/treatments.routes');
const treatmentCategoriesRoutes = require('./v1/treatmentCategories.routes');
const bookingsRoutes = require('./v1/bookings.routes');
const appointmentsRoutes = require('./v1/appointments.routes');
const prescriptionsRoutes = require('./v1/prescriptions.routes');
const paymentsRoutes = require('./v1/payments.routes');
const invoicesRoutes = require('./v1/invoices.routes');
const reviewsRoutes = require('./v1/reviews.routes');
const notificationsRoutes = require('./v1/notifications.routes');
const uploadsRoutes = require('./v1/uploads.routes');
const insuranceRoutes = require('./v1/insurance.routes');
const laboratoriesRoutes = require('./v1/laboratories.routes');
const labTestsRoutes = require('./v1/labTests.routes');
const packagesRoutes = require('./v1/packages.routes');
const medicalRecordsRoutes = require('./v1/medicalRecords.routes');
const supportRoutes = require('./v1/support.routes');
const subscriptionsRoutes = require('./v1/subscriptions.routes');
const translationsRoutes = require('./v1/translations.routes');
const couponsRoutes = require('./v1/coupons.routes');
const faqsRoutes = require('./v1/faqs.routes');
const websiteContentRoutes = require('./v1/websiteContent.routes');
const healthRoutes = require('./v1/health.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/patients', patientsRoutes);
router.use('/doctors', doctorsRoutes);
router.use('/hospitals', hospitalsRoutes);
router.use('/treatments', treatmentsRoutes);
router.use('/treatment-categories', treatmentCategoriesRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/prescriptions', prescriptionsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/laboratories', laboratoriesRoutes);
router.use('/lab-tests', labTestsRoutes);
router.use('/packages', packagesRoutes);
router.use('/medical-records', medicalRecordsRoutes);
router.use('/support', supportRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/translations', translationsRoutes);
router.use('/coupons', couponsRoutes);
router.use('/faqs', faqsRoutes);
router.use('/website-content', websiteContentRoutes);
router.use('/health', healthRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Medivoy Healthcare API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      patients: '/api/v1/patients',
      doctors: '/api/v1/doctors',
      hospitals: '/api/v1/hospitals',
      treatments: '/api/v1/treatments',
      treatmentCategories: '/api/v1/treatment-categories',
      bookings: '/api/v1/bookings',
      appointments: '/api/v1/appointments',
      prescriptions: '/api/v1/prescriptions',
      payments: '/api/v1/payments',
      invoices: '/api/v1/invoices',
      reviews: '/api/v1/reviews',
      notifications: '/api/v1/notifications',
      uploads: '/api/v1/uploads',
      insurance: '/api/v1/insurance',
      laboratories: '/api/v1/laboratories',
      labTests: '/api/v1/lab-tests',
      packages: '/api/v1/packages',
      medicalRecords: '/api/v1/medical-records',
      support: '/api/v1/support',
      subscriptions: '/api/v1/subscriptions',
      translations: '/api/v1/translations',
      coupons: '/api/v1/coupons',
      faqs: '/api/v1/faqs',
      websiteContent: '/api/v1/website-content',
      health: '/api/v1/health',
      docs: '/api-docs'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;