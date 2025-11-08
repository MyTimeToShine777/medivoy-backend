'use strict';

import { HospitalService } from '../services/HospitalService.js';

export class HospitalController {
    constructor() {
        this.hospitalService = new HospitalService();
    }

    async createHospital(req, res) {
        try {
            const hospitalData = req.body;

            const result = await this.hospitalService.createHospital(hospitalData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Hospital created',
                data: result.hospital
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getHospitalById(req, res) {
        try {
            const hospitalId = req.params.hospitalId;

            const result = await this.hospitalService.getHospitalById(hospitalId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.hospital
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listHospitals(req, res) {
        try {
            const filters = {
                cityId: req.query.cityId,
                countryId: req.query.countryId,
                search: req.query.search,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.hospitalService.listHospitals(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.hospitals,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateHospital(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const updateData = req.body;

            const result = await this.hospitalService.updateHospital(hospitalId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Hospital updated',
                data: result.hospital
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async addHospitalService(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const serviceData = req.body;

            const result = await this.hospitalService.addHospitalService(hospitalId, serviceData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Service added',
                data: result.service
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getHospitalServices(req, res) {
        try {
            const hospitalId = req.params.hospitalId;

            const result = await this.hospitalService.getHospitalServices(hospitalId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.services,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getHospitalDoctors(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const filters = {
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.hospitalService.getHospitalDoctors(hospitalId, filters);

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

    async getHospitalStats(req, res) {
        try {
            const hospitalId = req.params.hospitalId;

            const result = await this.hospitalService.getHospitalStats(hospitalId);

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

export default new HospitalController();