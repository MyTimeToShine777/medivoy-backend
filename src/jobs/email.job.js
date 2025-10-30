const { emailQueue } = require("./queue");
const emailService = require("../services/email.service");
const logger = require("../utils/logger");

// Process email jobs
emailQueue.process(async (job) => {
  const { type, data } = job.data;

  try {
    logger.info("Processing email job", { type, jobId: job.id });

    switch (type) {
      case "welcome":
        await emailService.sendWelcomeEmail(data.email, data.name);
        break;

      case "verification":
        await emailService.sendVerificationEmail(data.email, data.token);
        break;

      case "password_reset":
        await emailService.sendPasswordResetEmail(data.email, data.token);
        break;

      case "booking_confirmation":
        await emailService.sendBookingConfirmation(data.email, data.booking);
        break;

      case "appointment_reminder":
        await emailService.sendAppointmentReminder(
          data.email,
          data.appointment,
        );
        break;

      case "payment_receipt":
        await emailService.sendPaymentReceipt(data.email, data.payment);
        break;

      case "invoice":
        await emailService.sendInvoice(data.email, data.invoice);
        break;

      case "prescription":
        await emailService.sendPrescription(data.email, data.prescription);
        break;

      case "lab_results":
        await emailService.sendLabResults(data.email, data.labTest);
        break;

      case "subscription_renewal":
        await emailService.sendSubscriptionRenewal(
          data.email,
          data.subscription,
        );
        break;

      case "support_ticket":
        await emailService.sendSupportTicketUpdate(data.email, data.ticket);
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    logger.info("Email job completed successfully", { type, jobId: job.id });
    return { success: true, type };
  } catch (error) {
    logger.error("Email job failed", {
      type,
      jobId: job.id,
      error: error.message,
    });
    throw error;
  }
});

// Add email job to queue
const addEmailJob = async (type, data, options = {}) => {
  try {
    const job = await emailQueue.add(
      { type, data },
      {
        priority: options.priority || 5,
        delay: options.delay || 0,
        ...options,
      },
    );

    logger.info("Email job added to queue", { type, jobId: job.id });
    return job;
  } catch (error) {
    logger.error("Failed to add email job to queue", {
      type,
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  addEmailJob,
};
