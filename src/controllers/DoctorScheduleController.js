'use strict';

import { doctorScheduleService } from '../services/DoctorScheduleService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

export class DoctorScheduleController {
    async createSchedule(req, res, next) {
        try {
            if (!req.body.doctorId || !req.body.dayOfWeek || !req.body.startTime || !req.body.endTime) {
                return res.status(400).json(ResponseFormatter.error('Missing required fields', 400, 'VALIDATION_ERROR'));
            }

            const result = await doctorScheduleService.createSchedule(req.body);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(201).json(ResponseFormatter.created(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }

    async getDoctorSchedules(req, res, next) {
        try {
            const result = await doctorScheduleService.getDoctorSchedules(req.params.doctorId);
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }

    async getAvailableSlots(req, res, next) {
        try {
            if (!req.query.date) {
                return res.status(400).json(ResponseFormatter.error('Date required', 400));
            }

            const result = await doctorScheduleService.getAvailableSlots(req.params.doctorId, req.query.date);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }

    async updateSchedule(req, res, next) {
        try {
            const result = await doctorScheduleService.updateSchedule(req.params.scheduleId, req.body);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }

    async deleteSchedule(req, res, next) {
        try {
            const result = await doctorScheduleService.deleteSchedule(req.params.scheduleId);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success({}));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }
}

export default new DoctorScheduleController();