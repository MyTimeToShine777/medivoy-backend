const nodemailer = require('nodemailer');
const sendgrid = require('@sendgrid/mail');
const config = require('../config');
const logger = require('../utils/logger');

// Set SendGrid API key
if (config.sendgrid.apiKey && config.sendgrid.apiKey.startsWith('SG.')) {
  sendgrid.setApiKey(config.sendgrid.apiKey);
}

// nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
  host: config.email.host || process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: config.email.port || process.env.EMAIL_PORT || 587,
  secure: config.email.secure || process.env.EMAIL_SECURE === 'true',
  auth: {
    user: config.email.user || process.env.EMAIL_USER,
    pass: config.email.pass || process.env.EMAIL_PASS,
  },
});

/**
 * Email Service
 * Handles sending emails using SendGrid and Nodemailer
 */
class EmailService {
  constructor() {
    // Initialize SendGrid if API key is provided
    if (config.sendgrid.apiKey && config.sendgrid.apiKey.startsWith('SG.')) {
      this.sendgridEnabled = true;
    } else {
      this.sendgridEnabled = false;
      logger.warn('SendGrid API key is missing or invalid. SendGrid emails will be disabled.');
    }

    // Initialize Nodemailer with SMTP configuration
    if (config.email.host && config.email.port) {
      this.transporter = transporter;
      this.smtpEnabled = true;
    } else {
      this.smtpEnabled = false;
      logger.warn('SMTP configuration is missing. SMTP emails will be disabled.');
    }
  }

  /**
   * Send email using SendGrid
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   * @param {string} [options.from] - Sender email (optional)
   * @returns {Promise<Object>} - SendGrid response
   */
  async sendSendGridEmail({ to, subject, text, html, from }) {
    if (!this.sendgridEnabled) {
      throw new Error('SendGrid is not configured');
    }

    const msg = {
      to,
      from: from || config.sendgrid.fromEmail || config.email.from,
      subject,
      text,
      html,
    };

    try {
      const response = await sendgrid.send(msg);
      logger.info(`Email sent via SendGrid to ${to}`);
      return response;
    } catch (error) {
      logger.error(`SendGrid email error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send email using SMTP (Nodemailer)
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   * @param {string} [options.from] - Sender email (optional)
   * @returns {Promise<Object>} - Nodemailer response
   */
  async sendSMTPEmail({ to, subject, text, html, from }) {
    if (!this.smtpEnabled) {
      throw new Error('SMTP is not configured');
    }

    const mailOptions = {
      from: from || config.email.from,
      to,
      subject,
      text,
      html,
    };

    try {
      const response = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent via SMTP to ${to}`);
      return response;
    } catch (error) {
      logger.error(`SMTP email error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send email - tries SendGrid first, then SMTP as fallback
   * @param {Object} options - Email options
   * @returns {Promise<Object>} - Email service response
   */
  async sendEmail(options) {
    // Try SendGrid first
    if (this.sendgridEnabled) {
      try {
        return await this.sendSendGridEmail(options);
      } catch (error) {
        logger.warn(`SendGrid failed, trying SMTP: ${error.message}`);

        // If SendGrid fails, try SMTP
        if (this.smtpEnabled) {
          return await this.sendSMTPEmail(options);
        }

        throw error;
      }
    }

    // If SendGrid is not enabled, use SMTP
    if (this.smtpEnabled) {
      return await this.sendSMTPEmail(options);
    }

    throw new Error('No email service is configured');
  }

  /**
   * Send verification email
   * @param {string} to - Recipient email
   * @param {string} token - Verification token
   * @param {string} [firstName] - User's first name
   * @returns {Promise<Object>} - Email service response
   */
  async sendVerificationEmail(to, token, firstName = '') {
    const verificationUrl = `${config.app.frontendUrl || 'http://localhost:3000'}/verify-email?token=${token}`;
    const subject = 'Verify Your Email Address';

    const text = `Hello ${firstName},\n\nPlease verify your email address by clicking the link below:\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nThank you,\n${config.app.name}`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Hello ${firstName},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
        <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        <p style="margin-top: 20px;">Thank you,<br>${config.app.name}</p>
      </div>
    `;

    return this.sendEmail({ to, subject, text, html });
  }

  /**
   * Send password reset email
   * @param {string} to - Recipient email
   * @param {string} token - Reset token
   * @param {string} [firstName] - User's first name
   * @returns {Promise<Object>} - Email service response
   */
  async sendPasswordResetEmail(to, token, firstName = '') {
    const resetUrl = `${config.app.frontendUrl || 'http://localhost:3000'}/reset-password?token=${token}`;
    const subject = 'Reset Your Password';

    const text = `Hello ${firstName},\n\nYou requested a password reset. Please click the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nThank you,\n${config.app.name}`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${firstName},</p>
        <p>You requested a password reset. Please click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
        <p style="margin-top: 20px;">Thank you,<br>${config.app.name}</p>
      </div>
    `;

    return this.sendEmail({ to, subject, text, html });
  }

  /**
   * Send welcome email
   * @param {string} to - Recipient email
   * @param {string} [firstName] - User's first name
   * @returns {Promise<Object>} - Email service response
   */
  async sendWelcomeEmail(to, firstName = '') {
    const subject = `Welcome to ${config.app.name}!`;

    const text = `Hello ${firstName},\n\nWelcome to ${config.app.name}! We're excited to have you on board.\n\nYour account has been successfully created. You can now:\n\n• Book appointments with doctors\n• Access medical records\n• Manage prescriptions\n• And much more!\n\nIf you have any questions, feel free to contact our support team.\n\nThank you for choosing ${config.app.name}!\n\nBest regards,\nThe ${config.app.name} Team`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Welcome to ${config.app.name}!</h2>
        <p>Hello ${firstName},</p>
        <p>Welcome to <strong>${config.app.name}</strong>! We're excited to have you on board.</p>
        <p>Your account has been successfully created. You can now:</p>
        <ul style="color: #555; line-height: 1.6;">
          <li>Book appointments with doctors</li>
          <li>Access medical records</li>
          <li>Manage prescriptions</li>
          <li>And much more!</li>
        </ul>
        <a href="${config.app.frontendUrl || 'http://localhost:3000'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">Go to Dashboard</a>
        <p style="margin-top: 30px;">If you have any questions, feel free to contact our support team.</p>
        <p style="margin-top: 20px;">Thank you for choosing ${config.app.name}!</p>
        <p style="margin-top: 20px;">Best regards,<br>The ${config.app.name} Team</p>
      </div>
    `;

    return this.sendEmail({ to, subject, text, html });
  }

  /**
   * Send appointment confirmation email
   * @param {string} to - Recipient email
   * @param {Object} appointment - Appointment details
   * @param {string} [firstName] - User's first name
   * @returns {Promise<Object>} - Email service response
   */
  async sendAppointmentConfirmationEmail(to, appointment, firstName = '') {
    const subject = 'Appointment Confirmation';
    const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
    const appointmentTime = appointment.appointment_time;

    const text = `Hello ${firstName},\n\nYour appointment has been confirmed.\n\nAppointment Details:\nDate: ${appointmentDate}\nTime: ${appointmentTime}\nDoctor: ${appointment.doctor_name}\nLocation: ${appointment.location || 'Online'}\n\nPlease arrive 10 minutes early for your appointment.\n\nIf you need to reschedule or cancel, please do so at least 24 hours in advance.\n\nThank you,\n${config.app.name}`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #28a745;">Appointment Confirmed!</h2>
        <p>Hello ${firstName},</p>
        <p>Your appointment has been confirmed.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Appointment Details:</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
          <p style="margin: 5px 0;"><strong>Doctor:</strong> ${appointment.doctor_name}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${appointment.location || 'Online'}</p>
        </div>
        <p style="color: #666;">Please arrive 10 minutes early for your appointment.</p>
        <p style="color: #666;">If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
        <p style="margin-top: 20px;">Thank you,<br>${config.app.name}</p>
      </div>
    `;

    return this.sendEmail({ to, subject, text, html });
  }

  /**
   * Send appointment reminder email
   * @param {string} to - Recipient email
   * @param {Object} appointment - Appointment details
   * @param {string} [firstName] - User's first name
   * @returns {Promise<Object>} - Email service response
   */
  async sendAppointmentReminderEmail(to, appointment, firstName = '') {
    const subject = 'Appointment Reminder';
    const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
    const appointmentTime = appointment.appointment_time;

    const text = `Hello ${firstName},\n\nThis is a reminder about your upcoming appointment.\n\nAppointment Details:\nDate: ${appointmentDate}\nTime: ${appointmentTime}\nDoctor: ${appointment.doctor_name}\nLocation: ${appointment.location || 'Online'}\n\nPlease arrive 10 minutes early for your appointment.\n\nIf you need to reschedule or cancel, please do so at least 24 hours in advance.\n\nThank you,\n${config.app.name}`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #ffc107;">Appointment Reminder</h2>
        <p>Hello ${firstName},</p>
        <p>This is a reminder about your upcoming appointment.</p>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="margin-top: 0; color: #333;">Appointment Details:</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
          <p style="margin: 5px 0;"><strong>Doctor:</strong> ${appointment.doctor_name}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${appointment.location || 'Online'}</p>
        </div>
        <p style="color: #666;">Please arrive 10 minutes early for your appointment.</p>
        <p style="color: #666;">If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
        <p style="margin-top: 20px;">Thank you,<br>${config.app.name}</p>
      </div>
    `;

    return this.sendEmail({ to, subject, text, html });
  }

  /**
   * Send booking confirmation email
   * @param {string} to - Recipient email
   * @param {Object} booking - Booking details
   * @param {string} [firstName] - User's first name
   * @returns {Promise<Object>} - Email service response
   */
  async sendBookingConfirmationEmail(to, booking, firstName = '') {
    const subject = 'Booking Confirmation';
    
    const text = `Hello ${firstName},\n\nYour booking has been confirmed.\n\nBooking Details:\nBooking Number: ${booking.booking_number}\nTreatment: ${booking.treatment_name}\nHospital: ${booking.hospital_name}\nTotal Amount: $${booking.total_amount}\n\nThank you for choosing ${config.app.name}.\n\nBest regards,\nThe ${config.app.name} Team`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #28a745;">Booking Confirmed!</h2>
        <p>Hello ${firstName},</p>
        <p>Your booking has been confirmed.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
          <p style="margin: 5px 0;"><strong>Booking Number:</strong> ${booking.booking_number}</p>
          <p style="margin: 5px 0;"><strong>Treatment:</strong> ${booking.treatment_name}</p>
          <p style="margin: 5px 0;"><strong>Hospital:</strong> ${booking.hospital_name}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${booking.total_amount}</p>
        </div>
        <p style="margin-top: 20px;">Thank you for choosing ${config.app.name}!</p>
        <p style="margin-top: 20px;">Best regards,<br>The ${config.app.name} Team</p>
      </div>
    `;

    return this.sendEmail({ to, subject, text, html });
  }

  /**
   * Send payment confirmation email
   * @param {string} to - Recipient email
   * @param {Object} payment - Payment details
   * @param {string} [firstName] - User's first name
   * @returns {Promise<Object>} - Email service response
   */
  async sendPaymentConfirmationEmail(to, payment, firstName = '') {
    const subject = 'Payment Confirmation';
    
    const text = `Hello ${firstName},\n\nYour payment has been processed successfully.\n\nPayment Details:\nPayment ID: ${payment.payment_id}\nAmount: $${payment.amount}\nStatus: ${payment.status}\nPayment Method: ${payment.payment_method}\n\nThank you for your payment.\n\nBest regards,\nThe ${config.app.name} Team`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #28a745;">Payment Confirmed!</h2>
        <p>Hello ${firstName},</p>
        <p>Your payment has been processed successfully.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Payment Details:</h3>
          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${payment.payment_id}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${payment.amount}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${payment.status}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${payment.payment_method}</p>
        </div>
        <p style="margin-top: 20px;">Thank you for your payment!</p>
        <p style="margin-top: 20px;">Best regards,<br>The ${config.app.name} Team</p>
      </div>
    `;

    return this.sendEmail({ to, subject, text, html });
  }
}

module.exports = new EmailService();