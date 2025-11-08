'use strict';

import RatingService from '../services/RatingService.js';

export class RatingController {
    constructor() {
        this.ratingService = new RatingService();
    }

    /**
     * CREATE RATING
     */
    async createRating(req, res) {
        try {
            const patientId = req.user.patientId;
            const ratingData = req.body;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID not found in session'
                });
            }

            const result = await this.ratingService.createRating(patientId, ratingData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET RATINGS BY DOCTOR
     */
    async getRatingsByDoctor(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const { page, limit } = req.query;

            const result = await this.ratingService.getRatingsByDoctor(doctorId, { page, limit });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET RATINGS BY HOSPITAL
     */
    async getRatingsByHospital(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const { page, limit } = req.query;

            const result = await this.ratingService.getRatingsByHospital(hospitalId, { page, limit });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET AVERAGE RATING
     */
    async getAverageRating(req, res) {
        try {
            const { doctorId, hospitalId } = req.query;

            const result = await this.ratingService.getAverageRating(doctorId, hospitalId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET RATING BY ID
     */
    async getRatingById(req, res) {
        try {
            const ratingId = req.params.ratingId;

            const result = await this.ratingService.getRatingById(ratingId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE RATING
     */
    async updateRating(req, res) {
        try {
            const ratingId = req.params.ratingId;
            const patientId = req.user.patientId;
            const updateData = req.body;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID not found in session'
                });
            }

            const result = await this.ratingService.updateRating(ratingId, patientId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * DELETE RATING
     */
    async deleteRating(req, res) {
        try {
            const ratingId = req.params.ratingId;
            const patientId = req.user.patientId;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID not found in session'
                });
            }

            const result = await this.ratingService.deleteRating(ratingId, patientId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new RatingController();