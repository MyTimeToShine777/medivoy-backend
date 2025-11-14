'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class PermissionService {
    constructor() {
        this.validationService = validationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PERMISSION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createPermission(permissionData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!permissionData || !permissionData.permissionName) {
                throw new AppError('Permission name required', 400);
            }

            const existing = await tx.permission.findFirst({
                where: { permissionName: permissionData.permissionName }
            });

            if (existing) {
                throw new AppError('Permission already exists', 409);
            }

            const permission = await tx.permission.create({
                data: {
                    permissionId: this._generatePermissionId(),
                    permissionName: permissionData.permissionName,
                    permissionDescription: permissionData.permissionDescription || null,
                    module: permissionData.module,
                    action: permissionData.action,
                    resource: permissionData.resource,
                    isActive: true,
                    createdAt: new Date()
                }
            });

            await this.auditLogService.logAction({
                action: 'PERMISSION_CREATED',
                entityType: 'Permission',
                entityId: permission.permissionId,
                userId: 'ADMIN',
                details: { permissionName: permissionData.permissionName }
            });

            return { success: true, message: 'Permission created', permission: permission };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async getPermissionById(permissionId) {
        try {
            if (!permissionId) throw new AppError('Permission ID required', 400);

            const permission = await prisma.permission.findUnique({ where: { permissionId } });
            if (!permission) throw new AppError('Permission not found', 404);

            return { success: true, permission: permission };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async listPermissions(filters) {
        try {
            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = {};

            if (filters && filters.module) where.module = filters.module;
            if (filters && filters.action) where.action = filters.action;
            if (filters && filters.isActive !== undefined) where.isActive = filters.isActive;

            const permissions = await prisma.permission.findMany({
                where: where,
                order: [
                    ['module', 'ASC'],
                    ['action', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await prisma.permission.count({ where });

            return {
                success: true,
                permissions: permissions,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updatePermission(permissionId, updateData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!permissionId || !updateData) throw new AppError('Required params missing', 400);

            const permission = await tx.permission.findUnique({
                where: { permissionId }
            });
            if (!permission) {
                throw new AppError('Permission not found', 404);
            }

            const updatedPermission = await tx.permission.update({
                where: { permissionId },
                data: {
                    permissionName: updateData.permissionName || permission.permissionName,
                    permissionDescription: updateData.permissionDescription || permission.permissionDescription,
                    isActive: updateData.isActive !== undefined ? updateData.isActive : permission.isActive
                }
            });

            await this.auditLogService.logAction({
                action: 'PERMISSION_UPDATED',
                entityType: 'Permission',
                entityId: permissionId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Permission updated', permission: updatedPermission };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async deletePermission(permissionId) {
        const result = await prisma.$transaction(async(tx) => {
            if (!permissionId) throw new AppError('Permission ID required', 400);

            const permission = await tx.permission.findUnique({
                where: { permissionId }
            });
            if (!permission) {
                throw new AppError('Permission not found', 404);
            }

            const rolesWithPermission = await tx.rolePermission.count({
                where: { permissionId: permissionId }
            });

            if (rolesWithPermission > 0) {
                throw new AppError('Cannot delete permission assigned to roles', 400);
            }

            await tx.permission.delete({
                where: { permissionId }
            });

            await this.auditLogService.logAction({
                action: 'PERMISSION_DELETED',
                entityType: 'Permission',
                entityId: permissionId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Permission deleted' };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER PERMISSIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserPermissions(userId) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const user = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    include: [{
                        model: Permission,
                        through: { attributes: [] },
                        attributes: ['permissionId', 'permissionName', 'module', 'action', 'resource']
                    }]
                }]
            });

            if (!user) throw new AppError('User not found', 404);

            const permissions = user.Roles.flatMap(role => role.Permissions);
            const uniquePermissions = [...new Set(permissions.map(p => p.permissionId))];

            return { success: true, permissions: permissions, total: uniquePermissions.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async checkUserPermission(userId, requiredPermission) {
        try {
            if (!userId || !requiredPermission) throw new AppError('Required params missing', 400);

            const userPermissions = await this.getUserPermissions(userId);

            const hasPermission = userPermissions.permissions.some(p => p.permissionName === requiredPermission);

            return { success: true, hasPermission: hasPermission };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async checkMultiplePermissions(userId, requiredPermissions) {
        try {
            if (!userId || !requiredPermissions || !Array.isArray(requiredPermissions)) {
                throw new AppError('Required params missing', 400);
            }

            const userPermissions = await this.getUserPermissions(userId);
            const userPermNames = userPermissions.permissions.map(p => p.permissionName);

            const hasAllPermissions = requiredPermissions.every(perm => userPermNames.includes(perm));
            const hasAnyPermission = requiredPermissions.some(perm => userPermNames.includes(perm));

            return {
                success: true,
                hasAllPermissions: hasAllPermissions,
                hasAnyPermission: hasAnyPermission,
                missingPermissions: requiredPermissions.filter(p => !userPermNames.includes(p))
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getPermissionsByModule(module) {
        try {
            if (!module) throw new AppError('Module required', 400);

            const permissions = await prisma.permission.findMany({
                where: { module: module, isActive: true },
                order: [
                    ['action', 'ASC']
                ]
            });

            return { success: true, permissions: permissions, total: permissions.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generatePermissionId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'PERM-' + ts + rnd;
    }
}

export default new PermissionService();