const crypto = require("crypto");
const slugify = require("slugify");

/**
 * Generate random string
 * @param {Number} length - Length of string
 * @returns {String} Random string
 */
const generateRandomString = (length = 32) =>
  crypto.randomBytes(length).toString("hex");

/**
 * Generate booking number
 * @returns {String} Booking number (e.g., BK20240115001)
 */
const generateBookingNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `BK${year}${month}${day}${random}`;
};

/**
 * Generate appointment number
 * @returns {String} Appointment number (e.g., AP20240115001)
 */
const generateAppointmentNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `AP${year}${month}${day}${random}`;
};

/**
 * Generate invoice number
 * @returns {String} Invoice number (e.g., INV20240115001)
 */
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV${year}${month}${day}${random}`;
};

/**
 * Generate ticket number
 * @returns {String} Ticket number (e.g., TKT20240115001)
 */
const generateTicketNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `TKT${year}${month}${day}${random}`;
};

/**
 * Generate slug from text
 * @param {String} text - Text to slugify
 * @returns {String} Slug
 */
const generateSlug = (text) =>
  slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });

/**
 * Generate unique slug with counter
 * @param {String} text - Text to slugify
 * @param {Function} checkExists - Function to check if slug exists
 * @returns {String} Unique slug
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
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
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
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "") // Remove < and >
    .trim();
};

/**
 * Format currency
 * @param {Number} amount - Amount
 * @param {String} currency - Currency code
 * @returns {String} Formatted currency
 */
const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

/**
 * Calculate age from date of birth
 * @param {Date} dateOfBirth - Date of birth
 * @returns {Number} Age in years
 */
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
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
  if (!data || data.length <= visibleChars) return data;

  const visible = data.slice(-visibleChars);
  const masked = "*".repeat(data.length - visibleChars);

  return masked + visible;
};

/**
 * Generate OTP
 * @param {Number} length - OTP length
 * @returns {String} OTP
 */
const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

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
const isDateInPast = (date) => new Date(date) < new Date();

/**
 * Check if date is in future
 * @param {Date} date - Date to check
 * @returns {Boolean} True if date is in future
 */
const isDateInFuture = (date) => new Date(date) > new Date();

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
  generateOTP,
  isDateInPast,
  isDateInFuture,
  addDays,
};
