const User = require('../models/User.model');
const logger = require('../utils/logger');

class UserService {
  /**
   * Create a new user
   */
  async createUser(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      logger.error('Create user service error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      logger.error('Get user by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id, data) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      await user.update(data);
      return user;
    } catch (error) {
      logger.error('Update user service error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      await user.destroy();
      return true;
    } catch (error) {
      logger.error('Delete user service error:', error);
      throw error;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      
      const users = await User.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return users;
    } catch (error) {
      logger.error('Get all users service error:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      logger.error('Get user by email service error:', error);
      throw error;
    }
  }

  /**
   * Update user's last login
   */
  async updateLastLogin(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      await user.update({ lastLogin: new Date() });
      return user;
    } catch (error) {
      logger.error('Update last login service error:', error);
      throw error;
    }
  }
}

module.exports = new UserService();