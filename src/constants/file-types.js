/**
 * Allowed file types for uploads
 */

const FILE_TYPES = {
  IMAGES: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'image/svg+xml': ['.svg']
  },
  DOCUMENTS: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
    'text/csv': ['.csv']
  },
  MEDICAL: {
    'application/dicom': ['.dcm'],
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  }
};

const MAX_FILE_SIZES = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 25 * 1024 * 1024, // 25MB
  MEDICAL_RECORD: 50 * 1024 * 1024 // 50MB
};

const ALLOWED_MIME_TYPES = [
  ...Object.keys(FILE_TYPES.IMAGES),
  ...Object.keys(FILE_TYPES.DOCUMENTS),
  ...Object.keys(FILE_TYPES.MEDICAL)
];

module.exports = {
  FILE_TYPES,
  MAX_FILE_SIZES,
  ALLOWED_MIME_TYPES
};