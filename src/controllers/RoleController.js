'use strict';

import roleService from '../services/RoleService.js';
import permissionService from '../services/PermissionService.js';

export class RoleController {
    constructor() {
        this.roleService = roleService;
        this.permissionService = permissionService;
    }

    async createRole(req, res) {
        try {
            const roleData = req.body;

            const result = await this.roleService.createRole(roleData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Role created',
                data: result.role
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getRoleById(req, res) {
        try {
            const roleId = req.params.roleId;

            const result = await this.roleService.getRoleById(roleId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.role
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listRoles(req, res) {
        try {
            const filters = {
                isActive: req.query.isActive === 'true' ? true : undefined,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.roleService.listRoles(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.roles,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateRole(req, res) {
        try {
            const roleId = req.params.roleId;
            const updateData = req.body;

            const result = await this.roleService.updateRole(roleId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Role updated',
                data: result.role
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteRole(req, res) {
        try {
            const roleId = req.params.roleId;

            const result = await this.roleService.deleteRole(roleId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Role deleted'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async assignPermissionToRole(req, res) {
        try {
            const roleId = req.params.roleId;
            const permissionId = req.body.permissionId;

            const result = await this.roleService.assignPermissionToRole(roleId, permissionId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Permission assigned'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async removePermissionFromRole(req, res) {
        try {
            const roleId = req.params.roleId;
            const permissionId = req.params.permissionId;

            const result = await this.roleService.removePermissionFromRole(roleId, permissionId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Permission removed'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getRolePermissions(req, res) {
        try {
            const roleId = req.params.roleId;

            const result = await this.roleService.getRolePermissions(roleId);

            if (!result.success) {
                return res.status(404).json(result);
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

export default new RoleController();