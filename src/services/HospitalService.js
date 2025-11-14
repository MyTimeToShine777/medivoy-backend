'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class HospitalService {
    constructor() {
        this.validationService = validationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createHospital(hospitalData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!hospitalData || !hospitalData.hospitalName) {
                throw new AppError('Hospital name required', 400);
            }

            const existing = await tx.hospital.findFirst({
                where: { registrationNumber: hospitalData.registrationNumber }
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
                }
            });

            await this.auditLogService.logAction({
                action: 'HOSPITAL_CREATED',
                entityType: 'Hospital',
                entityId: hospital.hospitalId,
                userId: 'ADMIN',
                details: { hospitalName: hospitalData.hospitalName }
            });

            return { success: true, message: 'Hospital created', hospital: hospital };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async getHospitalById(hospitalId) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const hospital = await prisma.hospitals.findUnique({
                where: { hospitalId },
                include: {
                    city: true,
                    country: true,
                    doctors: {
                        select: {
                            doctorId: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    services: {
                        select: {
                            serviceId: true,
                            serviceName: true
                        }
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
                    contains: "' + filters.search + '"
                };
            }

            const hospitals = await prisma.hospitals.findMany({
                where: where,
                orderBy: {
                    hospitalName: 'asc'
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.hospitals.count({ where });

            return {
                success: true,
                hospitals: hospitals,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateHospital(hospitalId, updateData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!hospitalId || !updateData) throw new AppError('Required params missing', 400);

            const hospital = await tx.hospital.findUnique({
                where: { hospitalId }
            });
            if (!hospital) {
                throw new AppError('Hospital not found', 404);
            }

            const allowedFields = ['hospitalName', 'phone', 'email', 'website', 'totalBeds', 'address', 'accreditation', 'certifications'];
            const updateFields = {};
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    updateFields[field] = updateData[field];
                }
            }

            const updatedHospital = await tx.hospital.update({
                where: { hospitalId },
                data: updateFields
            });

            await this.auditLogService.logAction({
                action: 'HOSPITAL_UPDATED',
                entityType: 'Hospital',
                entityId: hospitalId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Hospital updated', hospital: updatedHospital };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL SERVICES
    // ═══════════════════════════════════════════════════════════════════════════════

    async addHospitalService(hospitalId, serviceData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!hospitalId || !serviceData) throw new AppError('Required params missing', 400);

            const hospital = await tx.hospital.findUnique({
                where: { hospitalId }
            });
            if (!hospital) {
                throw new AppError('Hospital not found', 404);
            }

            const service = await tx.hospitalService.create({
                data: {
                    serviceId: this._generateServiceId(),
                    hospitalId: hospitalId,
                    serviceName: serviceData.serviceName,
                    serviceDescription: serviceData.serviceDescription || null,
                    isAvailable: true,
                    createdAt: new Date()
                }
            });

            await this.auditLogService.logAction({
                action: 'HOSPITAL_SERVICE_ADDED',
                entityType: 'HospitalService',
                entityId: service.serviceId,
                userId: 'ADMIN',
                details: { hospitalId: hospitalId }
            });

            return { success: true, message: 'Service added', service: service };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async getHospitalServices(hospitalId) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const services = await prisma.hospitalService.findMany({
                where: { hospitalId: hospitalId, isAvailable: true },
                orderBy: {
                    serviceName: 'asc'
                }
            });

            return { success: true, services: services, total: services.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async removeHospitalService(serviceId, hospitalId) {
        const result = await prisma.$transaction(async(tx) => {
            if (!serviceId || !hospitalId) throw new AppError('Required params missing', 400);

            const service = await tx.hospitalService.findFirst({
                where: { serviceId: serviceId, hospitalId: hospitalId }
            });

            if (!service) {
                throw new AppError('Service not found', 404);
            }

            await tx.hospitalService.delete({
                where: { serviceId: serviceId }
            });

            await this.auditLogService.logAction({
                action: 'HOSPITAL_SERVICE_REMOVED',
                entityType: 'HospitalService',
                entityId: serviceId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Service removed' };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
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
                include: [
                    { model: Specialization, attributes: ['specializationName'] }
                ],
                order: [
                    ['firstName', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Doctor.count({ where: { hospitalId: hospitalId, isActive: true } });

            return {
                success: true,
                doctors: doctors,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getHospitalStats(hospitalId) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const hospital = await Hospital.findByPk(hospitalId);
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

export default new HospitalService();