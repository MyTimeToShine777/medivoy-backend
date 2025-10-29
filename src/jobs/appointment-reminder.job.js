const { Op } = require('sequelize');
const { notificationQueue } = require('./queue');
const { Appointment, User, Doctor } = require('../models');
const { addEmailJob } = require('./email.job');
const { addSMSJob } = require('./sms.job');
const logger = require('../utils/logger');

// Send appointment reminders
const sendAppointmentReminders = async () => {
  try {
    // Get appointments scheduled for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const appointments = await Appointment.findAll({
      where: {
        appointment_date: {
          [Op.between]: [tomorrow, endOfTomorrow],
        },
        status: {
          [Op.in]: ['confirmed', 'awaiting_consultation'],
        },
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'email', 'phone', 'first_name', 'last_name'],
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name'],
            },
          ],
        },
      ],
    });

    logger.info(`Found ${appointments.length} appointments for tomorrow`);

    for (const appointment of appointments) {
      try {
        const patientName = `${appointment.patient.first_name} ${appointment.patient.last_name}`;
        const doctorName = `${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}`;

        // Send email reminder
        await addEmailJob('appointment_reminder', {
          email: appointment.patient.email,
          appointment: {
            id: appointment.id,
            date: appointment.appointment_date,
            time: appointment.start_time,
            doctorName,
            patientName,
          },
        });

        // Send SMS reminder if phone number exists
        if (appointment.patient.phone) {
          await addSMSJob('appointment_reminder', {
            phone: appointment.patient.phone,
            doctorName,
            appointmentDate: appointment.appointment_date.toLocaleDateString(),
          });
        }

        // Send in-app notification
        await notificationQueue.add({
          type: 'in_app',
          data: {
            user_id: appointment.patient_id,
            title: 'Appointment Reminder',
            message: `You have an appointment with Dr. ${doctorName} tomorrow at ${appointment.start_time}`,
            type: 'appointment',
            channel: 'in_app',
            priority: 'high',
            data: {
              appointment_id: appointment.id,
            },
          },
        });

        logger.info('Appointment reminder sent', {
          appointmentId: appointment.id,
          patientId: appointment.patient_id,
        });
      } catch (error) {
        logger.error('Failed to send appointment reminder', {
          appointmentId: appointment.id,
          error: error.message,
        });
      }
    }

    return { success: true, remindersSent: appointments.length };
  } catch (error) {
    logger.error('Failed to send appointment reminders', { error: error.message });
    throw error;
  }
};

// Send appointment reminders for appointments in 1 hour
const sendImmediateReminders = async () => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const appointments = await Appointment.findAll({
      where: {
        appointment_date: {
          [Op.eq]: new Date(now.toDateString()),
        },
        start_time: {
          [Op.between]: [now.toTimeString().slice(0, 5), oneHourLater.toTimeString().slice(0, 5)],
        },
        status: {
          [Op.in]: ['confirmed', 'awaiting_consultation'],
        },
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'email', 'phone', 'first_name', 'last_name'],
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name'],
            },
          ],
        },
      ],
    });

    logger.info(`Found ${appointments.length} appointments in the next hour`);

    for (const appointment of appointments) {
      try {
        const doctorName = `${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}`;

        // Send SMS reminder
        if (appointment.patient.phone) {
          await addSMSJob('appointment_reminder', {
            phone: appointment.patient.phone,
            doctorName,
            appointmentDate: 'in 1 hour',
          });
        }

        // Send push notification
        await notificationQueue.add({
          type: 'push',
          data: {
            userId: appointment.patient_id,
            title: 'Appointment Starting Soon',
            message: `Your appointment with Dr. ${doctorName} starts in 1 hour`,
            data: {
              appointment_id: appointment.id,
            },
          },
        });

        logger.info('Immediate appointment reminder sent', {
          appointmentId: appointment.id,
          patientId: appointment.patient_id,
        });
      } catch (error) {
        logger.error('Failed to send immediate appointment reminder', {
          appointmentId: appointment.id,
          error: error.message,
        });
      }
    }

    return { success: true, remindersSent: appointments.length };
  } catch (error) {
    logger.error('Failed to send immediate appointment reminders', { error: error.message });
    throw error;
  }
};

// Schedule appointment reminder jobs
const scheduleAppointmentReminders = () => {
  const Queue = require('bull');
  const config = require('../config');

  const reminderQueue = new Queue('appointment-reminders', {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    },
  });

  // Send daily reminders at 9 AM
  reminderQueue.add(
    'daily-reminders',
    {},
    {
      repeat: {
        cron: '0 9 * * *', // 9 AM every day
      },
    },
  );

  // Check for immediate reminders every 30 minutes
  reminderQueue.add(
    'immediate-reminders',
    {},
    {
      repeat: {
        cron: '*/30 * * * *', // Every 30 minutes
      },
    },
  );

  // Process reminder jobs
  reminderQueue.process('daily-reminders', async (job) => await sendAppointmentReminders());

  reminderQueue.process('immediate-reminders', async (job) => await sendImmediateReminders());

  logger.info('Appointment reminder jobs scheduled');
};

module.exports = {
  sendAppointmentReminders,
  sendImmediateReminders,
  scheduleAppointmentReminders,
};
