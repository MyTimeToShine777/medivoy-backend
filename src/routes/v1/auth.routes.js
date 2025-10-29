const express = require('express');
const authController = require('../../controllers/auth.controller');
const validateMiddleware = require('../../middleware/validate.middleware');
const authValidation = require('../../validators/auth.validator');

const router = express.Router();

// Register a new user
router.post(
  '/register',
  authValidation.register,
  validateMiddleware,
  authController.register,
);

// Login user
router.post(
  '/login',
  authValidation.login,
  validateMiddleware,
  authController.login,
);

// Logout user
router.post(
  '/logout',
  authController.logout,
);

// Refresh token
router.post(
  '/refresh',
  authController.refreshToken,
);

// Get user profile
router.get(
  '/profile',
  authController.getProfile,
);

// Update user profile
router.put(
  '/profile',
  authController.updateProfile,
);

// Request password reset
router.post(
  '/password/reset/request',
  authValidation.requestPasswordReset,
  validateMiddleware,
  authController.requestPasswordReset,
);

// Reset password
router.post(
  '/password/reset',
  authValidation.resetPassword,
  validateMiddleware,
  authController.resetPassword,
);

// Verify email
router.post(
  '/email/verify',
  authValidation.verifyEmail,
  validateMiddleware,
  authController.verifyEmail,
);

// Resend verification email
router.post(
  '/email/resend',
  authValidation.resendVerificationEmail,
  validateMiddleware,
  authController.resendVerificationEmail,
);

module.exports = router;