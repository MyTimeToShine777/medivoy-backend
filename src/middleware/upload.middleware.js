const multer = require('multer');
const path = require('path');
const { ValidationError } = require('../utils/error-handler');
const { ALLOWED_MIME_TYPES, MAX_FILE_SIZES } = require('../constants/file-types');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type not allowed: ${file.mimetype}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZES.DOCUMENT,
  },
});

// Upload single file
const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple files
const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

// Upload fields
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
};
