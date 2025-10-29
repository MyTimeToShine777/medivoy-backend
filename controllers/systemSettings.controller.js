/**
 * System Settings Controller
 * Handles system configuration and settings management
 */

const { Op } = require('sequelize');
const { SystemSettings, User } = require('../models');

/**
 * Get all settings
 */
exports.getAllSettings = async (req, res) => {
  try {
    const { category, isPublic } = req.query;

    const whereClause = {};
    if (category) whereClause.category = category;
    if (isPublic !== undefined) whereClause.is_public = isPublic === 'true';

    const settings = await SystemSettings.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      order: [['category', 'ASC'], ['setting_key', 'ASC']],
    });

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    });
  }
};

/**
 * Get setting by key
 */
exports.getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await SystemSettings.findOne({
      where: { setting_key: key },
      include: [
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching setting',
      error: error.message,
    });
  }
};

/**
 * Get settings by category
 */
exports.getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const settings = await SystemSettings.findAll({
      where: { category },
      include: [
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
      order: [['setting_key', 'ASC']],
    });

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings by category',
      error: error.message,
    });
  }
};

/**
 * Create or update setting
 */
exports.upsertSetting = async (req, res) => {
  try {
    const {
      setting_key,
      setting_value,
      setting_type,
      category,
      description,
      is_public,
      is_encrypted,
      default_value,
      validation_rules,
      updated_by,
    } = req.body;

    const [setting, created] = await SystemSettings.upsert(
      {
        setting_key,
        setting_value,
        setting_type: setting_type || 'string',
        category: category || 'general',
        description,
        is_public: is_public !== undefined ? is_public : false,
        is_encrypted: is_encrypted !== undefined ? is_encrypted : false,
        default_value,
        validation_rules,
        updated_by,
      },
      {
        returning: true,
      },
    );

    const settingWithDetails = await SystemSettings.findOne({
      where: { setting_key },
      include: [
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });

    res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Setting created successfully' : 'Setting updated successfully',
      data: settingWithDetails,
    });
  } catch (error) {
    console.error('Error upserting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving setting',
      error: error.message,
    });
  }
};

/**
 * Update setting value
 */
exports.updateSettingValue = async (req, res) => {
  try {
    const { key } = req.params;
    const { setting_value, updated_by } = req.body;

    const setting = await SystemSettings.findOne({
      where: { setting_key: key },
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    await setting.update({
      setting_value,
      updated_by,
    });

    const updatedSetting = await SystemSettings.findOne({
      where: { setting_key: key },
      include: [
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Setting value updated successfully',
      data: updatedSetting,
    });
  } catch (error) {
    console.error('Error updating setting value:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating setting value',
      error: error.message,
    });
  }
};

/**
 * Delete setting
 */
exports.deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await SystemSettings.findOne({
      where: { setting_key: key },
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    await setting.destroy();

    res.json({
      success: true,
      message: 'Setting deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting setting',
      error: error.message,
    });
  }
};

/**
 * Get public settings
 */
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findAll({
      where: { is_public: true },
      attributes: ['setting_key', 'setting_value', 'setting_type', 'category', 'description'],
    });

    // Convert to key-value object
    const settingsObject = {};
    settings.forEach((setting) => {
      settingsObject[setting.setting_key] = {
        value: setting.setting_value,
        type: setting.setting_type,
        category: setting.category,
        description: setting.description,
      };
    });

    res.json({
      success: true,
      data: settingsObject,
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public settings',
      error: error.message,
    });
  }
};

/**
 * Bulk update settings
 */
exports.bulkUpdateSettings = async (req, res) => {
  try {
    const { settings, updated_by } = req.body;

    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Settings array is required',
      });
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const settingData of settings) {
      try {
        const { setting_key, setting_value } = settingData;

        const setting = await SystemSettings.findOne({
          where: { setting_key },
        });

        if (!setting) {
          results.failed.push({
            setting_key,
            reason: 'Setting not found',
          });
          continue;
        }

        await setting.update({
          setting_value,
          updated_by,
        });

        results.success.push(setting_key);
      } catch (error) {
        results.failed.push({
          setting_key: settingData.setting_key,
          reason: error.message,
        });
      }
    }

    res.json({
      success: true,
      message: `Updated ${results.success.length} settings, ${results.failed.length} failed`,
      data: results,
    });
  } catch (error) {
    console.error('Error bulk updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk updating settings',
      error: error.message,
    });
  }
};

/**
 * Reset setting to default
 */
exports.resetSettingToDefault = async (req, res) => {
  try {
    const { key } = req.params;
    const { updated_by } = req.body;

    const setting = await SystemSettings.findOne({
      where: { setting_key: key },
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    if (!setting.default_value) {
      return res.status(400).json({
        success: false,
        message: 'No default value defined for this setting',
      });
    }

    await setting.update({
      setting_value: setting.default_value,
      updated_by,
    });

    res.json({
      success: true,
      message: 'Setting reset to default value',
      data: setting,
    });
  } catch (error) {
    console.error('Error resetting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting setting',
      error: error.message,
    });
  }
};
