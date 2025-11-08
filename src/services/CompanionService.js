'use strict';

import { getModels } from '../models/index.js';
import { Op } from 'sequelize';

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

            const { Companion, Booking, Patient } = getModels();

            // Validate booking exists
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                return { success: false, error: 'Booking not found' };
            }

            // Validate patient exists
            const patient = await Patient.findByPk(patientId);
            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            const companion = await Companion.create({
                bookingId,
                patientId,
                ...companionData
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

            const { Companion } = getModels();

            const companions = await Companion.findAll({
                where: { bookingId },
                order: [
                    ['createdAt', 'ASC']
                ]
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

            const { Companion, Booking, Patient } = getModels();

            const companion = await Companion.findByPk(companionId, {
                include: [
                    { model: Booking, as: 'booking', attributes: ['bookingId', 'bookingNumber', 'status'] },
                    { model: Patient, as: 'patient', attributes: ['patientId', 'firstName', 'lastName'] }
                ]
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

            const { Companion } = getModels();

            const companion = await Companion.findByPk(companionId);

            if (!companion) {
                return { success: false, error: 'Companion not found' };
            }

            await companion.update(updateData);

            return {
                success: true,
                data: companion,
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

            const { Companion } = getModels();

            const deleted = await Companion.destroy({ where: { companionId } });

            if (deleted === 0) {
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

            const { Companion, Booking } = getModels();

            const companions = await Companion.findAll({
                where: { patientId },
                include: [
                    { model: Booking, as: 'booking', attributes: ['bookingId', 'bookingNumber', 'status'] }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
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