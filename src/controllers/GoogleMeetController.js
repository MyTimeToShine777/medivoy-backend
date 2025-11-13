'use strict';

import { GoogleMeetService } from '../services/GoogleMeetService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';
import { logger } from '../utils/logger.js';

export class GoogleMeetController {
    constructor() {
        this.googleMeetService = new GoogleMeetService();
    }

    async createMeeting(req, res) {
        try {
            const userId = req.user.userId;
            const eventData = req.body;

            if (!eventData || !eventData.title || !eventData.startTime || !eventData.endTime) {
                return res.status(400).json(ResponseFormatter.error('Missing required fields: title, startTime, endTime', 400, 'MISSING_FIELDS'));
            }

            const result = await this.googleMeetService.createMeetLink(eventData);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'MEET_CREATION_FAILED'));
            }

            logger.info(`Google Meet created for user ${userId}: ${result.meetLink}`);

            return res.status(201).json(ResponseFormatter.success(
                { meetLink: result.meetLink, event: result.event },
                'Google Meet created successfully'
            ));
        } catch (error) {
            logger.error('Error creating Google Meet:', error);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getMeetingDetails(req, res) {
        try {
            const eventId = req.params.eventId;

            if (!eventId) {
                return res.status(400).json(ResponseFormatter.error('Event ID is required', 400, 'MISSING_EVENT_ID'));
            }

            const result = await this.googleMeetService.getMeetDetails(eventId);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, 'MEET_NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success(
                result.event,
                'Meeting details retrieved successfully'
            ));
        } catch (error) {
            logger.error('Error retrieving Google Meet details:', error);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async updateMeeting(req, res) {
        try {
            const eventId = req.params.eventId;
            const updateData = req.body;

            if (!eventId) {
                return res.status(400).json(ResponseFormatter.error('Event ID is required', 400, 'MISSING_EVENT_ID'));
            }

            const result = await this.googleMeetService.updateMeet(eventId, updateData);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'MEET_UPDATE_FAILED'));
            }

            return res.status(200).json(ResponseFormatter.success(
                result.event,
                'Meeting updated successfully'
            ));
        } catch (error) {
            logger.error('Error updating Google Meet:', error);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async deleteMeeting(req, res) {
        try {
            const eventId = req.params.eventId;

            if (!eventId) {
                return res.status(400).json(ResponseFormatter.error('Event ID is required', 400, 'MISSING_EVENT_ID'));
            }

            const result = await this.googleMeetService.deleteMeet(eventId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'MEET_DELETE_FAILED'));
            }

            return res.status(200).json(ResponseFormatter.success(
                null,
                'Meeting deleted successfully'
            ));
        } catch (error) {
            logger.error('Error deleting Google Meet:', error);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async listMeetings(req, res) {
        try {
            const { startDate, endDate, maxResults = 50 } = req.query;

            const result = await this.googleMeetService.listUpcomingMeets({
                timeMin: startDate,
                timeMax: endDate,
                maxResults: parseInt(maxResults)
            });

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'MEET_LIST_FAILED'));
            }

            return res.status(200).json(ResponseFormatter.success(
                { meetings: result.events, total: result.events.length },
                'Meetings retrieved successfully'
            ));
        } catch (error) {
            logger.error('Error listing Google Meets:', error);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async createConsultationMeet(req, res) {
        try {
            const consultationId = req.params.consultationId;
            const userId = req.user.userId;

            if (!consultationId) {
                return res.status(400).json(ResponseFormatter.error('Consultation ID is required', 400, 'MISSING_CONSULTATION_ID'));
            }

            const result = await this.googleMeetService.createMeetForConsultation(consultationId, userId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CONSULTATION_MEET_FAILED'));
            }

            return res.status(201).json(ResponseFormatter.success(
                { meetLink: result.meetLink, consultation: result.consultation },
                'Consultation meeting created successfully'
            ));
        } catch (error) {
            logger.error('Error creating consultation meet:', error);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async sendMeetInvitations(req, res) {
        try {
            const eventId = req.params.eventId;
            const { attendees } = req.body;

            if (!eventId) {
                return res.status(400).json(ResponseFormatter.error('Event ID is required', 400, 'MISSING_EVENT_ID'));
            }

            if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
                return res.status(400).json(ResponseFormatter.error('Attendees list is required', 400, 'MISSING_ATTENDEES'));
            }

            const result = await this.googleMeetService.sendInvitations(eventId, attendees);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'INVITATION_FAILED'));
            }

            return res.status(200).json(ResponseFormatter.success(
                { sent: result.sent },
                'Invitations sent successfully'
            ));
        } catch (error) {
            logger.error('Error sending meet invitations:', error);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'INTERNAL_SERVER_ERROR'));
        }
    }
}

export default new GoogleMeetController();
