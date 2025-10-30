const Media = require("../models/Media.model");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class UploadController {
  /**
   * Upload a file
   */
  static async uploadFile(req, res) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return errorResponse(
          res,
          {
            message: "No file uploaded",
          },
          400,
        );
      }

      const { originalname, mimetype, size, filename, path } = req.file;
      const { entityType, entityId } = req.body;

      // Create media record
      const media = await Media.create({
        fileName: originalname,
        fileType: mimetype,
        fileSize: size,
        filePath: path,
        entity_type: entityType,
        entity_id: entityId,
      });

      return successResponse(
        res,
        {
          message: "File uploaded successfully",
          data: media,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get media by ID
   */
  static async getMedia(req, res) {
    try {
      const { id } = req.params;

      // Find media
      const media = await Media.findByPk(id);

      if (!media) {
        return errorResponse(
          res,
          {
            message: "Media not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Media retrieved successfully",
        data: media,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update media
   */
  static async updateMedia(req, res) {
    try {
      const { id } = req.params;
      const { fileName, entityType, entityId } = req.body;

      // Find media
      const media = await Media.findByPk(id);

      if (!media) {
        return errorResponse(
          res,
          {
            message: "Media not found",
          },
          404,
        );
      }

      // Update media
      await media.update({
        fileName,
        entity_type: entityType,
        entity_id: entityId,
      });

      return successResponse(res, {
        message: "Media updated successfully",
        data: media,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete media
   */
  static async deleteMedia(req, res) {
    try {
      const { id } = req.params;

      // Find media
      const media = await Media.findByPk(id);

      if (!media) {
        return errorResponse(
          res,
          {
            message: "Media not found",
          },
          404,
        );
      }

      // Delete media file from storage
      // Note: This would require integrating with Cloudinary or file system
      // await deleteFile(media.filePath);

      // Delete media record
      await media.destroy();

      return successResponse(res, {
        message: "Media deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all media for an entity
   */
  static async getEntityMedia(req, res) {
    try {
      const { entityType, entityId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Get media with pagination
      const media = await Media.findAndCountAll({
        where: {
          entity_type: entityType,
          entity_id: entityId,
        },
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Media retrieved successfully",
        data: media.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(media.count / parseInt(limit, 10)),
          totalRecords: media.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }
}


/**
 * Get all uploads
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
    
    const { count, rows } = await Upload.findAndCountAll({
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


/**
 * Get upload by ID
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const item = await Upload.findByPk(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = UploadController;
