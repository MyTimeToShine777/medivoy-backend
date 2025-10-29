const express = require('express');
const authController = require('../../controllers/auth.controller');
const authValidation = require('../../validators/auth.validator');

const router = express.Router();

// Register a new user
router.post(
  '/register',
  authValidation.register,
  authController.register,
);

// Login user
router.post(
  '/login',
  authValidation.login,
  authController.login,
);

// Logout user
router.post('/logout', authController.logout);

// Refresh access token
router.post(
  '/refresh',
  authValidation.refresh,
  authController.refresh,
);

// Get current user profile
router.get('/profile', authController.getProfile);

// Update user profile
router.put(
  '/profile',
  authValidation.updateProfile,
  authController.updateProfile,
);

// Change password
router.put(
  '/change-password',
  authValidation.changePassword,
  authController.changePassword,
);

// Request password reset
router.post(
  '/forgot-password',
  authValidation.forgotPassword,
  authController.forgotPassword,
);

// Reset password with token
router.post(
  '/reset-password',
  authValidation.resetPassword,
  authController.resetPassword,
);

// Verify email with token
router.post(
  '/verify-email',
  authValidation.verifyEmail,
  authController.verifyEmail,
);

// Resend verification email
router.post(
  '/resend-verification',
  authValidation.resendVerification,
  authController.resendVerification,
);

module.exports = router;