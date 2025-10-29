const express = require('express');
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create user (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  userController.createUser,
);

// Get user by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  userController.getUser,
);

// Update user (users themselves, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  userController.updateUser,
);

// Delete user (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  userController.deleteUser,
);

// Get all users (admin only)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  userController.getAllUsers,
);

module.exports = router;