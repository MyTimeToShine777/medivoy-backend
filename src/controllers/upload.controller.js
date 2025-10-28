const uploadService = require('../services/upload.service');
const { successResponse } = require('../utils/response');

class UploadController {
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const media = await uploadService.uploadFile(req.file, req.body.folder);
      return successResponse(res, media, 'File uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async uploadMultipleFiles(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      
      const media = await uploadService.uploadMultipleFiles(req.files, req.body.folder);
      return successResponse(res, media, 'Files uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req, res, next) {
    try {
      const result = await uploadService.deleteFile(req.params.id);
      return successResponse(res, result, 'File deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMedia(req, res, next) {
    try {
      const media = await uploadService.getMediaById(req.params.id);
      return successResponse(res, media, 'Media retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllMedia(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await uploadService.getAllMedia(filters, { page, limit });
      return successResponse(res, result, 'Media retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
