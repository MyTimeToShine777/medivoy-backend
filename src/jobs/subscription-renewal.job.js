const { Op } = require("sequelize");
const { notificationQueue } = require("./queue");
const { Subscription, SubscriptionPlan, User } = require("../models");
const { addEmailJob } = require("./email.job");
const logger = require("../utils/logger");

// Process subscription renewals
const processSubscriptionRenewals = async () => {
  try {
    // Get subscriptions expiring today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const expiringSubscriptions = await Subscription.findAll({
      where: {
        end_date: {
          [Op.between]: [today, endOfDay],
        },
        status: "active",
        auto_renew: true,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "first_name", "last_name"],
        },
        {
          model: SubscriptionPlan,
          as: "plan",
          attributes: ["id", "name", "price", "plan_type"],
        },
      ],
    });

    logger.info(`Found ${expiringSubscriptions.length} subscriptions to renew`);

    for (const subscription of expiringSubscriptions) {
      try {
        // Calculate new end date based on plan type
        const newStartDate = new Date(subscription.end_date);
        const newEndDate = new Date(newStartDate);

        switch (subscription.plan.plan_type) {
          case "monthly":
            newEndDate.setMonth(newEndDate.getMonth() + 1);
            break;
          case "quarterly":
            newEndDate.setMonth(newEndDate.getMonth() + 3);
            break;
          case "yearly":
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            break;
        }

        // Update subscription
        await subscription.update({
          start_date: newStartDate,
          end_date: newEndDate,
          renewed_at: new Date(),
        });

        // Send renewal confirmation email
        await addEmailJob("subscription_renewal", {
          email: subscription.user.email,
          subscription: {
            id: subscription.id,
            planName: subscription.plan.name,
            amount: subscription.plan.price,
            startDate: newStartDate,
            endDate: newEndDate,
            userName: `${subscription.user.first_name} ${subscription.user.last_name}`,
          },
        });

        // Send in-app notification
        await notificationQueue.add({
          type: "in_app",
          data: {
            user_id: subscription.user_id,
            title: "Subscription Renewed",
            message: `Your ${subscription.plan.name} subscription has been renewed successfully.`,
            type: "subscription",
            channel: "in_app",
            priority: "medium",
            data: {
              subscription_id: subscription.id,
              plan_name: subscription.plan.name,
              end_date: newEndDate,
            },
          },
        });

        logger.info("Subscription renewed", {
          subscriptionId: subscription.id,
          userId: subscription.user_id,
        });
      } catch (error) {
        logger.error("Failed to renew subscription", {
          subscriptionId: subscription.id,
          error: error.message,
        });

        // Send renewal failure notification
        await addEmailJob("subscription_renewal_failed", {
          email: subscription.user.email,
          subscription: {
            id: subscription.id,
            planName: subscription.plan.name,
            userName: `${subscription.user.first_name} ${subscription.user.last_name}`,
          },
        });
      }
    }

    return { success: true, renewalsProcessed: expiringSubscriptions.length };
  } catch (error) {
    logger.error("Failed to process subscription renewals", {
      error: error.message,
    });
    throw error;
  }
};

// Send renewal reminders
const sendRenewalReminders = async () => {
  try {
    // Get subscriptions expiring in 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.setHours(0, 0, 0, 0);
    const endOfDay = new Date(sevenDaysFromNow);
    endOfDay.setHours(23, 59, 59, 999);

    const expiringSubscriptions = await Subscription.findAll({
      where: {
        end_date: {
          [Op.between]: [sevenDaysFromNow, endOfDay],
        },
        status: "active",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "first_name", "last_name"],
        },
        {
          model: SubscriptionPlan,
          as: "plan",
          attributes: ["id", "name", "price", "plan_type"],
        },
      ],
    });

    logger.info(
      `Found ${expiringSubscriptions.length} subscriptions expiring in 7 days`,
    );

    for (const subscription of expiringSubscriptions) {
      try {
        // Send reminder email
        await addEmailJob("subscription_expiring_soon", {
          email: subscription.user.email,
          subscription: {
            id: subscription.id,
            planName: subscription.plan.name,
            endDate: subscription.end_date,
            autoRenew: subscription.auto_renew,
            userName: `${subscription.user.first_name} ${subscription.user.last_name}`,
          },
        });

        // Send in-app notification
        await notificationQueue.add({
          type: "in_app",
          data: {
            user_id: subscription.user_id,
            title: "Subscription Expiring Soon",
            message: `Your ${subscription.plan.name} subscription will expire in 7 days. ${subscription.auto_renew ? "It will be automatically renewed." : "Please renew to continue enjoying the benefits."}`,
            type: "subscription",
            channel: "in_app",
            priority: "medium",
            data: {
              subscription_id: subscription.id,
              plan_name: subscription.plan.name,
              end_date: subscription.end_date,
              auto_renew: subscription.auto_renew,
            },
            action_url: `/subscriptions/${subscription.id}`,
          },
        });

        logger.info("Renewal reminder sent", {
          subscriptionId: subscription.id,
          userId: subscription.user_id,
        });
      } catch (error) {
        logger.error("Failed to send renewal reminder", {
          subscriptionId: subscription.id,
          error: error.message,
        });
      }
    }

    return { success: true, remindersSent: expiringSubscriptions.length };
  } catch (error) {
    logger.error("Failed to send renewal reminders", { error: error.message });
    throw error;
  }
};

// Handle expired subscriptions
const handleExpiredSubscriptions = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredSubscriptions = await Subscription.findAll({
      where: {
        end_date: {
          [Op.lt]: today,
        },
        status: "active",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "first_name", "last_name"],
        },
        {
          model: SubscriptionPlan,
          as: "plan",
          attributes: ["id", "name"],
        },
      ],
    });

    logger.info(`Found ${expiredSubscriptions.length} expired subscriptions`);

    for (const subscription of expiredSubscriptions) {
      try {
        // Update subscription status
        await subscription.update({
          status: "expired",
        });

        // Send expiration notification
        await addEmailJob("subscription_expired", {
          email: subscription.user.email,
          subscription: {
            id: subscription.id,
            planName: subscription.plan.name,
            userName: `${subscription.user.first_name} ${subscription.user.last_name}`,
          },
        });

        // Send in-app notification
        await notificationQueue.add({
          type: "in_app",
          data: {
            user_id: subscription.user_id,
            title: "Subscription Expired",
            message: `Your ${subscription.plan.name} subscription has expired. Renew now to continue enjoying the benefits.`,
            type: "subscription",
            channel: "in_app",
            priority: "high",
            data: {
              subscription_id: subscription.id,
              plan_name: subscription.plan.name,
            },
            action_url: "/subscriptions/plans",
          },
        });

        logger.info("Expired subscription handled", {
          subscriptionId: subscription.id,
          userId: subscription.user_id,
        });
      } catch (error) {
        logger.error("Failed to handle expired subscription", {
          subscriptionId: subscription.id,
          error: error.message,
        });
      }
    }

    return { success: true, expiredHandled: expiredSubscriptions.length };
  } catch (error) {
    logger.error("Failed to handle expired subscriptions", {
      error: error.message,
    });
    throw error;
  }
};

// Schedule subscription renewal jobs
const scheduleSubscriptionRenewalJobs = () => {
  const Queue = require("bull");
  const config = require("../config");

  const renewalQueue = new Queue("subscription-renewals", {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    },
  });

  // Process renewals daily at midnight
  renewalQueue.add(
    "process-renewals",
    {},
    {
      repeat: {
        cron: "0 0 * * *", // Midnight every day
      },
    },
  );

  // Send renewal reminders daily at 9 AM
  renewalQueue.add(
    "renewal-reminders",
    {},
    {
      repeat: {
        cron: "0 9 * * *", // 9 AM every day
      },
    },
  );

  // Handle expired subscriptions daily at 1 AM
  renewalQueue.add(
    "handle-expired",
    {},
    {
      repeat: {
        cron: "0 1 * * *", // 1 AM every day
      },
    },
  );

  // Process renewal jobs
  renewalQueue.process(
    "process-renewals",
    async (job) => await processSubscriptionRenewals(),
  );

  renewalQueue.process(
    "renewal-reminders",
    async (job) => await sendRenewalReminders(),
  );

  renewalQueue.process(
    "handle-expired",
    async (job) => await handleExpiredSubscriptions(),
  );

  logger.info("Subscription renewal jobs scheduled");
};

module.exports = {
  processSubscriptionRenewals,
  sendRenewalReminders,
  handleExpiredSubscriptions,
  scheduleSubscriptionRenewalJobs,
};
