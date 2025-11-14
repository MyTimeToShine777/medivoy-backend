// Notification Service - Notification management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

class NotificationService {
    constructor() {
        // Email configuration
        this.emailTransporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // SMS configuration (only initialize if credentials are provided)
        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioToken = process.env.TWILIO_AUTH_TOKEN;

        if (twilioSid && twilioToken && twilioSid.startsWith('AC')) {
            this.twilioClient = twilio(twilioSid, twilioToken);
        } else {
            this.twilioClient = null;
            console.warn('Twilio not configured - SMS notifications will be disabled');
        }
    }

    // ========== CREATE NOTIFICATION ==========
    async createNotification(notificationData) {
        try {
            const notification = await prisma.notifications.create({
                data: {
                    ...notificationData,
                    status: 'pending',
                    isRead: false,
                }
            });

            return {
                success: true,
                data: notification,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== SEND EMAIL ==========
    async sendEmail(to, subject, template, data = {}) {
        try {
            const htmlContent = this.renderEmailTemplate(template, data);

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to,
                subject,
                html: htmlContent,
            };

            const info = await this.emailTransporter.sendMail(mailOptions);

            await this.createNotification({
                userId: data.userId,
                type: 'email',
                channel: 'email',
                recipient: to,
                subject,
                status: 'sent',
                sentAt: new Date(),
            });

            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            console.error('Email sending failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== SEND SMS ==========
    async sendSMS(phoneNumber, message, userId = null) {
        try {
            const response = await this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });

            if (userId) {
                await this.createNotification({
                    userId,
                    type: 'sms',
                    channel: 'sms',
                    recipient: phoneNumber,
                    message,
                    status: 'sent',
                    sentAt: new Date(),
                });
            }

            return {
                success: true,
                messageId: response.sid,
            };
        } catch (error) {
            console.error('SMS sending failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== SEND PUSH NOTIFICATION ==========
    async sendPushNotification(userId, title, message, data = {}) {
        try {
            const user = await User.findByPk(userId);
            if (!user || !user.deviceTokens || user.deviceTokens.length === 0) {
                return {
                    success: false,
                    error: 'No device tokens found',
                };
            }

            // Implementation for push notification
            await this.createNotification({
                userId,
                type: 'push',
                channel: 'push_notification',
                title,
                message,
                data,
                status: 'sent',
                sentAt: new Date(),
            });

            return {
                success: true,
                message: 'Push notification sent',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== BOOKING NOTIFICATIONS ==========
    async sendBookingConfirmationEmail(userId, bookingDetails) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }

            const emailData = {
                ...bookingDetails,
                userId,
                userName: `${user.firstName} ${user.lastName}`,
            };

            return await this.sendEmail(
                user.email,
                'Booking Confirmation',
                'booking_confirmation',
                emailData
            );
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async sendBookingReminderEmail(userId, bookingDetails) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }

            return await this.sendEmail(
                user.email,
                'Booking Reminder',
                'booking_reminder', {...bookingDetails, userId }
            );
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== APPOINTMENT NOTIFICATIONS ==========
    async sendAppointmentConfirmationEmail(userId, appointmentDetails) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }

            return await this.sendEmail(
                user.email,
                'Appointment Confirmed',
                'appointment_confirmation', {...appointmentDetails, userId }
            );
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async sendAppointmentReminderSMS(phoneNumber, appointmentDetails) {
        const message = `Reminder: Your appointment is on ${appointmentDetails.date} at ${appointmentDetails.time}. Please be on time.`;
        return await this.sendSMS(phoneNumber, message);
    }

    // ========== PAYMENT NOTIFICATIONS ==========
    async sendPaymentSuccessEmail(userId, paymentDetails) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }

            return await this.sendEmail(
                user.email,
                'Payment Successful',
                'payment_success', {...paymentDetails, userId }
            );
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET USER NOTIFICATIONS ==========
    async getUserNotifications(userId, filters = {}) {
        try {
            const where = { userId };

            if (filters.type) {
                where.type = filters.type;
            }
            if (filters.isRead !== undefined) {
                where.isRead = filters.isRead;
            }

            const notifications = await Notification.findAll({
                where,
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            const total = await Notification.count({ where });

            return {
                success: true,
                data: notifications,
                total,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== MARK AS READ ==========
    async markAsRead(notificationId) {
        try {
            const notification = await prisma.notifications.findUnique({ where: { notificationId: notificationId } });
            if (!notification) {
                return {
                    success: false,
                    error: 'Notification not found',
                };
            }

            notification.isRead = true;
            notification.readAt = new Date();
            await notification.save();

            return {
                success: true,
                data: notification,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== HELPER METHODS ==========
    renderEmailTemplate(template, data) {
        const templates = {
            booking_confirmation: `
                <h2>Booking Confirmation</h2>
                <p>Dear ${data.userName},</p>
                <p>Your booking has been confirmed!</p>
                <p>Booking Number: ${data.bookingNumber}</p>
                <p>Treatment: ${data.treatment}</p>
                <p>Hospital: ${data.hospital}</p>
                <p>Date: ${data.date}</p>
            `,
            appointment_confirmation: `
                <h2>Appointment Confirmed</h2>
                <p>Dear ${data.userName},</p>
                <p>Your appointment has been confirmed.</p>
                <p>Doctor: ${data.doctorName}</p>
                <p>Date & Time: ${data.dateTime}</p>
            `,
            payment_success: `
                <h2>Payment Successful</h2>
                <p>Dear ${data.userName},</p>
                <p>Your payment has been processed successfully.</p>
                <p>Amount: ${data.amount}</p>
                <p>Transaction ID: ${data.transactionId}</p>
            `,
        };

        return templates[template] || '<p>Notification</p>';
    }

    async getNotifications(userId, filters = {}) {
        try {
            const where = { userId: userId };

            if (filters.isRead !== undefined) {
                where.isRead = filters.isRead;
            }

            const notifications = await prisma.notifications.findMany({
                where: where,
                orderBy: { createdAt: 'desc' },
                take: filters.limit || 50,
                skip: filters.offset || 0
            });

            const total = await prisma.notifications.count({ where: where });

            return {
                success: true,
                notifications: notifications,
                total: total,
                unreadCount: await prisma.notifications.count({
                    where: { userId: userId, isRead: false }
                })
            };
        } catch (error) {
            console.error('Error getting notifications:', error);
            throw error;
        }
    }

    async markAsRead(notificationId, userId) {
        try {
            const notification = await prisma.notifications.update({
                where: {
                    notificationId: notificationId,
                    userId: userId
                },
                data: { isRead: true, readAt: new Date() }
            });

            return { success: true, notification: notification };
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
}

export { NotificationService };
export default new NotificationService();