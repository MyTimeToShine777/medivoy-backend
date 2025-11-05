const crypto = require('crypto');
const slugify = require('slugify');

/**
 * Generate random string
 * @param {Number} length - Length of string
 * @returns {String} Random string
 */
const generateRandomString = (length = 32) => crypto.randomBytes(length).toString('hex');

/**
 * Generate booking number
 * @returns {Promise<String>} Booking number (e.g., BK20240115001 or BK-UNIQUE-ID)
 */
const generateBookingNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  // Option 1: Date-based format
  return `BK${year}${month}${day}${random}`;

  // Option 2: Unique format (uncomment if preferred)
  // const timestamp = Date.now().toString(36).toUpperCase();
  // const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  // return `BK-${timestamp}-${randomStr}`;
};

/**
 * Generate appointment number
 * @returns {Promise<String>} Appointment number (e.g., AP20240115001)
 */
const generateAppointmentNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `AP${year}${month}${day}${random}`;
};

/**
 * Generate invoice number
 * @returns {Promise<String>} Invoice number (e.g., INV20240115001)
 */
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `INV${year}${month}${day}${random}`;
};

/**
 * Generate ticket number
 * @returns {Promise<String>} Ticket number (e.g., TKT20240115001)
 */
const generateTicketNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `TKT${year}${month}${day}${random}`;
};

/**
 * Generate slug from text
 * @param {String} text - Text to slugify
 * @returns {String} Slug
 */
const generateSlug = (text) => {
  if (!text) return '';

  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generate unique slug with counter
 * @param {String} text - Text to slugify
 * @param {Function} checkExists - Function to check if slug exists
 * @returns {Promise<String>} Unique slug
 */
const generateUniqueSlug = async (text, checkExists) => {
  let slug = generateSlug(text);
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${generateSlug(text)}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Paginate results
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination object
 */
const getPagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100); // Max 100 items per page
  const offset = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    offset,
  };
};

/**
 * Format pagination response
 * @param {Number} total - Total items
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const formatPaginationResponse = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Sanitize user input
 * @param {String} input - User input
 * @returns {String} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Format currency
 * @param {Number} amount - Amount
 * @param {String} currency - Currency code
 * @returns {String} Formatted currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  if (isNaN(amount)) return '0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calculate age from date of birth
 * @param {Date} dateOfBirth - Date of birth
 * @returns {Number} Age in years
 */
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  if (isNaN(birthDate.getTime())) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Mask sensitive data
 * @param {String} data - Data to mask
 * @param {Number} visibleChars - Number of visible characters
 * @returns {String} Masked data
 */
const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data) return '';

  const dataStr = String(data);
  if (dataStr.length <= visibleChars) return dataStr;

  const visible = dataStr.slice(-visibleChars);
  const masked = '*'.repeat(Math.max(dataStr.length - visibleChars, 0));

  return masked + visible;
};

/**
 * Mask email
 * @param {String} email - Email to mask
 * @returns {String} Masked email
 */
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;

  const [localPart, domain] = email.split('@');
  const maskedLocal = maskSensitiveData(localPart, 2);

  return `${maskedLocal}@${domain}`;
};

/**
 * Mask phone number
 * @param {String} phone - Phone number to mask
 * @returns {String} Masked phone
 */
const maskPhone = (phone) => {
  if (!phone) return '';

  const phoneStr = String(phone).replace(/\D/g, '');
  if (phoneStr.length < 4) return phoneStr;

  return maskSensitiveData(phoneStr, 4);
};

/**
 * Generate OTP
 * @param {Number} length - OTP length
 * @returns {String} OTP
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
};

/**
 * Check if date is in past
 * @param {Date} date - Date to check
 * @returns {Boolean} True if date is in past
 */
const isDateInPast = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Check if date is in future
 * @param {Date} date - Date to check
 * @returns {Boolean} True if date is in future
 */
const isDateInFuture = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

/**
 * Add days to date
 * @param {Date} date - Base date
 * @param {Number} days - Days to add
 * @returns {Date} New date
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @param {String} locale - Locale string
 * @returns {String} Formatted date
 */
const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';

  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date time to readable string
 * @param {Date} date - Date to format
 * @param {String} locale - Locale string
 * @returns {String} Formatted date time
 */
const formatDateTime = (date, locale = 'en-US') => {
  if (!date) return '';

  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Sleep/delay function
 * @param {Number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Number} maxRetries - Maximum number of retries
 * @param {Number} delay - Initial delay in ms
 * @returns {Promise} Result of function
 */
const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
};

module.exports = {
  generateRandomString,
  generateBookingNumber,
  generateAppointmentNumber,
  generateInvoiceNumber,
  generateTicketNumber,
  generateSlug,
  generateUniqueSlug,
  getPagination,
  formatPaginationResponse,
  sanitizeInput,
  formatCurrency,
  calculateAge,
  maskSensitiveData,
  maskEmail,
  maskPhone,
  generateOTP,
  isDateInPast,
  isDateInFuture,
  addDays,
  formatDate,
  formatDateTime,
  sleep,
  retryWithBackoff,
};
