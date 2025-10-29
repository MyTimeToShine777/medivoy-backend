const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class UserController {
  /**
   * Create a new user
   */
  async createUser(req, res) {
    try {
      const {
        email, firstName, lastName, role, phone, isVerified,
      } = req.body;

      // Create user
      const user = await User.create({
        email,
        firstName,
        lastName,
        role,
        phone,
        isVerified,
      });

      return successResponse(res, {
        message: 'User created successfully',
        data: user,
      }, 201);
    } catch (error) {
      logger.error('Create user error:', error);
      return errorResponse(res, {
        message: 'Failed to create user',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get user by ID
   */
  async getUser(req, res) {
    try {
      const { id } = req.params;

      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        return errorResponse(res, {
          message: 'User not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'User retrieved successfully',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Get user error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve user',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update user
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const {
        firstName, lastName, role, phone, isVerified,
      } = req.body;

      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        return errorResponse(res, {
          message: 'User not found',
        }, 404);
      }

      // Update user
      await user.update({
        firstName,
        lastName,
        role,
        phone,
        isVerified,
      });

      return successResponse(res, {
        message: 'User updated successfully',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Update user error:', error);
      return errorResponse(res, {
        message: 'Failed to update user',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        return errorResponse(res, {
          message: 'User not found',
        }, 404);
      }

      // Delete user
      await user.destroy();

      return successResponse(res, {
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Delete user error:', error);
      return errorResponse(res, {
        message: 'Failed to delete user',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(req, res) {
    try {
      const {
        page = 1, limit = 10, role, isVerified,
      } = req.query;

      // Build where clause
      const where = {};
      if (role) where.role = role;
      if (isVerified !== undefined) where.isVerified = isVerified === 'true';

      // Get users with pagination
      const users = await User.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Users retrieved successfully',
        data: users.rows.map((user) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(users.count / parseInt(limit, 10)),
          totalRecords: users.count,
        },
      });
    } catch (error) {
      logger.error('Get all users error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve users',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Verify user
   */
  async verifyUser(req, res) {
    try {
      const { id } = req.params;

      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        return errorResponse(res, {
          message: 'User not found',
        }, 404);
      }

      // Verify user
      await user.update({ isVerified: true });

      return successResponse(res, {
        message: 'User verified successfully',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Verify user error:', error);
      return errorResponse(res, {
        message: 'Failed to verify user',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new UserController();
