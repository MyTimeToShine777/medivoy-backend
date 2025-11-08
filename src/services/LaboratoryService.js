'use strict';

import { Op, sequelize } from 'sequelize';
import {
    LabTest,
    LabOrder,
    LabResult,
    LabPackage,
    User,
    Hospital,
    AuditLog
} from '../models/index.js';
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
        const transaction = await sequelize.transaction();
        try {
            if (!hospitalId || !testData) {
                throw new AppError('Required parameters missing', 400);
            }

            const hospital = await Hospital.findByPk(hospitalId, { transaction: transaction });
            if (!hospital) {
                await transaction.rollback();
                throw new AppError('Hospital not found', 404);
            }

            const errors = this.validationService.validateLabTestData(testData);
            if (errors.length) {
                await transaction.rollback();
                throw new AppError(errors.join(', '), 400);
            }

            const labTest = await LabTest.create({
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
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'LAB_TEST_CREATED',
                entityType: 'LabTest',
                entityId: labTest.testId,
                userId: 'ADMIN',
                details: { testName: testData.testName, hospitalId: hospitalId }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Lab test created', labTest: labTest };
        } catch (error) {
            await transaction.rollback();
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
                    [Op.like]: '%' + filters.search + '%'
                };
            }

            const tests = await LabTest.findAll({
                where: where,
                order: [
                    ['testName', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await LabTest.count({ where: where });

            return {
                success: true,
                tests: tests,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // LAB ORDER MANAGEMENT (from LaboratoryService - MERGED)
    // ═══════════════════════════════════════════════════════════════════════════════

    async orderLabTest(userId, orderData) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !orderData) {
                throw new AppError('Required parameters missing', 400);
            }

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            const tests = [];
            for (const testId of orderData.testIds) {
                const test = await LabTest.findByPk(testId, { transaction: transaction });
                if (!test) {
                    await transaction.rollback();
                    throw new AppError('Lab test not found: ' + testId, 404);
                }
                tests.push(test);
            }

            const totalPrice = tests.reduce((sum, test) => sum + test.price, 0);

            const labOrder = await LabOrder.create({
                orderId: this._generateOrderId(),
                userId: userId,
                totalPrice: totalPrice,
                status: 'pending',
                sampleCollectionRequired: true,
                collectionDate: orderData.collectionDate || null,
                notes: orderData.notes || null,
                orderedAt: new Date()
            }, { transaction: transaction });

            // Add tests to order
            for (const test of tests) {
                await labOrder.addLabTest(test, { transaction: transaction });
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

            await transaction.commit();

            return { success: true, message: 'Lab order created', labOrder: labOrder };
        } catch (error) {
            await transaction.rollback();
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
                order: [
                    ['orderedAt', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await LabOrder.count({ where: where });

            return {
                success: true,
                orders: orders,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async uploadLabResult(orderId, userId, resultData, fileBuffer) {
        const transaction = await sequelize.transaction();
        try {
            if (!orderId || !userId || !resultData || !fileBuffer) {
                throw new AppError('Required parameters missing', 400);
            }

            const order = await LabOrder.findByPk(orderId, { transaction: transaction });
            if (!order) {
                await transaction.rollback();
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
            }, { transaction: transaction });

            order.status = 'results_ready';
            order.resultReadyAt = new Date();
            await order.save({ transaction: transaction });

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

            await transaction.commit();

            return { success: true, message: 'Result uploaded', labResult: labResult };
        } catch (error) {
            await transaction.rollback();
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
        const transaction = await sequelize.transaction();
        try {
            if (!hospitalId || !packageData) {
                throw new AppError('Required parameters missing', 400);
            }

            const hospital = await Hospital.findByPk(hospitalId, { transaction: transaction });
            if (!hospital) {
                await transaction.rollback();
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
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'LAB_PACKAGE_CREATED',
                entityType: 'LabPackage',
                entityId: labPackage.packageId,
                userId: 'ADMIN',
                details: { packageName: packageData.packageName }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Package created', labPackage: labPackage };
        } catch (error) {
            await transaction.rollback();
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