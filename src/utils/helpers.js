// Helper Utility Functions - NO optional chaining
import logger from './logger.js';

const helpers = {
    // Safe object property access
    getProperty: (obj, path, defaultValue) => {
        if (obj === null || obj === undefined) {
            return defaultValue;
        }

        const keys = path.split('.');
        let result = obj;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (result === null || result === undefined) {
                return defaultValue;
            }
            result = result[key];
        }

        return result === undefined ? defaultValue : result;
    },

    // Format error response
    formatError: (error) => {
        if (error instanceof Error) {
            return {
                message: error.message,
                name: error.name,
            };
        }
        return {
            message: String(error),
            name: 'Unknown Error',
        };
    },

    // Generate random string
    generateRandomString: (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Generate booking reference
    generateBookingReference: () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `BK${timestamp}${random}`.toUpperCase();
    },

    // Generate invoice number
    generateInvoiceNumber: () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `INV${timestamp}${random}`.toUpperCase();
    },

    // Check if object is empty
    isEmpty: (obj) => {
        if (obj === null || obj === undefined) {
            return true;
        }
        if (typeof obj === 'string') {
            return obj.trim().length === 0;
        }
        if (Array.isArray(obj)) {
            return obj.length === 0;
        }
        if (typeof obj === 'object') {
            return Object.keys(obj).length === 0;
        }
        return false;
    },

    // Capitalize first letter
    capitalize: (str) => {
        if (typeof str !== 'string') {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Check if value is a valid number
    isValidNumber: (value) => {
        return value !== null && value !== undefined && !isNaN(value) && value !== '';
    },

    // Convert to integer safely
    toInt: (value, defaultValue) => {
        const num = parseInt(value);
        return isNaN(num) ? (defaultValue || 0) : num;
    },

    // Convert to float safely
    toFloat: (value, defaultValue) => {
        const num = parseFloat(value);
        return isNaN(num) ? (defaultValue || 0) : num;
    },

    // Format currency
    formatCurrency: (amount, currency) => {
        const currencySymbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            INR: '₹',
        };

        const symbol = currencySymbols[currency] || currency;
        const formattedAmount = parseFloat(amount).toFixed(2);
        return `${symbol}${formattedAmount}`;
    },

    // Calculate pagination
    calculatePagination: (page, limit, total) => {
        const currentPage = helpers.toInt(page, 1);
        const itemsPerPage = helpers.toInt(limit, 10);
        const totalItems = helpers.toInt(total, 0);
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            page: currentPage,
            limit: itemsPerPage,
            total: totalItems,
            totalPages: totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        };
    },

    // Sanitize phone number
    sanitizePhone: (phone) => {
        if (typeof phone !== 'string') {
            return phone;
        }
        return phone.replace(/[^0-9+]/g, '');
    },

    // Generate OTP
    generateOTP: (length) => {
        length = length || 6;
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    },

    // Mask email
    maskEmail: (email) => {
        if (typeof email !== 'string') {
            return email;
        }
        const parts = email.split('@');
        if (parts.length !== 2) {
            return email;
        }
        const username = parts[0];
        const domain = parts[1];
        const maskedUsername = username.substring(0, 2) + '***';
        return `${maskedUsername}@${domain}`;
    },

    // Mask phone
    maskPhone: (phone) => {
        if (typeof phone !== 'string') {
            return phone;
        }
        const length = phone.length;
        if (length < 4) {
            return phone;
        }
        return phone.substring(0, 2) + '***' + phone.substring(length - 2);
    },

    // Sleep function
    sleep: (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
};

export default helpers;