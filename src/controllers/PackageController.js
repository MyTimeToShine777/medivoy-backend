'use strict';

import medicalPackageService from '../services/MedicalPackageService.js';

export class PackageController {
    constructor() {
        this.packageService = medicalPackageService;
    }

    async createPackage(req, res) {
        try {
            const packageData = req.body;

            const result = await this.packageService.createPackage(packageData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Package created',
                data: result.package
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPackageById(req, res) {
        try {
            const packageId = req.params.packageId;

            const result = await this.packageService.getPackageById(packageId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.package
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listPackages(req, res) {
        try {
            const filters = {
                treatmentId: req.query.treatmentId,
                hospitalId: req.query.hospitalId,
                featured: req.query.featured === 'true',
                minPrice: parseInt(req.query.minPrice) || null,
                maxPrice: parseInt(req.query.maxPrice) || null,
                search: req.query.search,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.packageService.listPackages(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.packages,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updatePackage(req, res) {
        try {
            const packageId = req.params.packageId;
            const updateData = req.body;

            const result = await this.packageService.updatePackage(packageId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Package updated',
                data: result.package
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async addPackageAddOn(req, res) {
        try {
            const packageId = req.params.packageId;
            const addOnData = req.body;

            const result = await this.packageService.addPackageAddOn(packageId, addOnData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Add-on added',
                data: result.addOn
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPackageAddOns(req, res) {
        try {
            const packageId = req.params.packageId;

            const result = await this.packageService.getPackageAddOns(packageId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.addOns,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getFeaturedPackages(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;

            const result = await this.packageService.getFeaturedPackages(limit);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.packages
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPackagesByTreatment(req, res) {
        try {
            const treatmentId = req.params.treatmentId;
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.packageService.getPackagesByTreatment(treatmentId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.packages,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new PackageController();