'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class HospitalService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createHospital(hospitalData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!hospitalData || !hospitalData.hospitalName) {
                throw new AppError('Hospital name required', 400);
            }

            const existing = await tx.hospital.findFirst({
                where: { registrationNumber: hospitalData.registrationNumber },
                transaction: transaction
            });

            if (existing) {
                throw new AppError('Hospital already registered', 409);
            }

            const hospital = await tx.hospital.create({
                data: {
                hospitalId: this._generateHospitalId(),
                hospitalName: hospitalData.hospitalName,
                registrationNumber: hospitalData.registrationNumber,
                cityId: hospitalData.cityId,
                countryId: hospitalData.countryId,
                address: hospitalData.address,
                phone: hospitalData.phone,
                email: hospitalData.email,
                website: hospitalData.website || null,
                totalBeds: hospitalData.totalBeds || 0,
                totalDoctors: 0,
                accreditation: hospitalData.accreditation || [],
                certifications: hospitalData.certifications || [],
                established: hospitalData.established || null,
                isActive: true,
                createdAt: new Date()
            });

            await this.auditLogService.logAction({
                action: 'HOSPITAL_CREATED',
                entityType: 'Hospital',
                entityId: hospital.hospitalId,
                userId: 'ADMIN',
                details: { hospitalName: hospitalData.hospitalName }
            }, transaction);


            return { success: true, message: 'Hospital created', hospital: hospital };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getHospitalById(hospitalId) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const hospital = await prisma.hospital.findUnique({
                where: { hospitalId }, {
                include: {
                    city: {
                        select: { cityName: true }
                    },
                    country: {
                        select: { countryName: true }
                    },
                    doctor: {
                        select: { doctorId: true, firstName: true, lastName: true }
                    },
                    hospService: {
                        select: { serviceId: true, serviceName: true }
                    }
                }
            });

            if (!hospital) throw new AppError('Hospital not found', 404);

            return { success: true, hospital: hospital };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async listHospitals(filters) {
        try {
            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { isActive: true };

            if (filters && filters.cityId) where.cityId = filters.cityId;
            if (filters && filters.countryId) where.countryId = filters.countryId;
            if (filters && filters.search) {
                where.hospitalName = {
                    contains: "' + filters.search + '" };
            }

            const hospitals = await prisma.hospital.findMany({
                where: where,
                include: {
                    city: {
                        select: { cityName: true }
                    },
                    country: {
                        select: { countryName: true }
                    }
                },
                orderBy: { hospitalName: 'asc' },
                take: limit,
                skip: offset
            });

            const total = await prisma.hospital.count({ where });

            return {
                success: true,
                hospitals: hospitals,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateHospital(hospitalId, updateData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!hospitalId || !updateData) throw new AppError('Required params missing', 400);

            const hospital = await prisma.hospital.findUnique({
                where: { hospitalId });
            if (!hospital) {
                throw new AppError('Hospital not found', 404);
            }

            const allowedFields = ['hospitalName', 'phone', 'email', 'website', 'totalBeds', 'address', 'accreditation', 'certifications'];
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    hospital[field] = updateData[field];
                }
            }

            await hospital.save();

            await this.auditLogService.logAction({
                action: 'HOSPITAL_UPDATED',
                entityType: 'Hospital',
                entityId: hospitalId,
                userId: 'ADMIN',
                details: {}
            }, transaction);


            return { success: true, message: 'Hospital updated', hospital: hospital };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL SERVICES
    // ═══════════════════════════════════════════════════════════════════════════════

    async addHospitalService(hospitalId, serviceData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!hospitalId || !serviceData) throw new AppError('Required params missing', 400);

            const hospital = await prisma.hospital.findUnique({
                where: { hospitalId });
            if (!hospital) {
                throw new AppError('Hospital not found', 404);
            }

            const service = await HospService.create({
                serviceId: this._generateServiceId(),
                hospitalId: hospitalId,
                serviceName: serviceData.serviceName,
                serviceDescription: serviceData.serviceDescription || null,
                isAvailable: true,
                createdAt: new Date()
            });

            await this.auditLogService.logAction({
                action: 'HOSPITAL_SERVICE_ADDED',
                entityType: 'HospitalService',
                entityId: service.serviceId,
                userId: 'ADMIN',
                details: { hospitalId: hospitalId }
            }, transaction);


            return { success: true, message: 'Service added', service: service };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getHospitalServices(hospitalId) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const services = await HospService.findAll({
                where: { hospitalId: hospitalId, isAvailable: true },
                orderBy: { serviceName: 'asc' }
            });

            return { success: true, services: services, total: services.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async removeHospitalService(serviceId, hospitalId) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!serviceId || !hospitalId) throw new AppError('Required params missing', 400);

            const service = await HospService.findOne({
                where: { serviceId: serviceId, hospitalId: hospitalId },
                transaction: transaction
            });

            if (!service) {
                throw new AppError('Service not found', 404);
            }

            await service.destroy();

            await this.auditLogService.logAction({
                action: 'HOSPITAL_SERVICE_REMOVED',
                entityType: 'HospitalService',
                entityId: serviceId,
                userId: 'ADMIN',
                details: {}
            }, transaction);


            return { success: true, message: 'Service removed' };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL DOCTORS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getHospitalDoctors(hospitalId, filters) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;

            const doctors = await Doctor.findAll({
                where: { hospitalId: hospitalId, isActive: true },
                include: {
                    specialization: {
                        select: { specializationName: true }
                    }
                },
                orderBy: { firstName: 'asc' },
                take: limit,
                skip: offset
            });

            const total = await Doctor.count({ where: { hospitalId: hospitalId, isActive: true } });

            return {
                success: true,
                doctors: doctors,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getHospitalStats(hospitalId) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const hospital = await prisma.hospital.findUnique({ where: { hospitalId: hospitalId } });
            if (!hospital) throw new AppError('Hospital not found', 404);

            const totalDoctors = await Doctor.count({ where: { hospitalId: hospitalId, isActive: true } });
            const totalServices = await HospService.count({ where: { hospitalId: hospitalId, isAvailable: true } });

            return {
                success: true,
                stats: {
                    hospitalName: hospital.hospitalName,
                    totalBeds: hospital.totalBeds,
                    totalDoctors: totalDoctors,
                    totalServices: totalServices,
                    accreditation: hospital.accreditation,
                    certifications: hospital.certifications
                }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateHospitalId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'HOSP-' + ts + rnd;
    }

    _generateServiceId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'SVC-' + ts + rnd;
    }
}

export default HospitalService;