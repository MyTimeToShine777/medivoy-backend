const nodemailer = require('nodemailer');
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
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Medivoy';
    const html = `
      <h1>Welcome to Medivoy, ${user.first_name}!</h1>
      <p>Thank you for registering with us.</p>
      <p>We're excited to have you on board.</p>
    `;
    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.app.frontendUrl}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <h1>Password Reset</h1>
      <p>Hi ${user.first_name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    return this.sendEmail(user.email, subject, html);
  }

  async sendBookingConfirmation(booking) {
    const subject = 'Booking Confirmation';
    const html = `
      <h1>Booking Confirmed</h1>
      <p>Your booking #${booking.booking_number} has been confirmed.</p>
      <p>Treatment: ${booking.treatment_name}</p>
      <p>Hospital: ${booking.hospital_name}</p>
      <p>Date: ${booking.preferred_date}</p>
    `;
    return this.sendEmail(booking.patient_email, subject, html);
  }

  async sendAppointmentReminder(appointment) {
    const subject = 'Appointment Reminder';
    const html = `
      <h1>Appointment Reminder</h1>
      <p>This is a reminder for your upcoming appointment.</p>
      <p>Date: ${appointment.appointment_date}</p>
      <p>Time: ${appointment.appointment_time}</p>
      <p>Doctor: Dr. ${appointment.doctor_name}</p>
    `;
    return this.sendEmail(appointment.patient_email, subject, html);
  }

  async sendInvoice(invoice, pdfBuffer) {
    const subject = `Invoice #${invoice.invoice_number}`;
    const html = `
      <h1>Invoice</h1>
      <p>Please find your invoice attached.</p>
      <p>Amount: ${invoice.total_amount}</p>
      <p>Due Date: ${invoice.due_date}</p>
    `;
    const attachments = [{
      filename: `invoice-${invoice.invoice_number}.pdf`,
      content: pdfBuffer
    }];
    return this.sendEmail(invoice.patient_email, subject, html, attachments);
  }
}

module.exports = new EmailService();
