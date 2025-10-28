const cloudinary = require('cloudinary').v2;
const { Media } = require('../models');
const config = require('../config');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error-handler');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

class UploadService {
  async uploadFile(file, folder = 'medivoy') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'auto'
      });

      const media = await Media.create({
        file_name: file.originalname,
        file_path: result.secure_url,
        file_type: file.mimetype,
        file_size: file.size,
        cloudinary_id: result.public_id
      });

      logger.info(`File uploaded: ${media.id}`);
      return media;
    } catch (error) {
      logger.error('Error uploading file:', error);
      throw new AppError('Failed to upload file', 500);
    }
  }

  async uploadMultipleFiles(files, folder = 'medivoy') {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, folder));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      logger.error('Error uploading multiple files:', error);
      throw new AppError('Failed to upload files', 500);
    }
  }

  async deleteFile(mediaId) {
    try {
      const media = await Media.findByPk(mediaId);
      
      if (!media) {
        throw new AppError('Media not found', 404);
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(media.cloudinary_id);

      // Delete from database
      await media.destroy();

      logger.info(`File deleted: ${mediaId}`);
      return { message: 'File deleted successfully' };
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw new AppError('Failed to delete file', 500);
    }
  }

  async getMediaById(mediaId) {
    const media = await Media.findByPk(mediaId);
    
    if (!media) {
      throw new AppError('Media not found', 404);
    }
    
    return media;
  }

  async getAllMedia(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Media.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      media: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = new UploadService();
