const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../src/controllers');

const controllers = [
  {
    name: 'payment.controller.js',
    content: `const paymentService = require('../services/payment.service');
const { successResponse } = require('../utils/response');

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const payment = await paymentService.createPayment(req.body);
      return successResponse(res, payment, 'Payment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req, res, next) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      return successResponse(res, payment, 'Payment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async processStripePayment(req, res, next) {
    try {
      const payment = await paymentService.processStripePayment(req.body);
      return successResponse(res, payment, 'Stripe payment processed successfully');
    } catch (error) {
      next(error);
    }
  }

  async processRazorpayPayment(req, res, next) {
    try {
      const payment = await paymentService.processRazorpayPayment(req.body);
      return successResponse(res, payment, 'Razorpay payment processed successfully');
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req, res, next) {
    try {
      const { refundAmount, reason } = req.body;
      const payment = await paymentService.refundPayment(req.params.id, refundAmount, reason);
      return successResponse(res, payment, 'Payment refunded successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await paymentService.getAllPayments(filters, { page, limit });
      return successResponse(res, result, 'Payments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const payment = await paymentService.verifyPayment(req.params.id, req.body);
      return successResponse(res, payment, 'Payment verified successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
`
  },
  {
    name: 'prescription.controller.js',
    content: `const prescriptionService = require('../services/prescription.service');
const { successResponse } = require('../utils/response');

class PrescriptionController {
  async createPrescription(req, res, next) {
    try {
      const prescription = await prescriptionService.createPrescription(req.body);
      return successResponse(res, prescription, 'Prescription created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPrescription(req, res, next) {
    try {
      const prescription = await prescriptionService.getPrescriptionById(req.params.id);
      return successResponse(res, prescription, 'Prescription retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePrescription(req, res, next) {
    try {
      const prescription = await prescriptionService.updatePrescription(req.params.id, req.body);
      return successResponse(res, prescription, 'Prescription updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePrescription(req, res, next) {
    try {
      const result = await prescriptionService.deletePrescription(req.params.id);
      return successResponse(res, result, 'Prescription deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPrescriptions(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await prescriptionService.getAllPrescriptions(filters, { page, limit });
      return successResponse(res, result, 'Prescriptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPatientPrescriptions(req, res, next) {
    try {
      const prescriptions = await prescriptionService.getPatientPrescriptions(req.params.patientId);
      return successResponse(res, prescriptions, 'Patient prescriptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async generatePDF(req, res, next) {
    try {
      const result = await prescriptionService.generatePrescriptionPDF(req.params.id);
      return successResponse(res, result, 'Prescription PDF generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PrescriptionController();
`
  },
  {
    name: 'review.controller.js',
    content: `const reviewService = require('../services/review.service');
const { successResponse } = require('../utils/response');

class ReviewController {
  async createReview(req, res, next) {
    try {
      const review = await reviewService.createReview(req.body);
      return successResponse(res, review, 'Review created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getReview(req, res, next) {
    try {
      const review = await reviewService.getReviewById(req.params.id);
      return successResponse(res, review, 'Review retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      const review = await reviewService.updateReview(req.params.id, req.body);
      return successResponse(res, review, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const result = await reviewService.deleteReview(req.params.id);
      return successResponse(res, result, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getEntityReviews(req, res, next) {
    try {
      const { reviewableType, reviewableId } = req.params;
      const { page, limit } = req.query;
      const result = await reviewService.getEntityReviews(reviewableType, reviewableId, { page, limit });
      return successResponse(res, result, 'Reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async approveReview(req, res, next) {
    try {
      const review = await reviewService.approveReview(req.params.id);
      return successResponse(res, review, 'Review approved successfully');
    } catch (error) {
      next(error);
    }
  }

  async rejectReview(req, res, next) {
    try {
      const { reason } = req.body;
      const review = await reviewService.rejectReview(req.params.id, reason);
      return successResponse(res, review, 'Review rejected successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
`
  },
  {
    name: 'notification.controller.js',
    content: `const notificationService = require('../services/notification.service');
const { successResponse } = require('../utils/response');

class NotificationController {
  async createNotification(req, res, next) {
    try {
      const notification = await notificationService.createNotification(req.body);
      return successResponse(res, notification, 'Notification created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getNotification(req, res, next) {
    try {
      const notification = await notificationService.getNotificationById(req.params.id);
      return successResponse(res, notification, 'Notification retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getUserNotifications(req.user.id, req.query);
      return successResponse(res, notifications, 'User notifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id);
      return successResponse(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      return successResponse(res, result, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const result = await notificationService.deleteNotification(req.params.id);
      return successResponse(res, result, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
`
  },
  {
    name: 'upload.controller.js',
    content: `const uploadService = require('../services/upload.service');
const { successResponse } = require('../utils/response');

class UploadController {
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const media = await uploadService.uploadFile(req.file, req.body.folder);
      return successResponse(res, media, 'File uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async uploadMultipleFiles(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      
      const media = await uploadService.uploadMultipleFiles(req.files, req.body.folder);
      return successResponse(res, media, 'Files uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req, res, next) {
    try {
      const result = await uploadService.deleteFile(req.params.id);
      return successResponse(res, result, 'File deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMedia(req, res, next) {
    try {
      const media = await uploadService.getMediaById(req.params.id);
      return successResponse(res, media, 'Media retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllMedia(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await uploadService.getAllMedia(filters, { page, limit });
      return successResponse(res, result, 'Media retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
`
  },
  {
    name: 'insurance.controller.js',
    content: `const insuranceService = require('../services/insurance.service');
const { successResponse } = require('../utils/response');

class InsuranceController {
  async createInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.createInsurance(req.body);
      return successResponse(res, insurance, 'Insurance created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.getInsuranceById(req.params.id);
      return successResponse(res, insurance, 'Insurance retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.updateInsurance(req.params.id, req.body);
      return successResponse(res, insurance, 'Insurance updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteInsurance(req, res, next) {
    try {
      const result = await insuranceService.deleteInsurance(req.params.id);
      return successResponse(res, result, 'Insurance deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllInsurance(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await insuranceService.getAllInsurance(filters, { page, limit });
      return successResponse(res, result, 'Insurance retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyInsurance(req, res, next) {
    try {
      const insurance = await insuranceService.verifyInsurance(req.params.id, req.body);
      return successResponse(res, insurance, 'Insurance verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async checkCoverage(req, res, next) {
    try {
      const { treatmentId } = req.body;
      const coverage = await insuranceService.checkCoverage(req.params.id, treatmentId);
      return successResponse(res, coverage, 'Coverage checked successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InsuranceController();
`
  }
];

// Generate all controller files
controllers.forEach(controller => {
  const filePath = path.join(controllersDir, controller.name);
  fs.writeFileSync(filePath, controller.content);
  console.log(`✓ Created ${controller.name}`);
});

console.log(`\n✓ Successfully generated ${controllers.length} additional controller files!`);