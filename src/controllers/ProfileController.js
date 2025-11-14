'use strict';

import profileService from '../services/ProfileService.js';

export class ProfileController {
    constructor() {
        this.profileService = profileService;
    }

    /**
     * GET USER PROFILE
     */
    async getProfile(req, res) {
        try {
            const userId = req.user.userId;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
            }

            const result = await this.profileService.getProfile(userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE PROFILE
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const updateData = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Update data is required'
                });
            }

            const result = await this.profileService.updateProfile(userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * CREATE PROFILE
     */
    async createProfile(req, res) {
        try {
            const userId = req.user.userId;
            const profileData = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
            }

            const result = await this.profileService.createProfile(userId, profileData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Profile created successfully',
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * DELETE PROFILE
     */
    async deleteProfile(req, res) {
        try {
            const userId = req.user.userId;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
            }

            const result = await this.profileService.deleteProfile(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Profile deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new ProfileController();