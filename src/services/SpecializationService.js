'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class SpecializationService {
    constructor() {
        this.validationService = validationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SPECIALIZATION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createSpecialization(specializationData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!specializationData || !specializationData.specializationName) {
                throw new AppError('Specialization name required', 400);
            }

            const existing = await tx.specialization.findFirst({
                where: { specializationName: specializationData.specializationName }
            });

            if (existing) {
                throw new AppError('Specialization already exists', 409);
            }

            const specialization = await tx.specialization.create({
                data: {
                    specializationId: this._generateSpecId(),
                    specializationName: specializationData.specializationName,
                    specializationDescription: specializationData.specializationDescription || null,
                    averageFee: specializationData.averageFee || 0,
                    isActive: true,
                    createdAt: new Date()
                }
            });

            await this.auditLogService.logAction({
                action: 'SPECIALIZATION_CREATED',
                entityType: 'Specialization',
                entityId: specialization.specializationId,
                userId: 'ADMIN',
                details: { name: specializationData.specializationName }
            });

            return { success: true, message: 'Specialization created', specialization: specialization };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async getSpecializationById(specializationId) {
        try {
            if (!specializationId) throw new AppError('Specialization ID required', 400);

            const specialization = await prisma.specialization.findUnique({
                where: { specializationId },
                include: {
                    doctors: {
                        select: {
                            doctorId: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });

            if (!specialization) throw new AppError('Specialization not found', 404);

            return { success: true, specialization: specialization };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async listSpecializations(filters) {
        try {
            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { isActive: true };

            if (filters && filters.search) {
                where.specializationName = {
                    contains: "' + filters.search + '"
                };
            }

            const specializations = await prisma.specialization.findMany({
                where: where,
                order: [
                    ['specializationName', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Specialization.count({ where: where });

            return {
                success: true,
                specializations: specializations,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateSpecialization(specializationId, updateData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!specializationId || !updateData) throw new AppError('Required params missing', 400);

            const specialization = await tx.specialization.findUnique({
                where: { specializationId }
            });
            if (!specialization) {
                throw new AppError('Specialization not found', 404);
            }

            const updateFields = {};
            if (updateData.specializationDescription) updateFields.specializationDescription = updateData.specializationDescription;
            if (updateData.averageFee) updateFields.averageFee = updateData.averageFee;

            const updatedSpecialization = await tx.specialization.update({
                where: { specializationId },
                data: updateFields
            });

            await this.auditLogService.logAction({
                action: 'SPECIALIZATION_UPDATED',
                entityType: 'Specialization',
                entityId: specializationId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Updated', specialization: updatedSpecialization };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async getSpecializationDoctors(specializationId, filters) {
        try {
            if (!specializationId) throw new AppError('Specialization ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;

            const doctors = await Doctor.findAll({
                where: { specializationId: specializationId, isActive: true },
                order: [
                    ['firstName', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Doctor.count({ where: { specializationId: specializationId, isActive: true } });

            return {
                success: true,
                doctors: doctors,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getSpecializationStats(specializationId) {
        try {
            if (!specializationId) throw new AppError('Specialization ID required', 400);

            const specialization = await Specialization.findByPk(specializationId);
            if (!specialization) throw new AppError('Specialization not found', 404);

            const doctorCount = await Doctor.count({ where: { specializationId: specializationId, isActive: true } });

            return {
                success: true,
                stats: {
                    name: specialization.specializationName,
                    doctorCount: doctorCount,
                    averageFee: specialization.averageFee
                }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateSpecId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'SPEC-' + ts + rnd;
    }
}

export default new SpecializationService();