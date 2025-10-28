const { User, Patient, Doctor, RefreshToken, PasswordReset } = require('../models');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const { UnauthorizedError, ValidationError, NotFoundError } = require('../utils/error-handler');
const { generateRandomString } = require('../utils/helpers');
const logger = require('../utils/logger');

class AuthController {
  /**
   * Register new user
   * @route POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const { email, password, role, first_name, last_name, phone } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new ValidationError('Email already registered');
      }

      // Create user
      const user = await User.create({
        email,
        password_hash: password,
        role: role || 'patient',
        first_name,
        last_name,
        phone
      });

      // Generate tokens
      const tokens = generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Save refresh token
      await RefreshToken.create({
        user_id: user.id,
        token: tokens.refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      logger.info(`User registered: ${email}`);

      return successResponse(res, 201, 'User registered successfully', {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name
        },
        ...tokens
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * @route POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Check if user is active
      if (!user.is_active) {
        throw new UnauthorizedError('Account is disabled');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Generate tokens
      const tokens = generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Save refresh token
      await RefreshToken.create({
        user_id: user.id,
        token: tokens.refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      // Update last login
      await user.update({ last_login: new Date() });

      logger.info(`User logged in: ${email}`);

      return successResponse(res, 200, 'Login successful', {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name
        },
        ...tokens
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * @route POST /api/v1/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if token exists and not revoked
      const tokenRecord = await RefreshToken.findOne({
        where: { token: refreshToken, user_id: decoded.id, is_revoked: false }
      });

      if (!tokenRecord) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Check if token expired
      if (new Date() > tokenRecord.expires_at) {
        throw new UnauthorizedError('Refresh token expired');
      }

      // Get user
      const user = await User.findByPk(decoded.id);
      if (!user || !user.is_active) {
        throw new UnauthorizedError('User not found or inactive');
      }

      // Generate new tokens
      const tokens = generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Revoke old refresh token
      await tokenRecord.update({ is_revoked: true });

      // Save new refresh token
      await RefreshToken.create({
        user_id: user.id,
        token: tokens.refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      return successResponse(res, 200, 'Token refreshed successfully', tokens);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * @route POST /api/v1/auth/logout
   */
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await RefreshToken.update(
          { is_revoked: true },
          { where: { token: refreshToken } }
        );
      }

      logger.info(`User logged out: ${req.user.email}`);

      return successResponse(res, 200, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * @route GET /api/v1/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] },
        include: [
          { model: Patient, as: 'patientProfile' },
          { model: Doctor, as: 'doctorProfile' }
        ]
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return successResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current user profile
   * @route PATCH /api/v1/auth/profile
   */
  async updateProfile(req, res, next) {
    try {
      const { first_name, last_name, phone, profile_picture } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      await user.update({
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        phone: phone || user.phone,
        profile_picture: profile_picture || user.profile_picture
      });

      logger.info(`Profile updated: ${user.email}`);

      return successResponse(res, 200, 'Profile updated successfully', {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        profile_picture: user.profile_picture
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   * @route POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal if email exists
        return successResponse(res, 200, 'If email exists, reset link will be sent');
      }

      // Generate reset token
      const token = generateRandomString(32);

      // Save reset token
      await PasswordReset.create({
        user_id: user.id,
        token,
        expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      });

      // TODO: Send email with reset link
      logger.info(`Password reset requested: ${email}`);

      return successResponse(res, 200, 'If email exists, reset link will be sent');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   * @route POST /api/v1/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;

      // Find reset token
      const resetRecord = await PasswordReset.findOne({
        where: { token, is_used: false }
      });

      if (!resetRecord) {
        throw new ValidationError('Invalid or expired reset token');
      }

      // Check if token expired
      if (new Date() > resetRecord.expires_at) {
        throw new ValidationError('Reset token has expired');
      }

      // Update password
      const user = await User.findByPk(resetRecord.user_id);
      await user.update({ password_hash: password });

      // Mark token as used
      await resetRecord.update({ is_used: true });

      logger.info(`Password reset completed: ${user.email}`);

      return successResponse(res, 200, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();