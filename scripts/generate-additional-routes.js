const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../src/routes/v1');

const routes = [
  {
    name: 'payments.routes.js',
    content: `const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, authorize(['admin']), paymentController.getAllPayments);
router.post('/', authenticate, paymentController.createPayment);
router.get('/:id', authenticate, paymentController.getPayment);
router.post('/stripe', authenticate, paymentController.processStripePayment);
router.post('/razorpay', authenticate, paymentController.processRazorpayPayment);
router.post('/:id/refund', authenticate, authorize(['admin']), paymentController.refundPayment);
router.post('/:id/verify', authenticate, authorize(['admin']), paymentController.verifyPayment);

module.exports = router;
`
  },
  {
    name: 'prescriptions.routes.js',
    content: `const express = require('express');
const router = express.Router();
const prescriptionController = require('../../controllers/prescription.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, prescriptionController.getAllPrescriptions);
router.post('/', authenticate, authorize(['doctor']), prescriptionController.createPrescription);
router.get('/:id', authenticate, prescriptionController.getPrescription);
router.put('/:id', authenticate, authorize(['doctor']), prescriptionController.updatePrescription);
router.delete('/:id', authenticate, authorize(['doctor', 'admin']), prescriptionController.deletePrescription);
router.get('/patient/:patientId', authenticate, prescriptionController.getPatientPrescriptions);
router.get('/:id/pdf', authenticate, prescriptionController.generatePDF);

module.exports = router;
`
  },
  {
    name: 'reviews.routes.js',
    content: `const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/review.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.post('/', authenticate, reviewController.createReview);
router.get('/:id', reviewController.getReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.get('/:reviewableType/:reviewableId', reviewController.getEntityReviews);
router.post('/:id/approve', authenticate, authorize(['admin']), reviewController.approveReview);
router.post('/:id/reject', authenticate, authorize(['admin']), reviewController.rejectReview);

module.exports = router;
`
  },
  {
    name: 'notifications.routes.js',
    content: `const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, notificationController.getUserNotifications);
router.post('/', authenticate, authorize(['admin']), notificationController.createNotification);
router.get('/:id', authenticate, notificationController.getNotification);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;
`
  },
  {
    name: 'uploads.routes.js',
    content: `const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.post('/single', authenticate, upload.single('file'), uploadController.uploadFile);
router.post('/multiple', authenticate, upload.array('files', 10), uploadController.uploadMultipleFiles);
router.get('/', authenticate, uploadController.getAllMedia);
router.get('/:id', authenticate, uploadController.getMedia);
router.delete('/:id', authenticate, uploadController.deleteFile);

module.exports = router;
`
  },
  {
    name: 'insurance.routes.js',
    content: `const express = require('express');
const router = express.Router();
const insuranceController = require('../../controllers/insurance.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, insuranceController.getAllInsurance);
router.post('/', authenticate, insuranceController.createInsurance);
router.get('/:id', authenticate, insuranceController.getInsurance);
router.put('/:id', authenticate, insuranceController.updateInsurance);
router.delete('/:id', authenticate, authorize(['admin']), insuranceController.deleteInsurance);
router.post('/:id/verify', authenticate, authorize(['admin']), insuranceController.verifyInsurance);
router.post('/:id/check-coverage', authenticate, insuranceController.checkCoverage);

module.exports = router;
`
  },
  {
    name: 'health.routes.js',
    content: `const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @swagger
 * /api/v1/health/db:
 *   get:
 *     summary: Database health check
 *     tags: [Health]
 */
router.get('/db', async (req, res) => {
  try {
    const { sequelize } = require('../../models');
    await sequelize.authenticate();
    res.status(200).json({
      status: 'success',
      message: 'Database connection is healthy'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;
`
  }
];

// Generate all route files
routes.forEach(route => {
  const filePath = path.join(routesDir, route.name);
  fs.writeFileSync(filePath, route.content);
  console.log(`✓ Created ${route.name}`);
});

console.log(`\n✓ Successfully generated ${routes.length} additional route files!`);