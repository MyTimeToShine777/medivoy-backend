// Validation Helper Functions - NO optional chaining
const validators = {
    // Validate email
    isValidEmail: (email) => {
        if (typeof email !== 'string') {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone
    isValidPhone: (phone) => {
        if (typeof phone !== 'string') {
            return false;
        }
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    },

    // Validate password
    isValidPassword: (password) => {
        if (typeof password !== 'string') {
            return false;
        }
        if (password.length < 8) {
            return false;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    },

    // Validate string length
    isValidLength: (str, minLength, maxLength) => {
        if (typeof str !== 'string') {
            return false;
        }
        const length = str.trim().length;
        if (minLength !== undefined && minLength !== null) {
            if (length < minLength) {
                return false;
            }
        }
        if (maxLength !== undefined && maxLength !== null) {
            if (length > maxLength) {
                return false;
            }
        }
        return true;
    },

    // Validate required fields
    hasRequiredFields: (obj, requiredFields) => {
        if (!Array.isArray(requiredFields)) {
            return false;
        }

        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            const value = obj[field];

            if (value === null || value === undefined || value === '') {
                return false;
            }
        }

        return true;
    },

    // Validate array of strings
    isStringArray: (arr) => {
        if (!Array.isArray(arr)) {
            return false;
        }
        return arr.every((item) => typeof item === 'string');
    },

    // Validate integer
    isValidInteger: (value) => {
        if (typeof value !== 'number') {
            return false;
        }
        return Number.isInteger(value) && value > 0;
    },

    // Validate decimal/float
    isValidDecimal: (value) => {
        if (typeof value !== 'number') {
            return false;
        }
        return !isNaN(value) && isFinite(value);
    },

    // Validate URL
    isValidURL: (url) => {
        if (typeof url !== 'string') {
            return false;
        }
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    },

    // Validate ISO date
    isValidDate: (dateString) => {
        if (typeof dateString !== 'string') {
            return false;
        }
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },

    // Validate enum value
    isValidEnum: (value, enumArray) => {
        if (!Array.isArray(enumArray)) {
            return false;
        }
        return enumArray.includes(value);
    },

    // Validate UUID
    isValidUUID: (uuid) => {
        if (typeof uuid !== 'string') {
            return false;
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    },

    // Validate booking reference
    isValidBookingReference: (ref) => {
        if (typeof ref !== 'string') {
            return false;
        }
        return ref.startsWith('BK') && ref.length >= 10;
    },
};

export default validators;