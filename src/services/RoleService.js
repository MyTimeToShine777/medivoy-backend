'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class RoleService {
    constructor() {
        this.validationService = validationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ROLE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createRole(roleData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!roleData || !roleData.roleName) throw new AppError('Role name required', 400);

            const existingRole = await tx.role.findFirst({
                where: { roleName: roleData.roleName }
            });

            if (existingRole) {
                throw new AppError('Role already exists', 409);
            }

            const role = await tx.role.create({
                data: {
                    roleId: this._generateRoleId(),
                    roleName: roleData.roleName,
                    roleDescription: roleData.roleDescription || null,
                    isActive: true,
                    createdAt: new Date()
                }
            });

            // Assign permissions if provided
            if (roleData.permissionIds && Array.isArray(roleData.permissionIds)) {
                for (const permId of roleData.permissionIds) {
                    await tx.rolePermission.create({
                        data: {
                            roleId: role.roleId,
                            permissionId: permId
                        }
                    });
                }
            }

            await this.auditLogService.logAction({
                action: 'ROLE_CREATED',
                entityType: 'Role',
                entityId: role.roleId,
                userId: 'ADMIN',
                details: { roleName: roleData.roleName }
            });

            return { success: true, message: 'Role created', role: role };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async getRoleById(roleId) {
        try {
            if (!roleId) throw new AppError('Role ID required', 400);

            const role = await prisma.role.findUnique({
                where: { roleId },
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            });

            if (!role) throw new AppError('Role not found', 404);

            return { success: true, role: role };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async listRoles(filters) {
        try {
            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = {};

            if (filters && filters.isActive !== undefined) where.isActive = filters.isActive;

            const roles = await prisma.role.findMany({
                where: where,
                include: [{
                    model: Permission,
                    through: { attributes: [] },
                    attributes: ['permissionName']
                }],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await prisma.role.count({ where });

            return {
                success: true,
                roles: roles,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateRole(roleId, updateData) {
        const result = await prisma.$transaction(async(tx) => {
            if (!roleId || !updateData) throw new AppError('Required params missing', 400);

            const role = await tx.role.findUnique({
                where: { roleId }
            });
            if (!role) {
                throw new AppError('Role not found', 404);
            }

            const updatedRole = await tx.role.update({
                where: { roleId },
                data: {
                    roleName: updateData.roleName || role.roleName,
                    roleDescription: updateData.roleDescription || role.roleDescription
                }
            });

            await this.auditLogService.logAction({
                action: 'ROLE_UPDATED',
                entityType: 'Role',
                entityId: roleId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Role updated', role: updatedRole };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async deleteRole(roleId) {
        const result = await prisma.$transaction(async(tx) => {
            if (!roleId) throw new AppError('Role ID required', 400);

            const role = await tx.role.findUnique({
                where: { roleId }
            });
            if (!role) {
                throw new AppError('Role not found', 404);
            }

            const usersWithRole = await tx.user.count({ where: { roleId: roleId } });
            if (usersWithRole > 0) {
                throw new AppError('Cannot delete role with assigned users', 400);
            }

            await tx.rolePermission.deleteMany({ where: { roleId: roleId } });
            await tx.role.delete({ where: { roleId } });

            await this.auditLogService.logAction({
                action: 'ROLE_DELETED',
                entityType: 'Role',
                entityId: roleId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Role deleted' };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ROLE PERMISSIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async assignPermissionToRole(roleId, permissionId) {
        const result = await prisma.$transaction(async(tx) => {
            if (!roleId || !permissionId) throw new AppError('Role and permission IDs required', 400);

            const role = await tx.role.findUnique({
                where: { roleId }
            });
            if (!role) {
                throw new AppError('Role not found', 404);
            }

            const permission = await tx.permission.findUnique({
                where: { permissionId }
            });
            if (!permission) {
                throw new AppError('Permission not found', 404);
            }

            const existing = await tx.rolePermission.findFirst({
                where: { roleId: roleId, permissionId: permissionId }
            });

            if (existing) {
                throw new AppError('Permission already assigned', 409);
            }

            await tx.rolePermission.create({
                data: {
                    roleId: roleId,
                    permissionId: permissionId
                }
            });

            await this.auditLogService.logAction({
                action: 'PERMISSION_ASSIGNED_TO_ROLE',
                entityType: 'RolePermission',
                entityId: roleId + '-' + permissionId,
                userId: 'ADMIN',
                details: { permissionId: permissionId }
            });

            return { success: true, message: 'Permission assigned' };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async removePermissionFromRole(roleId, permissionId) {
        const result = await prisma.$transaction(async(tx) => {
            if (!roleId || !permissionId) throw new AppError('Required params missing', 400);

            const rolePermission = await tx.rolePermission.findFirst({
                where: { roleId: roleId, permissionId: permissionId }
            });

            if (!rolePermission) {
                throw new AppError('Permission not assigned to this role', 404);
            }

            await tx.rolePermission.delete({
                where: {
                    roleId_permissionId: {
                        roleId: roleId,
                        permissionId: permissionId
                    }
                }
            });

            await this.auditLogService.logAction({
                action: 'PERMISSION_REMOVED_FROM_ROLE',
                entityType: 'RolePermission',
                entityId: roleId + '-' + permissionId,
                userId: 'ADMIN',
                details: {}
            });

            return { success: true, message: 'Permission removed' };
        }).catch(error => {
            throw this.errorHandlingService.handleError(error);
        });
        return result;
    }

    async getRolePermissions(roleId) {
        try {
            if (!roleId) throw new AppError('Role ID required', 400);

            const permissions = await prisma.rolePermission.findMany({
                where: { roleId: roleId },
                include: {
                    permission: {
                        select: {
                            permissionId: true,
                            permissionName: true,
                            permissionDescription: true
                        }
                    }
                }
            });

            return { success: true, permissions: permissions, total: permissions.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateRoleId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'ROLE-' + ts + rnd;
    }
}

export default new RoleService();