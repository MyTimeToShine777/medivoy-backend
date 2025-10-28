const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../src/services');

const services = [
  {
    name: 'email.service.js',
    content: `const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error-handler');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  async sendEmail(to, subject, html, attachments = []) {
    try {
      const mailOptions = {
        from: config.email.from,
        to,
        subject,
        html,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(\`Email sent: \${info.messageId}\`);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Medivoy';
    const html = \`
      <h1>Welcome to Medivoy, \${user.first_name}!</h1>
      <p>Thank you for registering with us.</p>
      <p>We're excited to have you on board.</p>
    \`;
    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = \`\${config.app.frontendUrl}/reset-password?token=\${resetToken}\`;
    const subject = 'Password Reset Request';
    const html = \`
      <h1>Password Reset</h1>
      <p>Hi \${user.first_name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="\${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    \`;
    return this.sendEmail(user.email, subject, html);
  }

  async sendBookingConfirmation(booking) {
    const subject = 'Booking Confirmation';
    const html = \`
      <h1>Booking Confirmed</h1>
      <p>Your booking #\${booking.booking_number} has been confirmed.</p>
      <p>Treatment: \${booking.treatment_name}</p>
      <p>Hospital: \${booking.hospital_name}</p>
      <p>Date: \${booking.preferred_date}</p>
    \`;
    return this.sendEmail(booking.patient_email, subject, html);
  }

  async sendAppointmentReminder(appointment) {
    const subject = 'Appointment Reminder';
    const html = \`
      <h1>Appointment Reminder</h1>
      <p>This is a reminder for your upcoming appointment.</p>
      <p>Date: \${appointment.appointment_date}</p>
      <p>Time: \${appointment.appointment_time}</p>
      <p>Doctor: Dr. \${appointment.doctor_name}</p>
    \`;
    return this.sendEmail(appointment.patient_email, subject, html);
  }

  async sendInvoice(invoice, pdfBuffer) {
    const subject = \`Invoice #\${invoice.invoice_number}\`;
    const html = \`
      <h1>Invoice</h1>
      <p>Please find your invoice attached.</p>
      <p>Amount: \${invoice.total_amount}</p>
      <p>Due Date: \${invoice.due_date}</p>
    \`;
    const attachments = [{
      filename: \`invoice-\${invoice.invoice_number}.pdf\`,
      content: pdfBuffer
    }];
    return this.sendEmail(invoice.patient_email, subject, html, attachments);
  }
}

module.exports = new EmailService();
`
  },
  {
    name: 'notification.service.js',
    content: `const { Notification } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error-handler');

class NotificationService {
  async createNotification(notificationData) {
    try {
      const notification = await Notification.create(notificationData);
      
      // Send notification based on type
      if (notificationData.type === 'email') {
        await this.sendEmailNotification(notification);
      } else if (notificationData.type === 'sms') {
        await this.sendSMSNotification(notification);
      } else if (notificationData.type === 'push') {
        await this.sendPushNotification(notification);
      }
      
      logger.info(\`Notification created: \${notification.id}\`);
      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw new AppError('Failed to create notification', 500);
    }
  }

  async sendEmailNotification(notification) {
    try {
      await emailService.sendEmail(
        notification.recipient_email,
        notification.title,
        notification.message
      );
      await notification.update({ status: 'sent', sent_at: new Date() });
    } catch (error) {
      await notification.update({ status: 'failed', error_message: error.message });
      throw error;
    }
  }

  async sendSMSNotification(notification) {
    // TODO: Implement Twilio SMS sending
    logger.info(\`SMS notification: \${notification.id}\`);
    await notification.update({ status: 'sent', sent_at: new Date() });
  }

  async sendPushNotification(notification) {
    // TODO: Implement Firebase push notification
    logger.info(\`Push notification: \${notification.id}\`);
    await notification.update({ status: 'sent', sent_at: new Date() });
  }

  async getNotificationById(notificationId) {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  }

  async getUserNotifications(userId, filters = {}) {
    const notifications = await Notification.findAll({
      where: { user_id: userId, ...filters },
      order: [['created_at', 'DESC']]
    });
    return notifications;
  }

  async markAsRead(notificationId) {
    const notification = await this.getNotificationById(notificationId);
    await notification.update({ is_read: true, read_at: new Date() });
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.update(
      { is_read: true, read_at: new Date() },
      { where: { user_id: userId, is_read: false } }
    );
    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId) {
    const notification = await this.getNotificationById(notificationId);
    await notification.destroy();
    return { message: 'Notification deleted successfully' };
  }
}

module.exports = new NotificationService();
`
  },
  {
    name: 'payment.service.js',
    content: `const { Payment, Invoice, Booking } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class PaymentService {
  async createPayment(paymentData) {
    try {
      const payment = await Payment.create(paymentData);
      logger.info(\`Payment created: \${payment.id}\`);
      return payment;
    } catch (error) {
      logger.error('Error creating payment:', error);
      throw new AppError('Failed to create payment', 500);
    }
  }

  async getPaymentById(paymentId) {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Booking, as: 'booking' },
        { model: Invoice, as: 'invoice' }
      ]
    });
    
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    
    return payment;
  }

  async processStripePayment(paymentData) {
    try {
      // TODO: Implement Stripe payment processing
      const payment = await this.createPayment({
        ...paymentData,
        payment_method: 'stripe',
        status: 'pending'
      });
      
      // Simulate Stripe processing
      await payment.update({
        status: 'completed',
        transaction_id: \`stripe_\${Date.now()}\`,
        paid_at: new Date()
      });
      
      logger.info(\`Stripe payment processed: \${payment.id}\`);
      return payment;
    } catch (error) {
      logger.error('Error processing Stripe payment:', error);
      throw new AppError('Failed to process payment', 500);
    }
  }

  async processRazorpayPayment(paymentData) {
    try {
      // TODO: Implement Razorpay payment processing
      const payment = await this.createPayment({
        ...paymentData,
        payment_method: 'razorpay',
        status: 'pending'
      });
      
      // Simulate Razorpay processing
      await payment.update({
        status: 'completed',
        transaction_id: \`razorpay_\${Date.now()}\`,
        paid_at: new Date()
      });
      
      logger.info(\`Razorpay payment processed: \${payment.id}\`);
      return payment;
    } catch (error) {
      logger.error('Error processing Razorpay payment:', error);
      throw new AppError('Failed to process payment', 500);
    }
  }

  async refundPayment(paymentId, refundAmount, reason) {
    const payment = await this.getPaymentById(paymentId);
    
    if (payment.status !== 'completed') {
      throw new AppError('Only completed payments can be refunded', 400);
    }
    
    // TODO: Implement actual refund logic with payment gateway
    await payment.update({
      status: 'refunded',
      refund_amount: refundAmount,
      refund_reason: reason,
      refunded_at: new Date()
    });
    
    logger.info(\`Payment refunded: \${paymentId}\`);
    return payment;
  }

  async getAllPayments(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Booking, as: 'booking' },
        { model: Invoice, as: 'invoice' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      payments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async verifyPayment(paymentId, verificationData) {
    const payment = await this.getPaymentById(paymentId);
    await payment.update({
      is_verified: true,
      verification_data: verificationData,
      verified_at: new Date()
    });
    logger.info(\`Payment verified: \${paymentId}\`);
    return payment;
  }
}

module.exports = new PaymentService();
`
  },
  {
    name: 'prescription.service.js',
    content: `const { Prescription, Appointment, Doctor, Patient } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class PrescriptionService {
  async createPrescription(prescriptionData) {
    try {
      const prescription = await Prescription.create(prescriptionData);
      logger.info(\`Prescription created: \${prescription.id}\`);
      return prescription;
    } catch (error) {
      logger.error('Error creating prescription:', error);
      throw new AppError('Failed to create prescription', 500);
    }
  }

  async getPrescriptionById(prescriptionId) {
    const prescription = await Prescription.findByPk(prescriptionId, {
      include: [
        { model: Appointment, as: 'appointment' },
        { model: Doctor, as: 'doctor' },
        { model: Patient, as: 'patient' }
      ]
    });
    
    if (!prescription) {
      throw new AppError('Prescription not found', 404);
    }
    
    return prescription;
  }

  async updatePrescription(prescriptionId, updateData) {
    const prescription = await this.getPrescriptionById(prescriptionId);
    await prescription.update(updateData);
    logger.info(\`Prescription updated: \${prescriptionId}\`);
    return prescription;
  }

  async deletePrescription(prescriptionId) {
    const prescription = await this.getPrescriptionById(prescriptionId);
    await prescription.destroy();
    logger.info(\`Prescription deleted: \${prescriptionId}\`);
    return { message: 'Prescription deleted successfully' };
  }

  async getAllPrescriptions(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Prescription.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Appointment, as: 'appointment' },
        { model: Doctor, as: 'doctor' },
        { model: Patient, as: 'patient' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      prescriptions: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getPatientPrescriptions(patientId) {
    const prescriptions = await Prescription.findAll({
      where: { patient_id: patientId },
      include: [
        { model: Doctor, as: 'doctor' },
        { model: Appointment, as: 'appointment' }
      ],
      order: [['created_at', 'DESC']]
    });
    return prescriptions;
  }

  async generatePrescriptionPDF(prescriptionId) {
    const prescription = await this.getPrescriptionById(prescriptionId);
    
    // TODO: Implement PDF generation
    logger.info(\`Generating PDF for prescription: \${prescriptionId}\`);
    
    return {
      message: 'PDF generation not yet implemented',
      prescription
    };
  }
}

module.exports = new PrescriptionService();
`
  },
  {
    name: 'review.service.js',
    content: `const { Review, User, Hospital, Doctor } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class ReviewService {
  async createReview(reviewData) {
    try {
      const review = await Review.create(reviewData);
      
      // Update average rating for the reviewed entity
      await this.updateAverageRating(reviewData.reviewable_type, reviewData.reviewable_id);
      
      logger.info(\`Review created: \${review.id}\`);
      return review;
    } catch (error) {
      logger.error('Error creating review:', error);
      throw new AppError('Failed to create review', 500);
    }
  }

  async getReviewById(reviewId) {
    const review = await Review.findByPk(reviewId, {
      include: [{ model: User, as: 'user' }]
    });
    
    if (!review) {
      throw new AppError('Review not found', 404);
    }
    
    return review;
  }

  async updateReview(reviewId, updateData) {
    const review = await this.getReviewById(reviewId);
    await review.update(updateData);
    
    // Update average rating
    await this.updateAverageRating(review.reviewable_type, review.reviewable_id);
    
    logger.info(\`Review updated: \${reviewId}\`);
    return review;
  }

  async deleteReview(reviewId) {
    const review = await this.getReviewById(reviewId);
    const { reviewable_type, reviewable_id } = review;
    
    await review.destroy();
    
    // Update average rating
    await this.updateAverageRating(reviewable_type, reviewable_id);
    
    logger.info(\`Review deleted: \${reviewId}\`);
    return { message: 'Review deleted successfully' };
  }

  async getEntityReviews(reviewableType, reviewableId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: {
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
        is_approved: true
      },
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']]
    });

    return {
      reviews: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateAverageRating(reviewableType, reviewableId) {
    const reviews = await Review.findAll({
      where: {
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
        is_approved: true
      }
    });

    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update the entity's average rating
    let Model;
    if (reviewableType === 'Hospital') {
      Model = Hospital;
    } else if (reviewableType === 'Doctor') {
      Model = Doctor;
    }

    if (Model) {
      await Model.update(
        { average_rating: averageRating, total_reviews: reviews.length },
        { where: { id: reviewableId } }
      );
    }
  }

  async approveReview(reviewId) {
    const review = await this.getReviewById(reviewId);
    await review.update({ is_approved: true, approved_at: new Date() });
    
    // Update average rating
    await this.updateAverageRating(review.reviewable_type, review.reviewable_id);
    
    logger.info(\`Review approved: \${reviewId}\`);
    return review;
  }

  async rejectReview(reviewId, reason) {
    const review = await this.getReviewById(reviewId);
    await review.update({
      is_approved: false,
      rejection_reason: reason
    });
    logger.info(\`Review rejected: \${reviewId}\`);
    return review;
  }
}

module.exports = new ReviewService();
`
  },
  {
    name: 'upload.service.js',
    content: `const cloudinary = require('cloudinary').v2;
const { Media } = require('../models');
const config = require('../config');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error-handler');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

class UploadService {
  async uploadFile(file, folder = 'medivoy') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'auto'
      });

      const media = await Media.create({
        file_name: file.originalname,
        file_path: result.secure_url,
        file_type: file.mimetype,
        file_size: file.size,
        cloudinary_id: result.public_id
      });

      logger.info(\`File uploaded: \${media.id}\`);
      return media;
    } catch (error) {
      logger.error('Error uploading file:', error);
      throw new AppError('Failed to upload file', 500);
    }
  }

  async uploadMultipleFiles(files, folder = 'medivoy') {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, folder));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      logger.error('Error uploading multiple files:', error);
      throw new AppError('Failed to upload files', 500);
    }
  }

  async deleteFile(mediaId) {
    try {
      const media = await Media.findByPk(mediaId);
      
      if (!media) {
        throw new AppError('Media not found', 404);
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(media.cloudinary_id);

      // Delete from database
      await media.destroy();

      logger.info(\`File deleted: \${mediaId}\`);
      return { message: 'File deleted successfully' };
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw new AppError('Failed to delete file', 500);
    }
  }

  async getMediaById(mediaId) {
    const media = await Media.findByPk(mediaId);
    
    if (!media) {
      throw new AppError('Media not found', 404);
    }
    
    return media;
  }

  async getAllMedia(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Media.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      media: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = new UploadService();
`
  }
];

// Generate all service files
services.forEach(service => {
  const filePath = path.join(servicesDir, service.name);
  fs.writeFileSync(filePath, service.content);
  console.log(`✓ Created ${service.name}`);
});

console.log(`\n✓ Successfully generated ${services.length} additional service files!`);