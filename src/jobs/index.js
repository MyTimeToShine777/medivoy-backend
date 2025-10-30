const logger = require("../utils/logger");

// Import all job modules
const { addEmailJob } = require("./email.job");
const { addSMSJob } = require("./sms.job");
const { addNotificationJob } = require("./notification.job");
const { addTranslationJob } = require("./translation.job");
const { addBackupJob, scheduleDailyBackup } = require("./backup.job");
const { addCleanupJob, scheduleDailyCleanup } = require("./cleanup.job");
const { addAnalyticsJob, scheduleAnalyticsJobs } = require("./analytics.job");
const { scheduleAppointmentReminders } = require("./appointment-reminder.job");
const { schedulePaymentReminders } = require("./payment-reminder.job");
const {
  scheduleSubscriptionRenewalJobs,
} = require("./subscription-renewal.job");

// Initialize all scheduled jobs
const initializeJobs = () => {
  try {
    logger.info("Initializing background jobs...");

    // Schedule recurring jobs
    scheduleDailyBackup();
    scheduleDailyCleanup();
    scheduleAnalyticsJobs();
    scheduleAppointmentReminders();
    schedulePaymentReminders();
    scheduleSubscriptionRenewalJobs();

    logger.info("All background jobs initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize background jobs", {
      error: error.message,
    });
    throw error;
  }
};

// Export job functions
module.exports = {
  // Job initialization
  initializeJobs,

  // Email jobs
  addEmailJob,

  // SMS jobs
  addSMSJob,

  // Notification jobs
  addNotificationJob,

  // Translation jobs
  addTranslationJob,

  // Backup jobs
  addBackupJob,

  // Cleanup jobs
  addCleanupJob,

  // Analytics jobs
  addAnalyticsJob,
};
