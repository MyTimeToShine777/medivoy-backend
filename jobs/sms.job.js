const { smsQueue } = require('./queue');
const logger = require('../utils/logger');
const config = require('../config');

// Mock SMS service (replace with actual Twilio implementation)
const sendSMS = async (phone, message) => {
  // TODO: Implement actual Twilio SMS sending
  logger.info('Sending SMS', { phone, message });

  // Simulated SMS sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: `sms_${Date.now()}` });
    }, 100);
  });
};

// Process SMS jobs
smsQueue.process(async (job) => {
  const { type, data } = job.data;

  try {
    logger.info('Processing SMS job', { type, jobId: job.id });

    let message = '';
    const { phone } = data;

    switch (type) {
      case 'otp':
        message = `Your OTP is: ${data.otp}. Valid for 10 minutes.`;
        break;

      case 'booking_confirmation':
        message = `Your booking #${data.bookingNumber} has been confirmed. Check your email for details.`;
        break;

      case 'appointment_reminder':
        message = `Reminder: You have an appointment with Dr. ${data.doctorName} on ${data.appointmentDate}.`;
        break;

      case 'payment_confirmation':
        message = `Payment of ${data.amount} ${data.currency} received successfully. Transaction ID: ${data.transactionId}`;
        break;

      case 'prescription_ready':
        message = 'Your prescription is ready. Please check your email or app for details.';
        break;

      case 'lab_results_ready':
        message = 'Your lab test results are ready. Please login to view them.';
        break;

      case 'status_update':
        message = data.message;
        break;

      default:
        throw new Error(`Unknown SMS type: ${type}`);
    }

    const result = await sendSMS(phone, message);

    logger.info('SMS job completed successfully', { type, jobId: job.id, result });
    return { success: true, type, result };
  } catch (error) {
    logger.error('SMS job failed', { type, jobId: job.id, error: error.message });
    throw error;
  }
});

// Add SMS job to queue
const addSMSJob = async (type, data, options = {}) => {
  try {
    const job = await smsQueue.add(
      { type, data },
      {
        priority: options.priority || 5,
        delay: options.delay || 0,
        ...options,
      },
    );

    logger.info('SMS job added to queue', { type, jobId: job.id });
    return job;
  } catch (error) {
    logger.error('Failed to add SMS job to queue', { type, error: error.message });
    throw error;
  }
};

module.exports = {
  addSMSJob,
};
