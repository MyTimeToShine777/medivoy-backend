const { validationResult } = require("express-validator");
const imagekitService = require("../services/imagekit.service");
const logger = require("../utils/logger");

/**
 * Upload single file
 */
exports.uploadFile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const options = {
      folder: req.body.folder || "/medivoy",
      tags: req.body.tags ? req.body.tags.split(",") : [],
      useUniqueFileName: req.body.useUniqueFileName !== "false",
      customMetadata: req.body.customMetadata
        ? JSON.parse(req.body.customMetadata)
        : undefined,
    };

    const result = await imagekitService.uploadFile(req.file, options);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Upload file controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

/**
 * Upload multiple files
 */
exports.uploadMultipleFiles = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    const options = {
      folder: req.body.folder || "/medivoy",
      tags: req.body.tags ? req.body.tags.split(",") : [],
      useUniqueFileName: req.body.useUniqueFileName !== "false",
      customMetadata: req.body.customMetadata
        ? JSON.parse(req.body.customMetadata)
        : undefined,
    };

    const results = await imagekitService.uploadMultipleFiles(
      req.files,
      options,
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    res.status(201).json({
      success: true,
      message: `${successCount} files uploaded successfully, ${failCount} failed`,
      data: results,
    });
  } catch (error) {
    logger.error("Upload multiple files controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload files",
      error: error.message,
    });
  }
};

/**
 * Delete file
 */
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    await imagekitService.deleteFile(fileId);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    logger.error("Delete file controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

/**
 * Delete multiple files
 */
exports.deleteMultipleFiles = async (req, res) => {
  try {
    const { fileIds } = req.body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File IDs array is required",
      });
    }

    const results = await imagekitService.deleteMultipleFiles(fileIds);

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    res.status(200).json({
      success: true,
      message: `${successCount} files deleted successfully, ${failCount} failed`,
      data: results,
    });
  } catch (error) {
    logger.error("Delete multiple files controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete files",
      error: error.message,
    });
  }
};

/**
 * Get file details
 */
exports.getFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    const result = await imagekitService.getFileDetails(fileId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Get file details controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get file details",
      error: error.message,
    });
  }
};

/**
 * List files
 */
exports.listFiles = async (req, res) => {
  try {
    const options = {
      skip: parseInt(req.query.skip) || 0,
      limit: parseInt(req.query.limit) || 100,
      searchQuery: req.query.searchQuery || "",
      tags: req.query.tags ? req.query.tags.split(",") : [],
      path: req.query.path || "/medivoy",
    };

    const results = await imagekitService.listFiles(options);

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        skip: options.skip,
        limit: options.limit,
        total: results.length,
      },
    });
  } catch (error) {
    logger.error("List files controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to list files",
      error: error.message,
    });
  }
};

/**
 * Update file details
 */
exports.updateFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;
    const updates = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    const result = await imagekitService.updateFileDetails(fileId, updates);

    res.status(200).json({
      success: true,
      message: "File details updated successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Update file details controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update file details",
      error: error.message,
    });
  }
};

/**
 * Get transformed URL
 */
exports.getTransformedUrl = async (req, res) => {
  try {
    const { path } = req.body;
    const transformations = req.body.transformations || {};

    if (!path) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    const url = imagekitService.getUrl(path, transformations);

    res.status(200).json({
      success: true,
      data: { url },
    });
  } catch (error) {
    logger.error("Get transformed URL controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get transformed URL",
      error: error.message,
    });
  }
};

/**
 * Get thumbnail URL
 */
exports.getThumbnailUrl = async (req, res) => {
  try {
    const { path } = req.body;
    const width = parseInt(req.body.width) || 200;
    const height = parseInt(req.body.height) || 200;

    if (!path) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    const url = imagekitService.getThumbnailUrl(path, width, height);

    res.status(200).json({
      success: true,
      data: { url },
    });
  } catch (error) {
    logger.error("Get thumbnail URL controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get thumbnail URL",
      error: error.message,
    });
  }
};

/**
 * Get optimized URL
 */
exports.getOptimizedUrl = async (req, res) => {
  try {
    const { path } = req.body;
    const options = req.body.options || {};

    if (!path) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    const url = imagekitService.getOptimizedUrl(path, options);

    res.status(200).json({
      success: true,
      data: { url },
    });
  } catch (error) {
    logger.error("Get optimized URL controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get optimized URL",
      error: error.message,
    });
  }
};

/**
 * Purge cache
 */
exports.purgeCache = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const result = await imagekitService.purgeCache(url);

    res.status(200).json({
      success: true,
      message: "Cache purged successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Purge cache controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to purge cache",
      error: error.message,
    });
  }
};

/**
 * Get authentication parameters for client-side upload
 */
exports.getAuthParams = async (req, res) => {
  try {
    const authParams = imagekitService.getAuthenticationParameters();

    res.status(200).json({
      success: true,
      data: authParams,
    });
  } catch (error) {
    logger.error("Get auth params controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get authentication parameters",
      error: error.message,
    });
  }
};

/**
 * Create folder
 */
exports.createFolder = async (req, res) => {
  try {
    const { folderName, parentFolderPath } = req.body;

    if (!folderName) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const result = await imagekitService.createFolder(
      folderName,
      parentFolderPath || "/",
    );

    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Create folder controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create folder",
      error: error.message,
    });
  }
};

/**
 * Delete folder
 */
exports.deleteFolder = async (req, res) => {
  try {
    const { folderPath } = req.body;

    if (!folderPath) {
      return res.status(400).json({
        success: false,
        message: "Folder path is required",
      });
    }

    await imagekitService.deleteFolder(folderPath);

    res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    logger.error("Delete folder controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete folder",
      error: error.message,
    });
  }
};

/**
 * Get all media
 */
exports.getAllMedia = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (type) {
      whereClause.file_type = type;
    }

    const { count, rows } = await Media.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
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
    res.status(500).json({
      success: false,
      message: "Error fetching media",
      error: error.message,
    });
  }
};

/**
 * Get media by ID
 */
exports.getMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching media",
      error: error.message,
    });
  }
};
