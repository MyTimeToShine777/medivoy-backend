const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @swagger
 * /api/v1/health/db:
 *   get:
 *     summary: Database health check
 *     tags: [Health]
 */
router.get('/db', async (req, res) => {
  try {
    const { sequelize } = require('../../models');
    await sequelize.authenticate();
    res.status(200).json({
      status: 'success',
      message: 'Database connection is healthy'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;
