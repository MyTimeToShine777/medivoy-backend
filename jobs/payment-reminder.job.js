const { Op } = require('sequelize');
const { notificationQueue } = require('./queue');
const { Booking, Payment, User } = require('../models');
const { addEmailJob } = require('./email.job');
const { addSMSJob } = require('./sms.job');
const logger = require('../utils/logger');

// Send payment reminders for pending bookings
const sendPaymentReminders = async () => {
  try {
    // Get bookings with pending payments (older than 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await Booking.findAll({
      where: {
        status: {
          [Op.in]: ['confirmed', 'quotation_sent'],
        },
        created_at: {
          [Op.lt]: yesterday,
        },
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'email', 'phone', 'first_name', 'last_name'],
        },
        {
          model: Payment,
          as: 'payments',
          where: {
            status: {
              [Op.in]: ['pending', 'failed'],
            },
          },
          required: false,
        },
      ],
    });

    logger.info(`Found ${bookings.length} bookings with pending payments`);

    for (const booking of bookings) {
      try {
        const patientName = `${booking.patient.first_name} ${booking.patient.last_name}`;

        // Send email reminder
        await addEmailJob('payment_reminder', {
          email: booking.patient.email,
          booking: {
            id: booking.id,
            booking_number: booking.booking_number,
            amount: booking.total_cost,
            currency: booking.currency,
            patientName,
          },
        });

        // Send SMS reminder if phone number exists
        if (booking.patient.phone) {
          await addSMSJob('payment_reminder', {
            phone: booking.patient.phone,
            bookingNumber: booking.booking_number,
            amount: booking.total_cost,
            currency: booking.currency,
          });
        }

        // Send in-app notification
        await notificationQueue.add({
          type: 'in_app',
          data: {
            user_id: booking.patient_id,
            title: 'Payment Reminder',
            message: `Your payment for booking #${booking.booking_number} is pending. Please complete the payment to proceed.`,
            type: 'payment',
            channel: 'in_app',
            priority: 'high',
            data: {
              booking_id: booking.id,
              amount: booking.total_cost,
              currency: booking.currency,
            },
            action_url: `/bookings/${booking.id}/payment`,
          },
        });

        logger.info('Payment reminder sent', {
          bookingId: booking.id,
          patientId: booking.patient_id,
        });
      } catch (error) {
        logger.error('Failed to send payment reminder', {
          bookingId: booking.id,
          error: error.message,
        });
      }
    }

    return { success: true, remindersSent: bookings.length };
  } catch (error) {
    logger.error('Failed to send payment reminders', { error: error.message });
    throw error;
  }
};

// Send overdue payment notifications
const sendOverduePaymentNotifications = async () => {
  try {
    // Get bookings with overdue payments (older than 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const bookings = await Booking.findAll({
      where: {
        status: {
          [Op.in]: ['confirmed', 'quotation_sent'],
        },
        created_at: {
          [Op.lt]: weekAgo,
        },
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'email', 'phone', 'first_name', 'last_name'],
        },
        {
          model: Payment,
          as: 'payments',
          where: {
            status: {
              [Op.in]: ['pending', 'failed'],
            },
          },
          required: false,
        },
      ],
    });

    logger.info(`Found ${bookings.length} bookings with overdue payments`);

    for (const booking of bookings) {
      try {
        const patientName = `${booking.patient.first_name} ${booking.patient.last_name}`;

        // Send urgent email
        await addEmailJob('payment_overdue', {
          email: booking.patient.email,
          booking: {
            id: booking.id,
            booking_number: booking.booking_number,
            amount: booking.total_cost,
            currency: booking.currency,
            patientName,
            daysOverdue: Math.floor((new Date() - booking.created_at) / (1000 * 60 * 60 * 24)),
          },
        });

        // Send urgent notification
        await notificationQueue.add({
          type: 'in_app',
          data: {
            user_id: booking.patient_id,
            title: 'Urgent: Payment Overdue',
            message: `Your payment for booking #${booking.booking_number} is overdue. Please complete the payment immediately to avoid cancellation.`,
            type: 'payment',
            channel: 'in_app',
            priority: 'urgent',
            data: {
              booking_id: booking.id,
              amount: booking.total_cost,
              currency: booking.currency,
            },
            action_url: `/bookings/${booking.id}/payment`,
          },
        });

        logger.info('Overdue payment notification sent', {
          bookingId: booking.id,
          patientId: booking.patient_id,
        });
      } catch (error) {
        logger.error('Failed to send overdue payment notification', {
          bookingId: booking.id,
          error: error.message,
        });
      }
    }

    return { success: true, notificationsSent: bookings.length };
  } catch (error) {
    logger.error('Failed to send overdue payment notifications', { error: error.message });
    throw error;
  }
};

// Schedule payment reminder jobs
const schedulePaymentReminders = () => {
  const Queue = require('bull');
  const config = require('../config');

  const paymentReminderQueue = new Queue('payment-reminders', {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    },
  });

  // Send payment reminders daily at 10 AM
  paymentReminderQueue.add(
    'daily-reminders',
    {},
    {
      repeat: {
        cron: '0 10 * * *', // 10 AM every day
      },
    },
  );

  // Check for overdue payments daily at 11 AM
  paymentReminderQueue.add(
    'overdue-notifications',
    {},
    {
      repeat: {
        cron: '0 11 * * *', // 11 AM every day
      },
    },
  );

  // Process reminder jobs
  paymentReminderQueue.process('daily-reminders', async (job) => await sendPaymentReminders());

  paymentReminderQueue.process('overdue-notifications', async (job) => await sendOverduePaymentNotifications());

  logger.info('Payment reminder jobs scheduled');
};

module.exports = {
  sendPaymentReminders,
  sendOverduePaymentNotifications,
  schedulePaymentReminders,
};
