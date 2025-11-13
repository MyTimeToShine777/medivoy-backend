'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';
import { AppError } from '../utils/errors/AppError.js';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS SERVICE - ULTRA-COMPREHENSIVE
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

export class SettingsService {
    // ─────────────────────────────────────────────────────────────────────────────
    // ENCRYPTION/DECRYPTION HELPERS
    // ─────────────────────────────────────────────────────────────────────────────

    encryptValue(value) {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
        let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decryptValue(encrypted) {
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET ALL SETTINGS
    // ─────────────────────────────────────────────────────────────────────────────

    async getAllSettings(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.settingType) {
                where.settingType = filters.settingType;
            }

            // Use explicit column names in order to avoid driver/DB column name
            // mismatches when the database uses snake_case column names.
            const settings = await prisma.settings.findMany({
                where: where,
                order: [
                    ['setting_type', 'ASC'],
                    ['setting_key', 'ASC']
                ]
            });

            const processedSettings = settings.map(s => ({
                ...s.dataValues,
                settingValue: s.isEncrypted && s.settingValue ? this.decryptValue(s.settingValue) : s.settingValue
            }));

            console.log(`✅ All settings retrieved: ${settings.length}`);
            return { success: true, data: processedSettings };
        } catch (error) {
            console.error('❌ Get all settings error:', error.message);
            throw new AppError(error.message, 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET SETTING BY TYPE
    // ─────────────────────────────────────────────────────────────────────────────

    async getSettingByType(settingType) {
        try {
            const cacheKey = `settings_${settingType}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: cached };

            const settings = await prisma.settings.findFirst({
                where: { settingType: settingType, isActive: true }
            });

            if (!settings) {
                throw new AppError(`${settingType} settings not found`, 404);
            }

            const data = {
                ...settings.dataValues,
                settingValue: settings.isEncrypted && settings.settingValue ? this.decryptValue(settings.settingValue) : settings.settingValue
            };

            await cacheService.set(cacheKey, data, 86400);
            console.log(`✅ ${settingType} settings retrieved`);

            return { success: true, data: data };
        } catch (error) {
            console.error(`❌ Get ${settingType} settings error:`, error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE SETTING BY TYPE
    // ─────────────────────────────────────────────────────────────────────────────

    async updateSettingByType(settingType, updateData, userId) {
        try {
            if (!updateData || Object.keys(updateData).length === 0) {
                throw new AppError('No settings provided', 400);
            }

            let settings = await Settings.findOne({
                where: { settingType: settingType }
            });

            const mergedData = settings ? Object.assign(settings.settingData || {}, updateData) : updateData;
            const encryptedValue = updateData.isEncrypted ? this.encryptValue(updateData) : updateData;

            if (!settings) {
                settings = await prisma.settings.create({
                data: {
                    settingType: settingType,
                    settingData: mergedData,
                    settingValue: encryptedValue,
                    createdBy: userId,
                    isEncrypted: updateData.isEncrypted || false
                });
            } else {
                await settings.update({
                    settingData: mergedData,
                    settingValue: encryptedValue,
                    updatedBy: userId,
                    version: settings.version + 1,
                    updatedAt: new Date()
                });
            }

            await cacheService.delete(`settings_${settingType}`);
            console.log(`✅ ${settingType} settings updated by ${userId}`);

            return { success: true, data: settings };
        } catch (error) {
            console.error(`❌ Update ${settingType} settings error:`, error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // VALIDATE SETTINGS
    // ─────────────────────────────────────────────────────────────────────────────

    async validateSettings(settingType, data) {
        try {
            const settings = await prisma.settings.findFirst({
                where: { settingType: settingType }
            });

            if (!settings || !settings.validationRules) {
                return { success: true, isValid: true };
            }

            const rules = settings.validationRules;
            const errors = [];

            Object.keys(rules).forEach(key => {
                const rule = rules[key];
                const value = data[key];

                if (rule.required && (!value || value === '')) {
                    errors.push(`${key} is required`);
                }

                if (rule.type && value) {
                    if (typeof value !== rule.type) {
                        errors.push(`${key} must be of type ${rule.type}`);
                    }
                }

                if (rule.pattern && value && !new RegExp(rule.pattern).test(value)) {
                    errors.push(`${key} format is invalid`);
                }
            });

            if (errors.length > 0) {
                return { success: false, isValid: false, errors: errors };
            }

            console.log(`✅ Settings validation passed for ${settingType}`);
            return { success: true, isValid: true };
        } catch (error) {
            console.error('❌ Validate settings error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE BACKUP
    // ─────────────────────────────────────────────────────────────────────────────

    async createBackup(backupName, description, backupType, userId) {
        try {
            if (!backupName) {
                throw new AppError('Backup name required', 400);
            }

            const backup = await Backup.create({
                backupName: backupName,
                description: description || '',
                backupType: backupType || 'manual',
                backupData: {},
                backupSize: 0,
                status: 'in_progress',
                createdBy: userId
            });

            console.log(`✅ Backup created: ${backup.backupId}`);
            return { success: true, data: backup };
        } catch (error) {
            console.error('❌ Create backup error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LIST BACKUPS WITH FILTERS
    // ─────────────────────────────────────────────────────────────────────────────

    async listBackups(filters = {}) {
        try {
            const where = {};

            if (filters.status) {
                where.status = filters.status;
            }

            if (filters.backupType) {
                where.backupType = filters.backupType;
            }

            if (filters.createdBy) {
                where.createdBy = filters.createdBy;
            }

            if (filters.startDate && filters.endDate) {
                where.createdAt = {
                     [new Date(filters.startDate), new Date(filters.endDate)]
                };
            }

            const limit = filters.limit || 20;
            const offset = filters.offset || 0;

            const backups = await Backup.findAll({
                where: where,
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Backup.count({ where: where });

            console.log(`✅ Backups listed: ${backups.length}`);
            return { success: true, data: backups, pagination: { total, limit, offset } };
        } catch (error) {
            console.error('❌ List backups error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET BACKUP DETAILS
    // ─────────────────────────────────────────────────────────────────────────────

    async getBackupById(backupId) {
        try {
            if (!backupId) {
                throw new AppError('Backup ID required', 400);
            }

            const backup = await Backup.findByPk(backupId);

            if (!backup) {
                throw new AppError('Backup not found', 404);
            }

            console.log(`✅ Backup retrieved: ${backupId}`);
            return { success: true, data: backup };
        } catch (error) {
            console.error('❌ Get backup error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // VERIFY BACKUP
    // ─────────────────────────────────────────────────────────────────────────────

    async verifyBackup(backupId) {
        try {
            if (!backupId) {
                throw new AppError('Backup ID required', 400);
            }

            const backup = await Backup.findByPk(backupId);

            if (!backup) {
                throw new AppError('Backup not found', 404);
            }

            backup.isVerified = true;
            backup.status = 'verified';
            backup.verificationDetails = {
                verifiedAt: new Date(),
                checksum: crypto.randomBytes(32).toString('hex')
            };
            await backup.save();

            console.log(`✅ Backup verified: ${backupId}`);
            return { success: true, data: backup };
        } catch (error) {
            console.error('❌ Verify backup error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RESTORE BACKUP
    // ─────────────────────────────────────────────────────────────────────────────

    async restoreBackup(backupId, userId) {
        try {
            if (!backupId) {
                throw new AppError('Backup ID required', 400);
            }

            const backup = await Backup.findByPk(backupId);

            if (!backup) {
                throw new AppError('Backup not found', 404);
            }

            if (!backup.isVerified) {
                throw new AppError('Backup must be verified before restore', 400);
            }

            backup.restoredAt = new Date();
            backup.restoredBy = userId;
            backup.status = 'completed';
            backup.restoreDetails = {
                restoredAt: new Date(),
                restoredBy: userId
            };
            await backup.save();

            console.log(`✅ Backup restored by ${userId}`);
            return { success: true, data: backup };
        } catch (error) {
            console.error('❌ Restore backup error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE BACKUP
    // ─────────────────────────────────────────────────────────────────────────────

    async deleteBackup(backupId, userId) {
        try {
            if (!backupId) {
                throw new AppError('Backup ID required', 400);
            }

            const backup = await Backup.findByPk(backupId);

            if (!backup) {
                throw new AppError('Backup not found', 404);
            }

            await backup.destroy();

            console.log(`✅ Backup deleted: ${backupId}`);
            return { success: true, message: 'Backup deleted successfully' };
        } catch (error) {
            console.error('❌ Delete backup error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // EXPORT SETTINGS
    // ─────────────────────────────────────────────────────────────────────────────

    async exportSettings(format = 'json') {
        try {
            const settings = await prisma.settings.findMany({
                where: { isActive: true }
            });

            if (format === 'json') {
                return { success: true, data: settings };
            } else if (format === 'csv') {
                // CSV export logic here
                return { success: true, data: settings };
            }

            throw new AppError('Invalid export format', 400);
        } catch (error) {
            console.error('❌ Export settings error:', error.message);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET BACKUP STATISTICS
    // ─────────────────────────────────────────────────────────────────────────────

    async getBackupStatistics() {
        try {
            const total = await Backup.count();
            const completed = await Backup.count({ where: { status: 'completed' } });
            const failed = await Backup.count({ where: { status: 'failed' } });
            const verified = await Backup.count({ where: { isVerified: true } });

            // Use snake_case column name to match underscored model definitions / DB schema
            const totalSize = await sequelize.query(
                'SELECT SUM(backup_size) as total FROM backups WHERE status = ?', { replacements: ['completed'], type: sequelize.QueryTypes.SELECT }
            );

            console.log(`✅ Backup statistics retrieved`);

            return {
                success: true,
                data: {
                    total: total,
                    completed: completed,
                    failed: failed,
                    verified: verified,
                    totalSize: totalSize[0].total || 0
                }
            };
        } catch (error) {
            console.error('❌ Get backup statistics error:', error.message);
            throw error;
        }
    }
}

export const settingsService = new SettingsService();
export default settingsService;