const { notificationQueue } = require("./queue");
const notificationService = require("../services/notification.service");
const logger = require("../utils/logger");

// Process notification jobs
notificationQueue.process(async (job) => {
  const { type, data } = job.data;

  try {
    logger.info("Processing notification job", { type, jobId: job.id });

    switch (type) {
      case "push":
        await sendPushNotification(data);
        break;

      case "in_app":
        await notificationService.create(data);
        break;

      case "bulk":
        await sendBulkNotifications(data);
        break;

      case "scheduled":
        await sendScheduledNotification(data);
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    logger.info("Notification job completed successfully", {
      type,
      jobId: job.id,
    });
    return { success: true, type };
  } catch (error) {
    logger.error("Notification job failed", {
      type,
      jobId: job.id,
      error: error.message,
    });
    throw error;
  }
});

// Send push notification (Firebase Cloud Messaging)
const sendPushNotification = async (data) => {
  // TODO: Implement actual Firebase push notification
  logger.info("Sending push notification", data);

  const { userId, title, message, data: notificationData } = data;

  // Simulated push notification
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: `push_${Date.now()}` });
    }, 100);
  });
};

// Send bulk notifications
const sendBulkNotifications = async (data) => {
  const { userIds, title, message, type, channel } = data;

  const promises = userIds.map((userId) =>
    notificationService.create({
      user_id: userId,
      title,
      message,
      type,
      channel,
    }),
  );

  return Promise.all(promises);
};

// Send scheduled notification
const sendScheduledNotification = async (data) => {
  const { userId, title, message, type, channel, scheduledAt } = data;

  const delay = new Date(scheduledAt) - new Date();

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return notificationService.create({
    user_id: userId,
    title,
    message,
    type,
    channel,
  });
};

// Add notification job to queue
const addNotificationJob = async (type, data, options = {}) => {
  try {
    const job = await notificationQueue.add(
      { type, data },
      {
        priority: options.priority || 5,
        delay: options.delay || 0,
        ...options,
      },
    );

    logger.info("Notification job added to queue", { type, jobId: job.id });
    return job;
  } catch (error) {
    logger.error("Failed to add notification job to queue", {
      type,
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  addNotificationJob,
};
