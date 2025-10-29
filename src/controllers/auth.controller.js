const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User.model');
const Patient = require('../models/Patient.model');
const Doctor = require('../models/Doctor.model');
const Hospital = require('../models/Hospital.model');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/jwt');
const config = require('../config');
const logger = require('../utils/logger');
const { sendWelcomeEmail } = require('../services/email.service');
const RefreshToken = require('../models/RefreshToken.model');
const {
  successResponse,
  errorResponse,
} = require('../utils/response');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, {
          message: 'Validation failed',
          errors: errors.array(),
        }, 400);
      }

      const {
        email,
        password,
        firstName,
        lastName,
        role,
        phone,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, {
          message: 'User with this email already exists',
          code: 'USER_EMAIL_EXISTS',
        }, 409);
      }

      // Hash password
      const saltRounds = config.bcryptSaltRounds;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        phone,
      });

      // Create role-specific profile
      if (role === 'patient') {
        await Patient.create({
          userId: user.id,
          dateOfBirth: null,
          gender: null,
          bloodType: null,
          emergencyContact: null,
        });
      } else if (role === 'doctor') {
        await Doctor.create({
          userId: user.id,
          specialty: null,
          licenseNumber: null,
          yearsOfExperience: null,
        });
      } else if (role === 'hospital_admin') {
        await Hospital.create({
          userId: user.id,
          name: null,
          address: null,
          phone: null,
          licenseNumber: null,
        });
      }

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save refresh token
      await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
      });

      // Send welcome email
      await sendWelcomeEmail(user.email, user.firstName);

      // Return success response
      return successResponse(res, {
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      }, 201);
    } catch (error) {
      logger.error('Registration error:', error);
      return errorResponse(res, {
        message: 'Registration failed',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, {
          message: 'Validation failed',
          errors: errors.array(),
        }, 400);
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse(res, {
          message: 'Invalid credentials',
          code: 'AUTH_INVALID_CREDENTIALS',
        }, 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return errorResponse(res, {
          message: 'Invalid credentials',
          code: 'AUTH_INVALID_CREDENTIALS',
        }, 401);
      }

      // Check if account is verified
      if (!user.isVerified) {
        return errorResponse(res, {
          message: 'Please verify your account',
          code: 'AUTH_ACCOUNT_NOT_VERIFIED',
        }, 401);
      }

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save or update refresh token
      await RefreshToken.upsert({
        token: refreshToken,
        userId: user.id,
      });

      // Return success response
      return successResponse(res, {
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      return errorResponse(res, {
        message: 'Login failed',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Refresh access token
   */
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

      // Find user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return errorResponse(res, {
          message: 'Invalid refresh token',
          code: 'AUTH_TOKEN_INVALID',
        }, 401);
      }

      // Check if refresh token exists in database
      const storedToken = await RefreshToken.findOne({
        where: {
          token: refreshToken,
          userId: user.id,
        },
      });

      if (!storedToken) {
        return errorResponse(res, {
          message: 'Invalid refresh token',
          code: 'AUTH_TOKEN_INVALID',
        }, 401);
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      // Update refresh token in database
      await RefreshToken.update(
        { token: newRefreshToken },
        { where: { userId: user.id } },
      );

      // Return success response
      return successResponse(res, {
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      return errorResponse(res, {
        message: 'Token refresh failed',
        error: error.message,
      }, 401);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      const { user } = req;

      // Remove refresh token from database
      await RefreshToken.destroy({
        where: { userId: user.id },
      });

      // Return success response
      return successResponse(res, {
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      return errorResponse(res, {
        message: 'Logout failed',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res) {
    try {
      const { user } = req;

      // Return success response
      return successResponse(res, {
        message: 'Profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phone: user.phone,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve profile',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      const { user } = req;
      const {
        firstName,
        lastName,
        phone,
        profilePicture,
      } = req.body;

      // Update user
      await user.update({
        firstName,
        lastName,
        phone,
        profilePicture,
      });

      // Return success response
      return successResponse(res, {
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phone: user.phone,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      return errorResponse(res, {
        message: 'Failed to update profile',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse(res, {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        }, 404);
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id },
        config.jwt.secret,
        { expiresIn: '1h' },
      );

      // Save reset token
      await user.update({ resetToken });

      // Send reset email
      // await sendPasswordResetEmail(user.email, resetToken);

      // Return success response
      return successResponse(res, {
        message: 'Password reset instructions sent to your email',
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      return errorResponse(res, {
        message: 'Failed to process password reset request',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Find user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return errorResponse(res, {
          message: 'Invalid or expired token',
          code: 'AUTH_TOKEN_INVALID',
        }, 400);
      }

      // Hash new password
      const saltRounds = config.bcryptSaltRounds;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await user.update({
        password: hashedPassword,
        resetToken: null,
      });

      // Return success response
      return successResponse(res, {
        message: 'Password reset successfully',
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      return errorResponse(res, {
        message: 'Failed to reset password',
        error: error.message,
      }, 400);
    }
  }
}

module.exports = new AuthController();