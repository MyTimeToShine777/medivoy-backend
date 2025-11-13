'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';

export class HospitalDoctorService {
    async assignDoctorToHospital(hospitalId, doctorId, data) {
        try {
            const existing = await prisma.hospitalDoctor.findFirst({ 
                where: { hospitalId, doctorId } 
            });
            if (existing) return { success: false, error: 'Doctor already assigned', code: 'CONFLICT' };

            const hd = await prisma.hospitalDoctor.create({
                data: {
                    hospitalId,
                    doctorId,
                    department: data.department,
                    specialization: data.specialization,
                    yearsOfExperience: data.yearsOfExperience,
                    consultationFee: data.consultationFee,
                    isActive: true,
                    assignedDate: new Date()
                }
            });

            await cacheService.deleteByPattern(`hospital_doctors_${hospitalId}*`);
            console.log(`✅ Doctor assigned: ${doctorId} to ${hospitalId}`);
            return { success: true, data: hd };
        } catch (error) {
            console.error('❌ Assign error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async getHospitalDoctors(hospitalId) {
        try {
            const cacheKey = `hospital_doctors_${hospitalId}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: cached };

            const doctors = await prisma.hospitalDoctor.findMany({
                where: { hospitalId, isActive: true },
                include: { doctor: true }
            });

            await cacheService.set(cacheKey, doctors, 86400);
            return { success: true, data: doctors };
        } catch (error) {
            console.error('❌ Get doctors error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async removeDoctorFromHospital(hospitalDoctorId) {
        try {
            const hd = await prisma.hospitalDoctor.findUnique({
                where: { hospitalDoctorId }
            });
            if (!hd) return { success: false, error: 'Not found' };

            await prisma.hospitalDoctor.update({
                where: { hospitalDoctorId },
                data: { isActive: false, removedDate: new Date() }
            });
            await cacheService.deleteByPattern(`hospital_doctors_${hd.hospitalId}*`);
            return { success: true, message: 'Removed' };
        } catch (error) {
            console.error('❌ Remove error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const hospitalDoctorService = new HospitalDoctorService();
export default hospitalDoctorService;