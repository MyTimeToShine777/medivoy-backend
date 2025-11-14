'use strict';

import doctorService from '../services/DoctorService.js';

export class DoctorController {
    constructor() {
        this.doctorService = doctorService;
    }

    async createDoctor(req, res) {
        try {
            const doctorData = req.body;

            const result = await this.doctorService.createDoctor(doctorData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Doctor created',
                data: result.doctor
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getDoctorById(req, res) {
        try {
            const doctorId = req.params.doctorId;

            const result = await this.doctorService.getDoctorById(doctorId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.doctor
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listDoctors(req, res) {
        try {
            const filters = {
                specializationId: req.query.specializationId,
                hospitalId: req.query.hospitalId,
                search: req.query.search,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.doctorService.searchDoctors(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.doctors,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateDoctor(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const updateData = req.body;

            const result = await this.doctorService.updateDoctor(doctorId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Doctor updated',
                data: result.doctor
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async setDoctorAvailability(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const availabilityData = req.body;

            const result = await this.doctorService.setDoctorAvailability(doctorId, availabilityData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Availability set',
                data: result.doctor
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getDoctorAvailability(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const date = req.query.date;

            const result = await this.doctorService.getDoctorAvailability(doctorId, date);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.availability
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getDoctorAppointments(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const filters = {
                status: req.query.status,
                appointmentDate: req.query.date,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.doctorService.getDoctorAppointments(doctorId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.appointments,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getDoctorStats(req, res) {
        try {
            const doctorId = req.params.doctorId;

            const result = await this.doctorService.getDoctorStats(doctorId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.stats
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new DoctorController();