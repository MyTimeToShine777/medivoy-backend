'use strict';

import userService from '../services/UserService.js';

export class UserController {
    constructor() {
        this.userService = userService;
    }

    async getUserProfile(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.userService.getUserProfile(userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.user
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateUserProfile(req, res) {
        try {
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.userService.updateUserProfile(userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Profile updated',
                data: result.user
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const userId = req.user.userId;
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;

            const result = await this.userService.changePassword(userId, oldPassword, newPassword);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Password changed'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserPreferences(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.userService.getUserPreferences(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.preferences
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateUserPreferences(req, res) {
        try {
            const userId = req.user.userId;
            const preferencesData = req.body;

            const result = await this.userService.updateUserPreferences(userId, preferencesData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Preferences updated',
                data: result.preferences
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async addUserAddress(req, res) {
        try {
            const userId = req.user.userId;
            const addressData = req.body;

            const result = await this.userService.addUserAddress(userId, addressData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Address added',
                data: result.address
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserAddresses(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.userService.getUserAddresses(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.addresses,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateUserAddress(req, res) {
        try {
            const addressId = req.params.addressId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.userService.updateUserAddress(addressId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Address updated',
                data: result.address
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteUserAddress(req, res) {
        try {
            const addressId = req.params.addressId;
            const userId = req.user.userId;

            const result = await this.userService.deleteUserAddress(addressId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Address deleted'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listUsers(req, res) {
        try {
            const filters = {
                userType: req.query.userType,
                isActive: req.query.isActive === 'true',
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.userService.listUsers(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deactivateUser(req, res) {
        try {
            const userId = req.params.userId;
            const reason = req.body.reason;

            const result = await this.userService.deactivateUser(userId, reason);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'User deactivated'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async reactivateUser(req, res) {
        try {
            const userId = req.params.userId;

            const result = await this.userService.reactivateUser(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'User reactivated'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new UserController();