const ImageKit = require('imagekit');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;

class ImageKitService {
  constructor() {
    // Initialize ImageKit client
    if (
      process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      this.imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });
      this.isConfigured = true;
    } else {
      logger.warn(
        'ImageKit credentials not configured. Image upload service will not work.'
      );
      this.imagekit = null;
      this.isConfigured = false;
    }

    this.defaultFolder = '/medivoy';
    this.allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  /**
   * Upload file to ImageKit
   * @param {Object} file - File object (from multer or buffer)
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Upload result
   */
  async uploadFile(file, options = {}) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Check file size
      const fileSize = file.size || file.buffer?.length || 0;
      if (fileSize > this.maxFileSize) {
        throw new Error(
          `File size exceeds maximum allowed size of ${this.maxFileSize / (1024 * 1024)}MB`
        );
      }

      // Prepare upload parameters
      const uploadParams = {
        file: file.buffer || file.path, // Buffer or file path
        fileName: options.fileName || file.originalname || `file_${Date.now()}`,
        folder: options.folder || this.defaultFolder,
        useUniqueFileName: options.useUniqueFileName !== false,
        tags: options.tags || [],
        responseFields: options.responseFields || [
          'tags',
          'customCoordinates',
          'isPrivateFile',
          'metadata',
        ],
      };

      // Add custom metadata if provided
      if (options.customMetadata) {
        uploadParams.customMetadata = options.customMetadata;
      }

      // Upload to ImageKit
      const result = await this.imagekit.upload(uploadParams);

      logger.info('File uploaded to ImageKit:', result.fileId);

      return {
        success: true,
        fileId: result.fileId,
        name: result.name,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        fileType: result.fileType,
        filePath: result.filePath,
        size: result.size,
        width: result.width,
        height: result.height,
        tags: result.tags,
        metadata: result.metadata,
      };
    } catch (error) {
      logger.error('ImageKit upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files to ImageKit
   * @param {Array} files - Array of file objects
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} - Array of upload results
   */
  async uploadMultipleFiles(files, options = {}) {
    try {
      if (!Array.isArray(files) || files.length === 0) {
        throw new Error('No files provided');
      }

      const uploadPromises = files.map((file) =>
        this.uploadFile(file, options)
      );
      const results = await Promise.allSettled(uploadPromises);

      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        logger.error(
          `File upload failed for ${files[index].originalname}:`,
          result.reason
        );
        return {
          success: false,
          fileName: files[index].originalname,
          error: result.reason.message,
        };
      });
    } catch (error) {
      logger.error('Multiple files upload error:', error);
      throw error;
    }
  }

  /**
   * Delete file from ImageKit
   * @param {string} fileId - File ID to delete
   * @returns {Promise<boolean>} - Deletion result
   */
  async deleteFile(fileId) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      await this.imagekit.deleteFile(fileId);
      logger.info('File deleted from ImageKit:', fileId);
      return true;
    } catch (error) {
      logger.error('ImageKit delete error:', error);
      throw error;
    }
  }

  /**
   * Delete multiple files from ImageKit
   * @param {Array<string>} fileIds - Array of file IDs to delete
   * @returns {Promise<Array>} - Array of deletion results
   */
  async deleteMultipleFiles(fileIds) {
    try {
      if (!Array.isArray(fileIds) || fileIds.length === 0) {
        throw new Error('No file IDs provided');
      }

      const deletePromises = fileIds.map((fileId) => this.deleteFile(fileId));
      const results = await Promise.allSettled(deletePromises);

      return results.map((result, index) => ({
        fileId: fileIds[index],
        success: result.status === 'fulfilled',
        error: result.status === 'rejected' ? result.reason.message : null,
      }));
    } catch (error) {
      logger.error('Multiple files deletion error:', error);
      throw error;
    }
  }

  /**
   * Get file details from ImageKit
   * @param {string} fileId - File ID
   * @returns {Promise<Object>} - File details
   */
  async getFileDetails(fileId) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      const result = await this.imagekit.getFileDetails(fileId);
      return result;
    } catch (error) {
      logger.error('ImageKit get file details error:', error);
      throw error;
    }
  }

  /**
   * List files from ImageKit
   * @param {Object} options - List options
   * @returns {Promise<Array>} - Array of files
   */
  async listFiles(options = {}) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      const listParams = {
        skip: options.skip || 0,
        limit: options.limit || 100,
        searchQuery: options.searchQuery || '',
        tags: options.tags || [],
        path: options.path || this.defaultFolder,
      };

      const result = await this.imagekit.listFiles(listParams);
      return result;
    } catch (error) {
      logger.error('ImageKit list files error:', error);
      throw error;
    }
  }

  /**
   * Update file details in ImageKit
   * @param {string} fileId - File ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} - Updated file details
   */
  async updateFileDetails(fileId, updates) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      const updateParams = {
        fileId,
        ...updates,
      };

      const result = await this.imagekit.updateFileDetails(updateParams);
      logger.info('File details updated in ImageKit:', fileId);
      return result;
    } catch (error) {
      logger.error('ImageKit update file details error:', error);
      throw error;
    }
  }

  /**
   * Generate URL with transformations
   * @param {string} path - File path or URL
   * @param {Object} transformations - Transformation options
   * @returns {string} - Transformed URL
   */
  getUrl(path, transformations = {}) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      const url = this.imagekit.url({
        path,
        transformation: [transformations],
      });

      return url;
    } catch (error) {
      logger.error('ImageKit get URL error:', error);
      throw error;
    }
  }

  /**
   * Generate thumbnail URL
   * @param {string} path - File path or URL
   * @param {number} width - Thumbnail width
   * @param {number} height - Thumbnail height
   * @returns {string} - Thumbnail URL
   */
  getThumbnailUrl(path, width = 200, height = 200) {
    return this.getUrl(path, {
      width,
      height,
      crop: 'at_max',
      quality: 80,
    });
  }

  /**
   * Generate optimized image URL
   * @param {string} path - File path or URL
   * @param {Object} options - Optimization options
   * @returns {string} - Optimized URL
   */
  getOptimizedUrl(path, options = {}) {
    const transformations = {
      quality: options.quality || 80,
      format: options.format || 'auto',
      ...options,
    };

    return this.getUrl(path, transformations);
  }

  /**
   * Purge cache for a file
   * @param {string} url - File URL to purge
   * @returns {Promise<Object>} - Purge result
   */
  async purgeCache(url) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      const result = await this.imagekit.purgeCache(url);
      logger.info('Cache purged for URL:', url);
      return result;
    } catch (error) {
      logger.error('ImageKit purge cache error:', error);
      throw error;
    }
  }

  /**
   * Get authentication parameters for client-side upload
   * @returns {Object} - Authentication parameters
   */
  getAuthenticationParameters() {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      const authParams = this.imagekit.getAuthenticationParameters();
      return authParams;
    } catch (error) {
      logger.error('ImageKit get authentication parameters error:', error);
      throw error;
    }
  }

  /**
   * Create folder in ImageKit
   * @param {string} folderName - Folder name
   * @param {string} parentFolderPath - Parent folder path
   * @returns {Promise<Object>} - Created folder details
   */
  async createFolder(folderName, parentFolderPath = '/') {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      const result = await this.imagekit.createFolder({
        folderName,
        parentFolderPath,
      });

      logger.info('Folder created in ImageKit:', folderName);
      return result;
    } catch (error) {
      logger.error('ImageKit create folder error:', error);
      throw error;
    }
  }

  /**
   * Delete folder from ImageKit
   * @param {string} folderPath - Folder path to delete
   * @returns {Promise<boolean>} - Deletion result
   */
  async deleteFolder(folderPath) {
    try {
      if (!this.isConfigured) {
        throw new Error('ImageKit service not configured');
      }

      await this.imagekit.deleteFolder(folderPath);
      logger.info('Folder deleted from ImageKit:', folderPath);
      return true;
    } catch (error) {
      logger.error('ImageKit delete folder error:', error);
      throw error;
    }
  }
}

module.exports = new ImageKitService();
