'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';

export class DoctorScheduleService {
    async createSchedule(data) {
        try {
            const schedule = await prisma.doctorSchedule.create({
                data: {
                doctorId: data.doctorId,
                dayOfWeek: data.dayOfWeek,
                startTime: data.startTime,
                endTime: data.endTime,
                slotDuration: data.slotDuration || 30,
                isActive: data.isActive !== false
                }
            });

            await cacheService.delete(`doctor_schedule_${data.doctorId}`);
            console.log(`✅ Schedule created: ${schedule.scheduleId}`);
            return { success: true, data: updated };
        } catch (error) {
            console.error('❌ Create schedule error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async getDoctorSchedules(doctorId) {
        try {
            const cacheKey = `doctor_schedule_${doctorId}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: cached };

            const schedules = await prisma.doctorSchedule.findMany({
                where: { doctorId, isActive: true },
                orderBy: [
                    { dayOfWeek: 'asc' },
                    { startTime: 'asc' }
                ]
            });

            await cacheService.set(cacheKey, schedules, 86400);
            return { success: true, data: schedules };
        } catch (error) {
            console.error('❌ Get schedules error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async getAvailableSlots(doctorId, date) {
        try {
            const dayOfWeek = new Date(date).getDay();
            const schedule = await prisma.doctorSchedule.findFirst({
                where: { doctorId, dayOfWeek, isActive: true }
            });

            if (!schedule) return { success: true, data: [] };

            const slots = [];
            const startTime = new Date(`${date}T${schedule.startTime}`);
            const endTime = new Date(`${date}T${schedule.endTime}`);

            for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + schedule.slotDuration)) {
                slots.push(time.toISOString());
            }

            return { success: true, data: slots };
        } catch (error) {
            console.error('❌ Get slots error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async updateSchedule(scheduleId, data) {
        try {
            const schedule = await prisma.doctorSchedule.findUnique({
                where: { scheduleId }
            });
            if (!schedule) return { success: false, error: 'Not found' };

            const updated = await prisma.doctorSchedule.update({
                where: { scheduleId },
                data: {
                startTime: data.startTime || schedule.startTime,
                endTime: data.endTime || schedule.endTime,
                slotDuration: data.slotDuration || schedule.slotDuration,
                isActive: data.isActive !== undefined ? data.isActive : schedule.isActive
                }
            });
            });

            await cacheService.delete(`doctor_schedule_${schedule.doctorId}`);
            return { success: true, data: updated };
        } catch (error) {
            console.error('❌ Update error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async deleteSchedule(scheduleId) {
        try {
            const schedule = await prisma.doctorSchedule.findUnique({
                where: { scheduleId }
            });
            if (!schedule) return { success: false, error: 'Not found' };

            await prisma.doctorSchedule.delete({
                where: { scheduleId }
            });
            await cacheService.delete(`doctor_schedule_${schedule.doctorId}`);
            return { success: true, message: 'Deleted' };
        } catch (error) {
            console.error('❌ Delete error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const doctorScheduleService = new DoctorScheduleService();
export default doctorScheduleService;