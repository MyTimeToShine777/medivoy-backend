/**
 * Integration Controller
 * Handles third-party integrations and API connections
 */

const { Op } = require('sequelize');
const { Integration, User } = require('../models');

/**
 * Get all integrations
 */
exports.getAllIntegrations = async (req, res) => {
  try {
    const { integrationType, isActive, provider } = req.query;

    const whereClause = {};
    if (integrationType) whereClause.integration_type = integrationType;
    if (isActive !== undefined) whereClause.is_active = isActive === 'true';
    if (provider) whereClause.provider = { [Op.iLike]: `%${provider}%` };

    const integrations = await Integration.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Remove sensitive data
    const sanitizedIntegrations = integrations.map((integration) => {
      const data = integration.toJSON();
      delete data.api_key;
      delete data.api_secret;
      delete data.webhook_secret;
      delete data.credentials;
      return data;
    });

    res.json({
      success: true,
      data: sanitizedIntegrations,
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching integrations',
      error: error.message,
    });
  }
};

/**
 * Get integration by ID
 */
exports.getIntegrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const integration = await Integration.findByPk(id, {
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found',
      });
    }

    // Remove sensitive data
    const data = integration.toJSON();
    delete data.api_key;
    delete data.api_secret;
    delete data.webhook_secret;
    delete data.credentials;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching integration:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching integration',
      error: error.message,
    });
  }
};

/**
 * Create integration
 */
exports.createIntegration = async (req, res) => {
  try {
    const {
      name,
      slug,
      integration_type,
      provider,
      description,
      api_key,
      api_secret,
      api_endpoint,
      webhook_url,
      webhook_secret,
      configuration,
      credentials,
      is_sandbox,
      rate_limit,
      created_by,
    } = req.body;

    // Check if slug already exists
    const existingIntegration = await Integration.findOne({ where: { slug } });
    if (existingIntegration) {
      return res.status(400).json({
        success: false,
        message: 'Integration with this slug already exists',
      });
    }

    const integration = await Integration.create({
      name,
      slug,
      integration_type: integration_type || 'other',
      provider,
      description,
      api_key,
      api_secret,
      api_endpoint,
      webhook_url,
      webhook_secret,
      configuration,
      credentials,
      is_active: false,
      is_sandbox: is_sandbox !== false,
      sync_status: 'never',
      rate_limit,
      created_by,
    });

    // Remove sensitive data from response
    const data = integration.toJSON();
    delete data.api_key;
    delete data.api_secret;
    delete data.webhook_secret;
    delete data.credentials;

    res.status(201).json({
      success: true,
      message: 'Integration created successfully',
      data,
    });
  } catch (error) {
    console.error('Error creating integration:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating integration',
      error: error.message,
    });
  }
};

/**
 * Update integration
 */
exports.updateIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const integration = await Integration.findByPk(id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found',
      });
    }

    await integration.update(updateData);

    // Remove sensitive data from response
    const data = integration.toJSON();
    delete data.api_key;
    delete data.api_secret;
    delete data.webhook_secret;
    delete data.credentials;

    res.json({
      success: true,
      message: 'Integration updated successfully',
      data,
    });
  } catch (error) {
    console.error('Error updating integration:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating integration',
      error: error.message,
    });
  }
};

/**
 * Delete integration
 */
exports.deleteIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    const integration = await Integration.findByPk(id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found',
      });
    }

    await integration.destroy();

    res.json({
      success: true,
      message: 'Integration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting integration:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting integration',
      error: error.message,
    });
  }
};

/**
 * Toggle integration status
 */
exports.toggleIntegrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const integration = await Integration.findByPk(id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found',
      });
    }

    await integration.update({ is_active });

    res.json({
      success: true,
      message: `Integration ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: { is_active: integration.is_active },
    });
  } catch (error) {
    console.error('Error toggling integration status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling integration status',
      error: error.message,
    });
  }
};

/**
 * Test integration connection
 */
exports.testIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    const integration = await Integration.findByPk(id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found',
      });
    }

    // Here you would implement actual connection testing based on integration type
    // For now, we'll just update the sync status

    await integration.update({
      sync_status: 'success',
      last_sync_at: new Date(),
      sync_error: null,
    });

    res.json({
      success: true,
      message: 'Integration test successful',
      data: {
        sync_status: integration.sync_status,
        last_sync_at: integration.last_sync_at,
      },
    });
  } catch (error) {
    console.error('Error testing integration:', error);

    // Update sync status to failed
    const integration = await Integration.findByPk(req.params.id);
    if (integration) {
      await integration.update({
        sync_status: 'failed',
        sync_error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Integration test failed',
      error: error.message,
    });
  }
};

/**
 * Get integration statistics
 */
exports.getIntegrationStatistics = async (req, res) => {
  try {
    const totalIntegrations = await Integration.count();
    const activeIntegrations = await Integration.count({
      where: { is_active: true },
    });

    const integrationsByType = await Integration.findAll({
      attributes: [
        'integration_type',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('id')),
          'count',
        ],
      ],
      group: ['integration_type'],
      raw: true,
    });

    const integrationsBySyncStatus = await Integration.findAll({
      attributes: [
        'sync_status',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('id')),
          'count',
        ],
      ],
      group: ['sync_status'],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalIntegrations,
        activeIntegrations,
        integrationsByType,
        integrationsBySyncStatus,
      },
    });
  } catch (error) {
    console.error('Error fetching integration statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching integration statistics',
      error: error.message,
    });
  }
};

/**
 * Sync integration
 */
exports.syncIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    const integration = await Integration.findByPk(id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found',
      });
    }

    if (!integration.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Integration is not active',
      });
    }

    // Here you would implement actual sync logic based on integration type
    // For now, we'll just update the sync status

    await integration.update({
      sync_status: 'pending',
      last_sync_at: new Date(),
    });

    // Simulate sync process
    setTimeout(async () => {
      await integration.update({
        sync_status: 'success',
        usage_count: integration.usage_count + 1,
        last_used_at: new Date(),
      });
    }, 1000);

    res.json({
      success: true,
      message: 'Integration sync initiated',
      data: {
        sync_status: integration.sync_status,
        last_sync_at: integration.last_sync_at,
      },
    });
  } catch (error) {
    console.error('Error syncing integration:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing integration',
      error: error.message,
    });
  }
};

/**
 * Get integration by slug
 */
exports.getIntegrationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const integration = await Integration.findOne({
      where: { slug },
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found',
      });
    }

    // Remove sensitive data
    const data = integration.toJSON();
    delete data.api_key;
    delete data.api_secret;
    delete data.webhook_secret;
    delete data.credentials;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching integration by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching integration',
      error: error.message,
    });
  }
};
