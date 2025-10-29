const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const config = require('../config');
const logger = require('../utils/logger');

// Configure SendGrid
sgMail.setApiKey(config.sendgrid.apiKey);

// Configure Nodemailer
const transporter = nodemailer.createTransporter({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

class EmailService {
  /**
   * Send email using SendGrid
   */
  async sendSendGridEmail(to, subject, html, text) {
    try {
      const msg = {
        to,
        from: config.sendgrid.fromEmail,
        subject,
        html,
        text,
      };
      
      await sgMail.send(msg);
      return true;
    } catch (error) {
      logger.error('SendGrid email error:', error);
      throw error;
    }
  }

  /**
   * Send email using Nodemailer
   */
  async sendNodemailerEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: config.email.from,
        to,
        subject,
        html,
        text,
      };
      
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      logger.error('Nodemailer email error:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email, firstName) {
    try {
      const subject = 'Welcome to Medivoy!';
      const html = `
        <h1>Welcome to Medivoy, ${firstName}!</h1>
        <p>Thank you for joining our healthcare platform.</p>
        <p>We're excited to help you manage your healthcare needs.</p>
      `;
      const text = `Welcome to Medivoy, ${firstName}!\n\nThank you for joining our healthcare platform.\n\nWe're excited to help you manage your healthcare needs.`;
      
      // Try SendGrid first, fallback to Nodemailer
      try {
        await this.sendSendGridEmail(email, subject, html, text);
      } catch (sendGridError) {
        logger.warn('SendGrid failed, falling back to Nodemailer:', sendGridError);
        await this.sendNodemailerEmail(email, subject, html, text);
      }
      
      return true;
    } catch (error) {
      logger.error('Welcome email error:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, resetToken) {
    try {
      const subject = 'Medivoy Password Reset';
      const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
      const html = `
        <h1>Password Reset Request</h1>
        <p>You have requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `;
      const text = `Password Reset Request\n\nYou have requested a password reset. Click the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.`;
      
      // Try SendGrid first, fallback to Nodemailer
      try {
        await this.sendSendGridEmail(email, subject, html, text);
      } catch (sendGridError) {
        logger.warn('SendGrid failed, falling back to Nodemailer:', sendGridError);
        await this.sendNodemailerEmail(email, subject, html, text);
      }
      
      return true;
    } catch (error) {
      logger.error('Password reset email error:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();