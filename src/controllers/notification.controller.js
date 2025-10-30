const Notification = require("../models/Notification.model");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class NotificationController {
  /**
   * Create a new notification
   */
  static async createNotification(req, res) {
    try {
      const { userId, title, message, type, priority, isRead } = req.body;

      // Create notification
      const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        priority,
        isRead,
      });

      return successResponse(
        res,
        {
          message: "Notification created successfully",
          data: notification,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get notification by ID
   */
  static async getNotification(req, res) {
    try {
      const { id } = req.params;

      // Find notification
      const notification = await Notification.findByPk(id);

      if (!notification) {
        return errorResponse(
          res,
          {
            message: "Notification not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Notification retrieved successfully",
        data: notification,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update notification
   */
  static async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const { title, message, type, priority, isRead } = req.body;

      // Find notification
      const notification = await Notification.findByPk(id);

      if (!notification) {
        return errorResponse(
          res,
          {
            message: "Notification not found",
          },
          404,
        );
      }

      // Update notification
      await notification.update({
        title,
        message,
        type,
        priority,
        isRead,
      });

      return successResponse(res, {
        message: "Notification updated successfully",
        data: notification,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      // Find notification
      const notification = await Notification.findByPk(id);

      if (!notification) {
        return errorResponse(
          res,
          {
            message: "Notification not found",
          },
          404,
        );
      }

      // Delete notification
      await notification.destroy();

      return successResponse(res, {
        message: "Notification deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, isRead, type } = req.query;

      // Build where clause
      const where = { userId };
      if (isRead !== undefined) where.isRead = isRead === "true";
      if (type) where.type = type;

      // Get notifications with pagination
      const notifications = await Notification.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Notifications retrieved successfully",
        data: notifications.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(notifications.count / parseInt(limit, 10)),
          totalRecords: notifications.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(req, res) {
    try {
      const { id } = req.params;

      // Find notification
      const notification = await Notification.findByPk(id);

      if (!notification) {
        return errorResponse(
          res,
          {
            message: "Notification not found",
          },
          404,
        );
      }

      // Update notification as read
      await notification.update({ isRead: true });

      return successResponse(res, {
        message: "Notification marked as read successfully",
        data: notification,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }
}


/**
 * Get all notifications
 */
const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sort = '-created_at' } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }
    
    const { count, rows } = await Notification.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC']],
    });
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = NotificationController;
