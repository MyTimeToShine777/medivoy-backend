const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../utils/response');
const {
  handleDatabaseError, withDatabaseFallback, createPaginatedMockResponse,
} = require('../utils/databaseErrorHandler');

class UserController {
  /**
   * Create a new user
   */
  static async createUser(req, res) {
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
      return handleDatabaseError(error, res, 'Failed to create user');
    }
  }

  /**
   * Get user by ID
   */
  static async getUser(req, res) {
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
      return handleDatabaseError(error, res, 'Failed to retrieve user');
    }
  }

  /**
   * Update user
   */
  static async updateUser(req, res) {
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
      return handleDatabaseError(error, res, 'Failed to update user');
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req, res) {
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
      return handleDatabaseError(error, res, 'Failed to delete user');
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(req, res) {
    try {
      const {
        page = 1, limit = 10, role, isVerified,
      } = req.query;

      // Build where clause
      const where = {};
      if (role) where.role = role;
      if (isVerified !== undefined) where.isVerified = isVerified === 'true';

      // Get users with pagination (with database fallback)
      const users = await withDatabaseFallback(
        async () => await User.findAndCountAll({
          where,
          limit: parseInt(limit, 10),
          offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
          order: [['createdAt', 'DESC']],
        }),
        'user',
        {},
        createPaginatedMockResponse('user', page, limit, role ? { role } : {}),
      );

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
      return handleDatabaseError(error, res, 'Failed to retrieve users');
    }
  }

  /**
   * Verify user
   */
  static async verifyUser(req, res) {
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
      return handleDatabaseError(error, res, 'Failed to verify user');
    }
  }
}

module.exports = UserController;
