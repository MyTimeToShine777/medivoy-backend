const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Health Check
 *     description: Check if the Medivoy Healthcare API is running and healthy
 *     tags:
 *       - Health & Monitoring
 *     responses:
 *       200:
 *         description: API is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Medivoy Healthcare API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-29T18:55:00.000Z
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Medivoy Healthcare API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
