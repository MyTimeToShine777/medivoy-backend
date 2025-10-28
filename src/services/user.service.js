const { User, Patient, Doctor } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class UserService {
  async createUser(userData) {
    try {
      const user = await User.create(userData);
      logger.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ]
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await this.getUserById(userId);
    await user.update(updateData);
    logger.info(`User updated: ${userId}`);
    return user;
  }

  async deleteUser(userId) {
    const user = await this.getUserById(userId);
    await user.destroy();
    logger.info(`User deleted: ${userId}`);
    return { message: 'User deleted successfully' };
  }

  async getAllUsers(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      users: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async updateUserStatus(userId, status) {
    const user = await this.getUserById(userId);
    await user.update({ status });
    logger.info(`User status updated: ${userId} - ${status}`);
    return user;
  }
}

module.exports = new UserService();
