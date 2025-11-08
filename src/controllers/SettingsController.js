'use strict';

import { settingsService } from '../services/SettingsService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';
import { AppError } from '../utils/errors/AppError.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS CONTROLLER - ULTRA-COMPREHENSIVE
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

export class SettingsController {
    // GET ALL SETTINGS
    async getAllSettings(req, res, next) {
        try {
            const result = await settingsService.getAllSettings();
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ Get all settings error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // GET SYSTEM SETTINGS
    async getSystemSettings(req, res, next) {
        try {
            const result = await settingsService.getSettingByType('general');
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // UPDATE SYSTEM SETTINGS
    async updateSystemSettings(req, res, next) {
        try {
            const result = await settingsService.updateSettingByType('general', req.body, req.user.userId);
            return res.status(200).json(ResponseFormatter.success(result.data, 'Settings updated'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // GET EMAIL SETTINGS
    async getEmailSettings(req, res, next) {
        try {
            const result = await settingsService.getSettingByType('email');
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // UPDATE EMAIL SETTINGS
    async updateEmailSettings(req, res, next) {
        try {
            const result = await settingsService.updateSettingByType('email', req.body, req.user.userId);
            return res.status(200).json(ResponseFormatter.success(result.data, 'Email settings updated'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // GET SMS SETTINGS
    async getSMSSettings(req, res, next) {
        try {
            const result = await settingsService.getSettingByType('sms');
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // UPDATE SMS SETTINGS
    async updateSMSSettings(req, res, next) {
        try {
            const result = await settingsService.updateSettingByType('sms', req.body, req.user.userId);
            return res.status(200).json(ResponseFormatter.success(result.data, 'SMS settings updated'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // GET PAYMENT SETTINGS
    async getPaymentSettings(req, res, next) {
        try {
            const result = await settingsService.getSettingByType('payment');
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // UPDATE PAYMENT SETTINGS
    async updatePaymentSettings(req, res, next) {
        try {
            const result = await settingsService.updateSettingByType('payment', req.body, req.user.userId);
            return res.status(200).json(ResponseFormatter.success(result.data, 'Payment settings updated'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // GET SECURITY SETTINGS
    async getSecuritySettings(req, res, next) {
        try {
            const result = await settingsService.getSettingByType('security');
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // VALIDATE SETTINGS
    async validateSettings(req, res, next) {
        try {
            if (!req.body.settingType) {
                return res.status(400).json(ResponseFormatter.error('Setting type required', 400));
            }

            const result = await settingsService.validateSettings(req.body.settingType, req.body.data);
            return res.status(200).json(ResponseFormatter.success(result));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // CREATE BACKUP
    async createBackup(req, res, next) {
        try {
            const result = await settingsService.createBackup(
                req.body.backupName,
                req.body.description,
                req.body.backupType,
                req.user.userId
            );
            return res.status(201).json(ResponseFormatter.created(result.data, 'Backup created'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // LIST BACKUPS
    async listBackups(req, res, next) {
        try {
            const result = await settingsService.listBackups(req.query);
            return res.status(200).json(ResponseFormatter.success(result.data, 'Backups retrieved', result.pagination));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // GET BACKUP
    async getBackupById(req, res, next) {
        try {
            const result = await settingsService.getBackupById(req.params.backupId);
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // VERIFY BACKUP
    async verifyBackup(req, res, next) {
        try {
            const result = await settingsService.verifyBackup(req.params.backupId);
            return res.status(200).json(ResponseFormatter.success(result.data, 'Backup verified'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // RESTORE BACKUP
    async restoreBackup(req, res, next) {
        try {
            const result = await settingsService.restoreBackup(req.params.backupId, req.user.userId);
            return res.status(200).json(ResponseFormatter.success(result.data, 'Backup restored'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // DELETE BACKUP
    async deleteBackup(req, res, next) {
        try {
            const result = await settingsService.deleteBackup(req.params.backupId, req.user.userId);
            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // EXPORT SETTINGS
    async exportSettings(req, res, next) {
        try {
            const format = req.query.format || 'json';
            const result = await settingsService.exportSettings(format);
            return res.status(200).json(ResponseFormatter.success(result.data, 'Settings exported'));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // GET BACKUP STATISTICS
    async getBackupStatistics(req, res, next) {
        try {
            const result = await settingsService.getBackupStatistics();
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new SettingsController();