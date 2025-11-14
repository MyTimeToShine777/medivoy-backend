'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { NotificationService } from './NotificationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { StorageService } from './StorageService.js';
import { AppError } from '../utils/errors/AppError.js';

// CONSOLIDATED: LabTestService + LaboratoryService
export class LaboratoryService {
    constructor() {
        this.validationService = new ValidationService();
        this.notificationService = new NotificationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
        this.storageService = new StorageService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // LAB TEST MANAGEMENT (from LabTestService)
    // ═══════════════════════════════════════════════════════════════════════════════

    async createLabTest(hospitalId, testData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!hospitalId || !testData) {
                throw new AppError('Required parameters missing', 400);
            }

            const hospital = await tx.hospital.findUnique({ where: { hospitalId } });
            if (!hospital) {
                throw new AppError('Hospital not found', 404);
            }

            const errors = this.validationService.validateLabTestData(testData);
            if (errors.length) {
                throw new AppError(errors.join(', '), 400);
            }

            const labTest = await tx.labTest.create({
                data: {
                testId: this._generateTestId(),
                hospitalId: hospitalId,
                testName: testData.testName,
                testCode: testData.testCode,
                description: testData.description || null,
                price: testData.price,
                turnaroundTime: testData.turnaroundTime,
                sampleType: testData.sampleType,
                prerequisites: testData.prerequisites || [],
                testParameters: testData.testParameters || [],
                status: 'active',
                createdAt: new Date()
            });

            await this.auditLogService.logAction({
                action: 'LAB_TEST_CREATED',
                entityType: 'LabTest',
                entityId: labTest.testId,
                userId: 'ADMIN',
                details: { testName: testData.testName, hospitalId: hospitalId }
            }, transaction);


            return { success: true, message: 'Lab test created', labTest: labTest };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getLabTests(hospitalId, filters) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { hospitalId: hospitalId, status: 'active' };

            if (filters && filters.search) {
                where.testName = {
                     '%' + filters.search + '%'
                };
            }

            const tests = await LabTest.findAll({
                where: where,
                orderBy: { testName: 'asc' },
                take: limit,
                skip: offset
            });

            const total = await LabTest.count({ where: where });

            return {
                success: true,
                tests: tests,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // LAB ORDER MANAGEMENT (from LaboratoryService - MERGED)
    // ═══════════════════════════════════════════════════════════════════════════════

    async orderLabTest(userId, orderData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!userId || !orderData) {
                throw new AppError('Required parameters missing', 400);
            }

            const user = await prisma.user.findUnique({ where: { userId: userId } });
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const tests = [];
            for (const testId of orderData.testIds) {
                const test = await prisma.labTest.findUnique({ where: { testId: testId } });
                if (!test) {
                    throw new AppError('Lab test not found: ' + testId, 404);
                }
                tests.push(test);
            }

            const totalPrice = tests.reduce((sum, test) => sum + test.price, 0);

            const labOrder = await tx.labOrder.create({
                data: {
                orderId: this._generateOrderId(),
                userId: userId,
                totalPrice: totalPrice,
                status: 'pending',
                sampleCollectionRequired: true,
                collectionDate: orderData.collectionDate || null,
                notes: orderData.notes || null,
                orderedAt: new Date()
            });

            // Add tests to order
            for (const test of tests) {
                await labOrder.addLabTest(test);
            }

            await this.auditLogService.logAction({
                action: 'LAB_ORDER_CREATED',
                entityType: 'LabOrder',
                entityId: labOrder.orderId,
                userId: userId,
                details: { testCount: tests.length, totalPrice: totalPrice }
            }, transaction);

            await this.notificationService.sendNotification(userId, 'LAB_ORDER_CREATED', {
                orderId: labOrder.orderId,
                testCount: tests.length
            });


            return { success: true, message: 'Lab order created', labOrder: labOrder };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getUserLabOrders(userId, filters) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { userId: userId };

            if (filters && filters.status) {
                where.status = filters.status;
            }

            const orders = await LabOrder.findAll({
                where: where,
                include: [
                    { model: LabTest, attributes: ['testName', 'testCode'] }
                ],
                orderBy: { orderedAt: 'desc' },
                take: limit,
                skip: offset
            });

            const total = await LabOrder.count({ where: where });

            return {
                success: true,
                orders: orders,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async uploadLabResult(orderId, userId, resultData, fileBuffer) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!orderId || !userId || !resultData || !fileBuffer) {
                throw new AppError('Required parameters missing', 400);
            }

            const order = await prisma.labOrder.findUnique({ where: { orderId: orderId } });
            if (!order) {
                throw new AppError('Lab order not found', 404);
            }

            const uploadedFile = await this.storageService.uploadFile(fileBuffer, {
                folder: 'lab-results',
                fileName: resultData.fileName,
                orderId: orderId
            });

            const labResult = await LabResult.create({
                resultId: this._generateResultId(),
                orderId: orderId,
                resultDate: resultData.resultDate,
                resultFile: uploadedFile.url,
                fileMimeType: uploadedFile.mimeType,
                normalValues: resultData.normalValues || null,
                abnormalValues: resultData.abnormalValues || null,
                interpretation: resultData.interpretation || null,
                uploadedBy: userId,
                uploadedAt: new Date()
            });

            order.status = 'results_ready';
            order.resultReadyAt = new Date();
            await order.save();

            await this.auditLogService.logAction({
                action: 'LAB_RESULT_UPLOADED',
                entityType: 'LabResult',
                entityId: labResult.resultId,
                userId: userId,
                details: { orderId: orderId }
            }, transaction);

            await this.notificationService.sendNotification(order.userId, 'LAB_RESULT_READY', {
                orderId: orderId
            });


            return { success: true, message: 'Result uploaded', labResult: labResult };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getLabResult(resultId, userId) {
        try {
            if (!resultId || !userId) throw new AppError('Required params missing', 400);

            const result = await LabResult.findOne({
                where: { resultId: resultId },
                include: [{
                    model: LabOrder,
                    where: { userId: userId },
                    attributes: ['orderId', 'totalPrice']
                }]
            });

            if (!result) {
                throw new AppError('Result not found', 404);
            }

            return { success: true, result: result };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async downloadLabResult(resultId, userId) {
        try {
            if (!resultId || !userId) throw new AppError('Required params missing', 400);

            const result = await LabResult.findOne({
                where: { resultId: resultId },
                include: [{
                    model: LabOrder,
                    where: { userId: userId },
                    attributes: ['orderId']
                }]
            });

            if (!result) {
                throw new AppError('Result not found', 404);
            }

            const fileData = await this.storageService.downloadFile(result.resultFile);

            return { success: true, file: fileData, fileName: 'lab-result.pdf' };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async createLabPackage(hospitalId, packageData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!hospitalId || !packageData) {
                throw new AppError('Required parameters missing', 400);
            }

            const hospital = await tx.hospital.findUnique({ where: { hospitalId } });
            if (!hospital) {
                throw new AppError('Hospital not found', 404);
            }

            const labPackage = await LabPackage.create({
                packageId: this._generatePackageId(),
                hospitalId: hospitalId,
                packageName: packageData.packageName,
                description: packageData.description || null,
                price: packageData.price,
                tests: packageData.testIds || [],
                discount: packageData.discount || 0,
                turnaroundTime: packageData.turnaroundTime,
                status: 'active'
            });

            await this.auditLogService.logAction({
                action: 'LAB_PACKAGE_CREATED',
                entityType: 'LabPackage',
                entityId: labPackage.packageId,
                userId: 'ADMIN',
                details: { packageName: packageData.packageName }
            }, transaction);


            return { success: true, message: 'Package created', labPackage: labPackage };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateTestId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'TEST-' + ts + rnd;
    }

    _generateOrderId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'ORD-' + ts + rnd;
    }

    _generateResultId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'RES-' + ts + rnd;
    }

    _generatePackageId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'PKG-' + ts + rnd;
    }
}

export default LaboratoryService;