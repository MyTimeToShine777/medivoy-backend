'use strict';

import prisma from '../config/prisma.js';

export class CompanionService {
    /**
     * ADD COMPANION
     */
    async addCompanion(bookingId, patientId, companionData) {
        try {
            if (!bookingId) {
                return { success: false, error: 'Booking ID is required' };
            }

            if (!patientId) {
                return { success: false, error: 'Patient ID is required' };
            }

            if (!companionData.firstName || !companionData.lastName) {
                return { success: false, error: 'Companion first name and last name are required' };
            }

            if (!companionData.relationship) {
                return { success: false, error: 'Relationship is required' };
            }

            // Validate booking exists
            const booking = await prisma.bookings.findUnique({
                where: { bookingId }
            });
            if (!booking) {
                return { success: false, error: 'Booking not found' };
            }

            // Validate patient exists
            const patient = await prisma.patients.findUnique({
                where: { patientId }
            });
            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            const companion = await prisma.companion.create({
                data: {
                    bookingId,
                    patientId,
                    ...companionData
                }
            });

            return {
                success: true,
                data: companion,
                message: 'Companion added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET BOOKING COMPANIONS
     */
    async getBookingCompanions(bookingId) {
        try {
            if (!bookingId) {
                return { success: false, error: 'Booking ID is required' };
            }

            const companions = await prisma.companion.findMany({
                where: { bookingId },
                orderBy: {
                    createdAt: 'asc'
                }
            });

            return {
                success: true,
                data: companions,
                total: companions.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET COMPANION BY ID
     */
    async getCompanionById(companionId) {
        try {
            if (!companionId) {
                return { success: false, error: 'Companion ID is required' };
            }

            const companion = await prisma.companion.findUnique({
                where: { companionId },
                include: {
                    booking: {
                        select: { bookingId: true, bookingNumber: true, status: true }
                    },
                    patient: {
                        select: { patientId: true, firstName: true, lastName: true }
                    }
                }
            });

            if (!companion) {
                return { success: false, error: 'Companion not found' };
            }

            return {
                success: true,
                data: companion
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE COMPANION
     */
    async updateCompanion(companionId, updateData) {
        try {
            if (!companionId) {
                return { success: false, error: 'Companion ID is required' };
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return { success: false, error: 'Update data is required' };
            }

            const companion = await prisma.companion.findUnique({
                where: { companionId }
            });

            if (!companion) {
                return { success: false, error: 'Companion not found' };
            }

            const updated = await prisma.companion.update({
                where: { companionId },
                data: updateData
            });

            return {
                success: true,
                data: updated,
                message: 'Companion updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * REMOVE COMPANION
     */
    async removeCompanion(companionId) {
        try {
            if (!companionId) {
                return { success: false, error: 'Companion ID is required' };
            }

            const deleted = await prisma.companion.delete({
                where: { companionId }
            }).catch(() => null);

            if (!deleted) {
                return { success: false, error: 'Companion not found' };
            }

            return {
                success: true,
                message: 'Companion removed successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET PATIENT COMPANIONS
     */
    async getPatientCompanions(patientId) {
        try {
            if (!patientId) {
                return { success: false, error: 'Patient ID is required' };
            }

            const companions = await prisma.companion.findMany({
                where: { patientId },
                include: {
                    booking: {
                        select: { bookingId: true, bookingNumber: true, status: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return {
                success: true,
                data: companions,
                total: companions.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new CompanionService();