'use strict';

import laboratoryService from '../services/LaboratoryService.js';

export class LaboratoryController {
    constructor() {
        this.laboratoryService = laboratoryService;
    }

    async createLabTest(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const testData = req.body;

            const result = await this.laboratoryService.createLabTest(hospitalId, testData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Lab test created',
                data: result.labTest
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getLabTests(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const filters = {
                search: req.query.search,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.laboratoryService.getLabTests(hospitalId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.tests,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async orderLabTest(req, res) {
        try {
            const userId = req.user.userId;
            const orderData = req.body;

            const result = await this.laboratoryService.orderLabTest(userId, orderData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Lab order created',
                data: result.labOrder
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserLabOrders(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                status: req.query.status,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.laboratoryService.getUserLabOrders(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async uploadLabResult(req, res) {
        try {
            const orderId = req.params.orderId;
            const userId = req.user.userId;
            const resultData = req.body;
            const fileBuffer = req.file.buffer;

            const result = await this.laboratoryService.uploadLabResult(orderId, userId, resultData, fileBuffer);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Lab result uploaded',
                data: result.labResult
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getLabResult(req, res) {
        try {
            const resultId = req.params.resultId;
            const userId = req.user.userId;

            const result = await this.laboratoryService.getLabResult(resultId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.result
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async downloadLabResult(req, res) {
        try {
            const resultId = req.params.resultId;
            const userId = req.user.userId;

            const result = await this.laboratoryService.downloadLabResult(resultId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                downloadUrl: result.file.url,
                fileName: result.fileName
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async createLabPackage(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const packageData = req.body;

            const result = await this.laboratoryService.createLabPackage(hospitalId, packageData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Lab package created',
                data: result.labPackage
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new LaboratoryController();