const express = require('express');
const hospitalController = require('../../controllers/hospital.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create hospital (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  hospitalController.createHospital,
);

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Hospital retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// Get hospital by ID (public endpoint)
router.get(
  '/:id',
  hospitalController.getHospital,
);

// Update hospital (hospital admins themselves, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'hospital_admin']),
  hospitalController.updateHospital,
);

// Delete hospital (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  hospitalController.deleteHospital,
);

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - $ref: '#/components/parameters/sortParam'
 *     responses:
 *       200:
 *         description: Hospitals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hospital'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// Get all hospitals (public endpoint)
router.get(
  '/',
  hospitalController.getAllHospitals,
);

// Verify hospital (admin only)
router.patch(
  '/:id/verify',
  auth,
  authorize(['admin']),
  hospitalController.verifyHospital,
);

module.exports = router;
