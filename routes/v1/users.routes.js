const express = require('express');
const userController = require('../../controllers/user.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create user (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  userController.createUser,
);

// Get user by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  userController.getUser,
);

// Update user (users themselves, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  userController.updateUser,
);

// Delete user (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  userController.deleteUser,
);

// Get all users (admin only)
router.get(
  '/',
  auth,
  authorize(['admin']),
  userController.getAllUsers,
);

module.exports = router;
