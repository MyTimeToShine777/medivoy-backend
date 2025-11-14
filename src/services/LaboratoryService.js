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
        return await prisma.$transaction(async(tx) => {
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
                }
            });

            await this.auditLogService.logAction({
                action: 'LAB_TEST_CREATED',
                entityType: 'LabTest',
                entityId: labTest.testId,
                userId: 'ADMIN',
                details: { testName: testData.testName, hospitalId: hospitalId }
            }, tx);

            return { success: true, message: 'Lab test created', labTest: labTest };
        });
    }

    async getLabTests(hospitalId, filters) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { hospitalId: hospitalId, status: 'active' };

            if (filters && filters.search) {
                where.testName = {
                    contains: filters.search,
                    mode: 'insensitive'
                };
            }

            const [tests, total] = await Promise.all([
                prisma.labTest.findMany({
                    where: where,
                    orderBy: { testName: 'asc' },
                    take: limit,
                    skip: offset
                }),
                prisma.labTest.count({ where: where })
            ]);

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
        return await prisma.$transaction(async(tx) => {
            if (!userId || !orderData) {
                throw new AppError('Required parameters missing', 400);
            }

            const user = await tx.user.findUnique({ where: { userId } });
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const tests = [];
            for (const testId of orderData.testIds) {
                const test = await tx.labTest.findUnique({ where: { testId } });
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
                    orderedAt: new Date(),
                    labTests: {
                        create: tests.map(test => ({
                            labTestId: test.testId
                        }))
                    }
                }
            });

            await this.auditLogService.logAction({
                action: 'LAB_ORDER_CREATED',
                entityType: 'LabOrder',
                entityId: labOrder.orderId,
                userId: userId,
                details: { testCount: tests.length, totalPrice: totalPrice }
            }, tx);

            await this.notificationService.sendNotification(userId, 'LAB_ORDER_CREATED', {
                orderId: labOrder.orderId,
                testCount: tests.length
            });

            return { success: true, message: 'Lab order created', labOrder: labOrder };
        });
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

            const [orders, total] = await Promise.all([
                prisma.labOrder.findMany({
                    where: where,
                    include: {
                        labTests: {
                            select: {
                                labTest: {
                                    select: {
                                        testName: true,
                                        testCode: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { orderedAt: 'desc' },
                    take: limit,
                    skip: offset
                }),
                prisma.labOrder.count({ where: where })
            ]);

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
        return await prisma.$transaction(async(tx) => {
            if (!orderId || !userId || !resultData || !fileBuffer) {
                throw new AppError('Required parameters missing', 400);
            }

            const order = await tx.labOrder.findUnique({ where: { orderId } });
            if (!order) {
                throw new AppError('Lab order not found', 404);
            }

            const uploadedFile = await this.storageService.uploadFile(fileBuffer, {
                folder: 'lab-results',
                fileName: resultData.fileName,
                orderId: orderId
            });

            const labResult = await tx.labResult.create({
                data: {
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
                }
            });

            await tx.labOrder.update({
                where: { orderId },
                data: {
                    status: 'results_ready',
                    resultReadyAt: new Date()
                }
            });

            await this.auditLogService.logAction({
                action: 'LAB_RESULT_UPLOADED',
                entityType: 'LabResult',
                entityId: labResult.resultId,
                userId: userId,
                details: { orderId: orderId }
            }, tx);

            await this.notificationService.sendNotification(order.userId, 'LAB_RESULT_READY', {
                orderId: orderId
            });

            return { success: true, message: 'Result uploaded', labResult: labResult };
        });
    }

    async getLabResult(resultId, userId) {
        try {
            if (!resultId || !userId) throw new AppError('Required params missing', 400);

            const result = await prisma.labResult.findFirst({
                where: {
                    resultId: resultId,
                    labOrder: {
                        userId: userId
                    }
                },
                include: {
                    labOrder: {
                        select: {
                            orderId: true,
                            totalPrice: true
                        }
                    }
                }
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

            const result = await prisma.labResult.findFirst({
                where: {
                    resultId: resultId,
                    labOrder: {
                        userId: userId
                    }
                },
                include: {
                    labOrder: {
                        select: {
                            orderId: true
                        }
                    }
                }
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
        return await prisma.$transaction(async(tx) => {
            if (!hospitalId || !packageData) {
                throw new AppError('Required parameters missing', 400);
            }

            const hospital = await tx.hospital.findUnique({ where: { hospitalId } });
            if (!hospital) {
                throw new AppError('Hospital not found', 404);
            }

            const labPackage = await tx.labPackage.create({
                data: {
                    packageId: this._generatePackageId(),
                    hospitalId: hospitalId,
                    packageName: packageData.packageName,
                    description: packageData.description || null,
                    price: packageData.price,
                    tests: packageData.testIds || [],
                    discount: packageData.discount || 0,
                    turnaroundTime: packageData.turnaroundTime,
                    status: 'active'
                }
            });

            await this.auditLogService.logAction({
                action: 'LAB_PACKAGE_CREATED',
                entityType: 'LabPackage',
                entityId: labPackage.packageId,
                userId: 'ADMIN',
                details: { packageName: packageData.packageName }
            }, tx);

            return { success: true, message: 'Package created', labPackage: labPackage };
        });
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