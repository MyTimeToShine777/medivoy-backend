'use strict';

import { Op, sequelize } from 'sequelize';
import { User, UserPreference, UserAddress, AuditLog } from '../models/index.js';
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

            const user = await User.findByPk(userId, {
                include: [
                    { model: UserPreference, attributes: ['prefId', 'emailNotifications', 'smsNotifications'] },
                    { model: UserAddress, attributes: ['addressId', 'addressLine1', 'city', 'state', 'country'] }
                ],
                attributes: { exclude: ['password'] }
            });

            if (!user) throw new AppError('User not found', 404);

            return { success: true, user: user };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateUserProfile(userId, updateData) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !updateData) throw new AppError('Required params missing', 400);

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
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

            await user.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'USER_PROFILE_UPDATED',
                entityType: 'User',
                entityId: userId,
                userId: userId,
                details: { changes: previousData }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Profile updated', user: user };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async changePassword(userId, oldPassword, newPassword) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !oldPassword || !newPassword) {
                throw new AppError('All parameters required', 400);
            }

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                await transaction.rollback();
                throw new AppError('Invalid old password', 400);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.passwordChangedAt = new Date();
            await user.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'PASSWORD_CHANGED',
                entityType: 'User',
                entityId: userId,
                userId: userId,
                details: {}
            }, transaction);

            await this.notificationService.sendNotification(userId, 'PASSWORD_CHANGED', {});

            await transaction.commit();

            return { success: true, message: 'Password changed' };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER PREFERENCES
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserPreferences(userId) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const preferences = await UserPreference.findOne({ where: { userId: userId } });

            if (!preferences) {
                return { success: true, preferences: this._getDefaultPreferences() };
            }

            return { success: true, preferences: preferences };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateUserPreferences(userId, preferencesData) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !preferencesData) throw new AppError('Required params missing', 400);

            let preferences = await UserPreference.findOne({ where: { userId: userId }, transaction: transaction });

            if (!preferences) {
                preferences = await UserPreference.create({
                    prefId: this._generatePrefId(),
                    userId: userId,
                    ...preferencesData
                }, { transaction: transaction });
            } else {
                Object.assign(preferences, preferencesData);
                await preferences.save({ transaction: transaction });
            }

            await this.auditLogService.logAction({
                action: 'PREFERENCES_UPDATED',
                entityType: 'UserPreference',
                entityId: preferences.prefId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Preferences updated', preferences: preferences };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER ADDRESSES
    // ═══════════════════════════════════════════════════════════════════════════════

    async addUserAddress(userId, addressData) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !addressData) throw new AppError('Required params missing', 400);

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            const address = await UserAddress.create({
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
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'ADDRESS_ADDED',
                entityType: 'UserAddress',
                entityId: address.addressId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Address added', address: address };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getUserAddresses(userId) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const addresses = await UserAddress.findAll({
                where: { userId: userId },
                order: [
                    ['isDefault', 'DESC'],
                    ['createdAt', 'DESC']
                ]
            });

            return { success: true, addresses: addresses, total: addresses.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateUserAddress(addressId, userId, updateData) {
        const transaction = await sequelize.transaction();
        try {
            if (!addressId || !userId) throw new AppError('Required params missing', 400);

            const address = await UserAddress.findOne({
                where: { addressId: addressId, userId: userId },
                transaction: transaction
            });

            if (!address) {
                await transaction.rollback();
                throw new AppError('Address not found', 404);
            }

            const allowedFields = ['addressLine1', 'addressLine2', 'city', 'state', 'country', 'postalCode', 'addressType', 'isDefault'];
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    address[field] = updateData[field];
                }
            }

            await address.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'ADDRESS_UPDATED',
                entityType: 'UserAddress',
                entityId: addressId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Address updated', address: address };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async deleteUserAddress(addressId, userId) {
        const transaction = await sequelize.transaction();
        try {
            if (!addressId || !userId) throw new AppError('Required params missing', 400);

            const address = await UserAddress.findOne({
                where: { addressId: addressId, userId: userId },
                transaction: transaction
            });

            if (!address) {
                await transaction.rollback();
                throw new AppError('Address not found', 404);
            }

            await address.destroy({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'ADDRESS_DELETED',
                entityType: 'UserAddress',
                entityId: addressId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Address deleted' };
        } catch (error) {
            await transaction.rollback();
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

            const users = await User.findAll({
                where: where,
                attributes: { exclude: ['password'] },
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await User.count({ where: where });

            return {
                success: true,
                users: users,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async deactivateUser(userId, reason) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            user.isActive = false;
            user.deactivatedAt = new Date();
            user.deactivationReason = reason || null;
            await user.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'USER_DEACTIVATED',
                entityType: 'User',
                entityId: userId,
                userId: 'ADMIN',
                details: { reason: reason }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'User deactivated' };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async reactivateUser(userId) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            user.isActive = true;
            user.deactivatedAt = null;
            user.deactivationReason = null;
            await user.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'USER_REACTIVATED',
                entityType: 'User',
                entityId: userId,
                userId: 'ADMIN',
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'User reactivated' };
        } catch (error) {
            await transaction.rollback();
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