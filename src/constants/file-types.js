// File type constants for the Medivoy Healthcare System

module.exports = {
  // Image file types
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  IMAGE_GIF: 'image/gif',
  IMAGE_WEBP: 'image/webp',

  // Document file types
  DOCUMENT_PDF: 'application/pdf',
  DOCUMENT_DOC: 'application/msword',
  DOCUMENT_DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // Allowed file types for upload
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // Maximum file sizes (in bytes)
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
};