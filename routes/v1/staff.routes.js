/**
 * Staff Routes
 */

const express = require('express');

const router = express.Router();
const staffController = require('../../controllers/staff.controller');
const authenticate = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/staff:
 *   get:
 *     summary: Get all staff members
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', staffController.getAllStaff);

/**
 * @swagger
 * /api/v1/staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', staffController.createStaff);

/**
 * @swagger
 * /api/v1/staff/hospital/{hospitalId}:
 *   get:
 *     summary: Get staff by hospital
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.get('/hospital/:hospitalId', staffController.getStaffByHospital);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   get:
 *     summary: Get staff member by ID
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', staffController.getStaffById);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   put:
 *     summary: Update staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', staffController.updateStaff);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   delete:
 *     summary: Delete staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', staffController.deleteStaff);

/**
 * @swagger
 * /api/v1/staff/{id}/performance:
 *   get:
 *     summary: Get staff performance metrics
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/performance', staffController.getStaffPerformance);

/**
 * @swagger
 * /api/v1/staff/{id}/permissions:
 *   put:
 *     summary: Update staff permissions
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/permissions', staffController.updateStaffPermissions);

module.exports = router;
