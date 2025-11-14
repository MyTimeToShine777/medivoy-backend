'use strict';

import permissionService from '../services/PermissionService.js';

export class PermissionController {
    constructor() {
        this.permissionService = permissionService;
    }

    async createPermission(req, res) {
        try {
            const permissionData = req.body;

            const result = await this.permissionService.createPermission(permissionData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Permission created',
                data: result.permission
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPermissionById(req, res) {
        try {
            const permissionId = req.params.permissionId;

            const result = await this.permissionService.getPermissionById(permissionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.permission
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listPermissions(req, res) {
        try {
            const filters = {
                module: req.query.module,
                action: req.query.action,
                isActive: req.query.isActive === 'true' ? true : undefined,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.permissionService.listPermissions(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.permissions,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updatePermission(req, res) {
        try {
            const permissionId = req.params.permissionId;
            const updateData = req.body;

            const result = await this.permissionService.updatePermission(permissionId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Permission updated',
                data: result.permission
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deletePermission(req, res) {
        try {
            const permissionId = req.params.permissionId;

            const result = await this.permissionService.deletePermission(permissionId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Permission deleted'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserPermissions(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.permissionService.getUserPermissions(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.permissions,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async checkUserPermission(req, res) {
        try {
            const userId = req.user.userId;
            const requiredPermission = req.query.permission;

            const result = await this.permissionService.checkUserPermission(userId, requiredPermission);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                hasPermission: result.hasPermission
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async checkMultiplePermissions(req, res) {
        try {
            const userId = req.user.userId;
            const requiredPermissions = req.body.permissions;

            const result = await this.permissionService.checkMultiplePermissions(userId, requiredPermissions);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                hasAllPermissions: result.hasAllPermissions,
                hasAnyPermission: result.hasAnyPermission,
                missingPermissions: result.missingPermissions
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPermissionsByModule(req, res) {
        try {
            const module = req.params.module;

            const result = await this.permissionService.getPermissionsByModule(module);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.permissions,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new PermissionController();