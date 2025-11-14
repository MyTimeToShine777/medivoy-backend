// Notification Queue Service - Handle notification queuing
// NO optional chaining - Production Ready
import Queue from 'bull';
import EmailService from './EmailService';
import SMSService from './SMSService';

class NotificationQueueService {
    constructor() {
        this.emailQueue = new Queue('email-notifications', {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
            },
        });

        this.smsQueue = new Queue('sms-notifications', {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
            },
        });

        this.setupProcessors();
    }

    // ========== SETUP PROCESSORS ==========
    setupProcessors() {
        this.emailQueue.process(async(job) => {
            const data = job.data;
            const result = await EmailService.sendEmail(
                data.to,
                data.subject,
                data.html
            );

            if (!result.success) {
                throw new Error(result.error);
            }

            return result;
        });

        this.smsQueue.process(async(job) => {
            const data = job.data;
            const result = await SMSService.sendSMS(
                data.phoneNumber,
                data.message
            );

            if (!result.success) {
                throw new Error(result.error);
            }

            return result;
        });
    }

    // ========== QUEUE EMAIL ==========
    async queueEmail(to, subject, html, delay = 0) {
        try {
            const job = await this.emailQueue.add({ to, subject, html }, {
                delay,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });

            return { success: true, jobId: job.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== QUEUE SMS ==========
    async queueSMS(phoneNumber, message, delay = 0) {
        try {
            const job = await this.smsQueue.add({ phoneNumber, message }, {
                delay,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });

            return { success: true, jobId: job.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET QUEUE STATUS ==========
    async getEmailQueueStatus() {
        try {
            const count = await this.emailQueue.getJobCounts();
            return { success: true, data: count };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET SMS QUEUE STATUS ==========
    async getSMSQueueStatus() {
        try {
            const count = await this.smsQueue.getJobCounts();
            return { success: true, data: count };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CLEAR QUEUE ==========
    async clearEmailQueue() {
        try {
            await this.emailQueue.empty();
            return { success: true, message: 'Email queue cleared' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export { NotificationQueueService };
export default new NotificationQueueService();