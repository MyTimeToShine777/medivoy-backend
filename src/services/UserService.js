'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { NotificationService } from './NotificationService.js';
import { AppError } from '../utils/errors/AppError.js';
import bcrypt from 'bcryptjs';

export class UserService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
        this.notificationService = new NotificationService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER PROFILE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserProfile(userId) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const user = await prisma.user.findUnique({ where: { id: userId, {
                include: {
                    userPreference: {
                        select: { prefId: true, emailNotifications: true, smsNotifications: true }
                    },
                    userAddress: {
                        select: { addressId: true, addressLine1: true, city: true, state: true, country: true }
                    }
                },
                attributes: { exclude: ['password'] }
            } } });

            if (!user) throw new AppError('User not found', 404);

            return { success: true, user: user };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateUserProfile(userId, updateData) {
        // Using Prisma transaction
        try {
            if (!userId || !updateData) throw new AppError('Required params missing', 400);

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                
                throw new AppError('User not found', 404);
            }

            const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'profileImage'];
            const previousData = {};

            for (const field of allowedFields) {
                if (updateData[field]) {
                    previousData[field] = user[field];
                    user[field] = updateData[field];
                }
            }

            // FIXME: Convert to: await prisma.user.update({ where: { userId: user.userId }, data: { /* fields */ } });

            await this.auditLogService.logAction({
                action: 'USER_PROFILE_UPDATED',
                entityType: 'User',
                entityId: userId,
                userId: userId,
                details: { changes: previousData }
            }, transaction);

            return { success: true, message: 'Profile updated', user: user };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    async changePassword(userId, oldPassword, newPassword) {
        // Using Prisma transaction
        try {
            if (!userId || !oldPassword || !newPassword) {
                throw new AppError('All parameters required', 400);
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                
                throw new AppError('User not found', 404);
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                
                throw new AppError('Invalid old password', 400);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.passwordChangedAt = new Date();
            await prisma.user.update({
                where: { userId: user.userId },
                data: { password: hashedPassword, passwordChangedAt: new Date() }
            });

            await this.auditLogService.logAction({
                action: 'PASSWORD_CHANGED',
                entityType: 'User',
                entityId: userId,
                userId: userId,
                details: {}
            }, transaction);

            await this.notificationService.sendNotification(userId, 'PASSWORD_CHANGED', {});

            return { success: true, message: 'Password changed' };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER PREFERENCES
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserPreferences(userId) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const preferences = await prisma.userPreference.findFirst({ where: { userId: userId } });

            if (!preferences) {
                return { success: true, preferences: this._getDefaultPreferences() };
            }

            return { success: true, preferences: preferences };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateUserPreferences(userId, preferencesData) {
        // Using Prisma transaction
        try {
            if (!userId || !preferencesData) throw new AppError('Required params missing', 400);

            let preferences = await prisma.userPreference.findFirst({ where: { userId: userId } });

            if (!preferences) {
                preferences = await prisma.userPreference.create({ data: {
                    prefId: this._generatePrefId(),
                    userId: userId,
                    ...preferencesData
                });
            } else {
                Object.assign(preferences, preferencesData);
                // FIXME: Convert to: await prisma.preferences.update({ where: { preferencesId: preferences.preferencesId }, data: { /* fields */ } });
            }

            await this.auditLogService.logAction({
                action: 'PREFERENCES_UPDATED',
                entityType: 'UserPreference',
                entityId: preferences.prefId,
                userId: userId,
                details: {}
            }, transaction);

            return { success: true, message: 'Preferences updated', preferences: preferences };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER ADDRESSES
    // ═══════════════════════════════════════════════════════════════════════════════

    async addUserAddress(userId, addressData) {
        // Using Prisma transaction
        try {
            if (!userId || !addressData) throw new AppError('Required params missing', 400);

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                
                throw new AppError('User not found', 404);
            }

            const address = await prisma.userAddress.create({ data: {
                addressId: this._generateAddressId(),
                userId: userId,
                addressLine1: addressData.addressLine1,
                addressLine2: addressData.addressLine2 || null,
                city: addressData.city,
                state: addressData.state,
                country: addressData.country,
                postalCode: addressData.postalCode,
                addressType: addressData.addressType || 'home',
                isDefault: addressData.isDefault || false
            });

            await this.auditLogService.logAction({
                action: 'ADDRESS_ADDED',
                entityType: 'UserAddress',
                entityId: address.addressId,
                userId: userId,
                details: {}
            }, transaction);

            return { success: true, message: 'Address added', address: address };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getUserAddresses(userId) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const addresses = await prisma.userAddress.findMany({
                where: { userId: userId },
                orderBy: [
                    { isDefault: 'desc' }, { createdAt: 'desc' }
                ]
            });

            return { success: true, addresses: addresses, total: addresses.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateUserAddress(addressId, userId, updateData) {
        // Using Prisma transaction
        try {
            if (!addressId || !userId) throw new AppError('Required params missing', 400);

            const address = await prisma.userAddress.findFirst({
                where: { addressId: addressId, userId: userId },
                transaction: transaction
            });

            if (!address) {
                
                throw new AppError('Address not found', 404);
            }

            const allowedFields = ['addressLine1', 'addressLine2', 'city', 'state', 'country', 'postalCode', 'addressType', 'isDefault'];
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    address[field] = updateData[field];
                }
            }

            // FIXME: Convert to: await prisma.address.update({ where: { addressId: address.addressId }, data: { /* fields */ } });

            await this.auditLogService.logAction({
                action: 'ADDRESS_UPDATED',
                entityType: 'UserAddress',
                entityId: addressId,
                userId: userId,
                details: {}
            }, transaction);

            return { success: true, message: 'Address updated', address: address };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    async deleteUserAddress(addressId, userId) {
        // Using Prisma transaction
        try {
            if (!addressId || !userId) throw new AppError('Required params missing', 400);

            const address = await prisma.userAddress.findFirst({
                where: { addressId: addressId, userId: userId },
                transaction: transaction
            });

            if (!address) {
                
                throw new AppError('Address not found', 404);
            }

            await prisma.address.delete();

            await this.auditLogService.logAction({
                action: 'ADDRESS_DELETED',
                entityType: 'UserAddress',
                entityId: addressId,
                userId: userId,
                details: {}
            }, transaction);

            return { success: true, message: 'Address deleted' };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER MANAGEMENT (Admin)
    // ═══════════════════════════════════════════════════════════════════════════════

    async listUsers(filters) {
        try {
            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = {};

            if (filters && filters.userType) where.userType = filters.userType;
            if (filters && filters.isActive !== undefined) where.isActive = filters.isActive;

            const users = await prisma.user.findMany({
                where: where,
                attributes: { exclude: ['password'] },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset
            });

            const total = await prisma.user.count({ where: where });

            return {
                success: true,
                users: users,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async deactivateUser(userId, reason) {
        // Using Prisma transaction
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                
                throw new AppError('User not found', 404);
            }

            user.isActive = false;
            user.deactivatedAt = new Date();
            user.deactivationReason = reason || null;
            await prisma.user.update({
                where: { userId: user.userId },
                data: { isActive: false, deactivatedAt: new Date(), deactivationReason: reason || null }
            });

            await this.auditLogService.logAction({
                action: 'USER_DEACTIVATED',
                entityType: 'User',
                entityId: userId,
                userId: 'ADMIN',
                details: { reason: reason }
            }, transaction);

            return { success: true, message: 'User deactivated' };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    async reactivateUser(userId) {
        // Using Prisma transaction
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                
                throw new AppError('User not found', 404);
            }

            user.isActive = true;
            user.deactivatedAt = null;
            user.deactivationReason = null;
            await prisma.user.update({
                where: { userId: user.userId },
                data: { isActive: true, deactivatedAt: null, deactivationReason: null }
            });

            await this.auditLogService.logAction({
                action: 'USER_REACTIVATED',
                entityType: 'User',
                entityId: userId,
                userId: 'ADMIN',
                details: {}
            }, transaction);

            return { success: true, message: 'User reactivated' };
        } catch (error) {
            
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generatePrefId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'PREF-' + ts + rnd;
    }

    _generateAddressId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'ADDR-' + ts + rnd;
    }

    _getDefaultPreferences() {
        return {
            emailNotifications: true,
            smsNotifications: true,
            bookingNotifications: true,
            appointmentReminders: true,
            language: 'en',
            timezone: 'UTC'
        };
    }
}

export default UserService;