// Google Meet Service - Video conference integration
// NO optional chaining - Production Ready
import { google } from 'googleapis';
import prisma from '../config/prisma.js';

class GoogleMeetService {
    constructor() {
        this.auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        );

        this.calendar = google.calendar({
            version: 'v3',
            auth: this.auth,
        });
    }

    // ========== CREATE MEET LINK ==========
    async createMeetLink(eventData) {
        try {
            const event = {
                summary: eventData.title,
                description: eventData.description || '',
                start: {
                    dateTime: eventData.startTime,
                    timeZone: eventData.timeZone || 'UTC',
                },
                end: {
                    dateTime: eventData.endTime,
                    timeZone: eventData.timeZone || 'UTC',
                },
                attendees: eventData.attendees.map(email => ({ email })),
                conferenceData: {
                    createRequest: {
                        requestId: `meet-${Date.now()}`,
                        conferenceSolutionKey: {
                            type: 'hangoutsMeet',
                        },
                    },
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 },
                    ],
                },
            };

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                conferenceDataVersion: 1,
            });

            const videoCall = await prisma.videoCall.create({
                data: {
                appointmentId: eventData.appointmentId,
                organizer: eventData.organizer,
                attendees: eventData.attendees,
                meetLink: response.data.conferenceData.entryPoints[0].uri,
                googleEventId: response.data.id,
                title: eventData.title,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                status: 'scheduled',
            });

            return {
                success: true,
                data: {
                    meetLink: response.data.conferenceData.entryPoints[0].uri,
                    eventId: response.data.id,
                    videoCallId: videoCall.videoCallId,
                    startTime: eventData.startTime,
                    endTime: eventData.endTime,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET MEET LINK ==========
    async getMeetLink(eventId) {
        try {
            const event = await this.calendar.events.get({
                calendarId: 'primary',
                eventId,
            });

            if (!event.data.conferenceData) {
                return { success: false, error: 'No meet link found' };
            }

            return {
                success: true,
                data: {
                    meetLink: event.data.conferenceData.entryPoints[0].uri,
                    eventId,
                    summary: event.data.summary,
                    startTime: event.data.start.dateTime,
                    endTime: event.data.end.dateTime,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== START VIDEO CALL ==========
    async startVideoCall(eventId) {
        try {
            const videoCall = await VideoCall.findOne({
                where: { googleEventId: eventId },
            });

            if (!videoCall) {
                return { success: false, error: 'Video call not found' };
            }

            videoCall.status = 'active';
            videoCall.actualStartTime = new Date();
            await videoCall.save();

            return { success: true, data: videoCall };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== END VIDEO CALL ==========
    async endVideoCall(eventId, duration, recordingUrl = null) {
        try {
            const videoCall = await VideoCall.findOne({
                where: { googleEventId: eventId },
            });

            if (!videoCall) {
                return { success: false, error: 'Video call not found' };
            }

            videoCall.status = 'completed';
            videoCall.actualEndTime = new Date();
            videoCall.duration = duration;
            if (recordingUrl) {
                videoCall.recordingUrl = recordingUrl;
            }

            await videoCall.save();

            return { success: true, data: videoCall };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CANCEL MEET LINK ==========
    async cancelMeetLink(eventId) {
        try {
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId,
            });

            const videoCall = await VideoCall.findOne({
                where: { googleEventId: eventId },
            });

            if (videoCall) {
                videoCall.status = 'cancelled';
                videoCall.cancelledAt = new Date();
                await videoCall.save();
            }

            return { success: true, message: 'Meet link cancelled' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE MEET ATTENDEES ==========
    async updateMeetAttendees(eventId, newAttendees) {
        try {
            const event = await this.calendar.events.get({
                calendarId: 'primary',
                eventId,
            });

            event.data.attendees = newAttendees.map(email => ({ email }));

            const updatedEvent = await this.calendar.events.update({
                calendarId: 'primary',
                eventId,
                resource: event.data,
            });

            return {
                success: true,
                data: updatedEvent.data,
                message: 'Attendees updated',
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VALIDATE MEET LINK ==========
    validateMeetLink(meetLink) {
        const isValid = meetLink &&
            typeof meetLink === 'string' &&
            meetLink.includes('meet.google.com');

        return { success: true, isValid };
    }

    // ========== GET VIDEO CALL HISTORY ==========
    async getVideoCallHistory(userId, filters = {}) {
        try {
            const where = {
                OR: [
                    { organizer: userId },
                    {
                        attendees: {
                            hasSome: [userId]
                        }
                    },
                ],
            };

            const videoCalls = await VideoCall.findAll({
                where,
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            const total = await VideoCall.count({ where });

            return { success: true, data: videoCalls, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new GoogleMeetService();