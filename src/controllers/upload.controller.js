const Media = require('../models/Media.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class UploadController {
  /**
   * Upload a file
   */
  async uploadFile(req, res) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return errorResponse(res, {
          message: 'No file uploaded',
        }, 400);
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
      
      return successResponse(res, {
        message: 'File uploaded successfully',
        data: media,
      }, 201);
    } catch (error) {
      logger.error('Upload file error:', error);
      return errorResponse(res, {
        message: 'Failed to upload file',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get media by ID
   */
  async getMedia(req, res) {
    try {
      const { id } = req.params;
      
      // Find media
      const media = await Media.findByPk(id);
      
      if (!media) {
        return errorResponse(res, {
          message: 'Media not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Media retrieved successfully',
        data: media,
      });
    } catch (error) {
      logger.error('Get media error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve media',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update media
   */
  async updateMedia(req, res) {
    try {
      const { id } = req.params;
      const { fileName, entityType, entityId } = req.body;
      
      // Find media
      const media = await Media.findByPk(id);
      
      if (!media) {
        return errorResponse(res, {
          message: 'Media not found',
        }, 404);
      }
      
      // Update media
      await media.update({
        fileName,
        entity_type: entityType,
        entity_id: entityId,
      });
      
      return successResponse(res, {
        message: 'Media updated successfully',
        data: media,
      });
    } catch (error) {
      logger.error('Update media error:', error);
      return errorResponse(res, {
        message: 'Failed to update media',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete media
   */
  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      
      // Find media
      const media = await Media.findByPk(id);
      
      if (!media) {
        return errorResponse(res, {
          message: 'Media not found',
        }, 404);
      }
      
      // Delete media file from storage
      // Note: This would require integrating with Cloudinary or file system
      // await deleteFile(media.filePath);
      
      // Delete media record
      await media.destroy();
      
      return successResponse(res, {
        message: 'Media deleted successfully',
      });
    } catch (error) {
      logger.error('Delete media error:', error);
      return errorResponse(res, {
        message: 'Failed to delete media',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all media for an entity
   */
  async getEntityMedia(req, res) {
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
        order: [['createdAt', 'DESC']],
      });
      
      return successResponse(res, {
        message: 'Media retrieved successfully',
        data: media.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(media.count / parseInt(limit, 10)),
          totalRecords: media.count,
        },
      });
    } catch (error) {
      logger.error('Get entity media error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve media',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new UploadController();