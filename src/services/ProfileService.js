'use strict';

import prisma from '../config/prisma.js';

export class ProfileService {
    /**
     * GET PROFILE BY USER ID
     */
    async getProfile(userId) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID is required' };
            }



            const profile = await prisma.profile.findFirst({
                where: { userId }
            });

            if (!profile) {
                return { success: false, error: 'Profile not found' };
            }

            return {
                success: true,
                data: profile
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE PROFILE
     */
    async updateProfile(userId, updateData) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID is required' };
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return { success: false, error: 'Update data is required' };
            }



            const profile = await Profile.findOne({ where: { userId } });

            if (!profile) {
                return { success: false, error: 'Profile not found' };
            }

            // Update profile
            const updated = await prisma.profile.update({ where: { userId }, data: updateData });

            return {
                success: true,
                data: profile,
                message: 'Profile updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * CREATE PROFILE
     */
    async createProfile(userId, profileData) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID is required' };
            }



            // Check if profile already exists
            const existingProfile = await Profile.findOne({ where: { userId } });

            if (existingProfile) {
                return { success: false, error: 'Profile already exists for this user' };
            }

            const profile = await prisma.profile.create({
                data: {
                    userId,
                    ...profileData
                }
            });

            return {
                success: true,
                data: profile,
                message: 'Profile created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * DELETE PROFILE
     */
    async deleteProfile(userId) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID is required' };
            }



            const deleted = await Profile.destroy({ where: { userId } });

            if (deleted === 0) {
                return { success: false, error: 'Profile not found' };
            }

            return {
                success: true,
                message: 'Profile deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new ProfileService();