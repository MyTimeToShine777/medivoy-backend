'use strict';

/**
 * ValidationService - Comprehensive input validation
 * Production-ready validation for all data types
 */
class ValidationService {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, error: 'Email must be a string' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email.trim());
        
        return {
            valid: isValid,
            error: isValid ? null : 'Invalid email format'
        };
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return { valid: false, error: 'Phone must be a string' };
        }
        
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        const cleanPhone = phone.replace(/\D/g, '');
        const isValid = phoneRegex.test(phone) && cleanPhone.length >= 10;
        
        return {
            valid: isValid,
            error: isValid ? null : 'Phone must be at least 10 digits'
        };
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validatePassword(password) {
        if (!password || typeof password !== 'string') {
            return { valid: false, error: 'Password must be a string' };
        }
        
        const errors = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain uppercase letters');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain lowercase letters');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain numbers');
        }
        
        return {
            valid: errors.length === 0,
            error: errors.length > 0 ? errors.join(', ') : null
        };
    }

    /**
     * Validate name
     * @param {string} name - Name to validate
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validateName(name) {
        if (!name || typeof name !== 'string') {
            return { valid: false, error: 'Name must be a string' };
        }
        
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        const isValid = nameRegex.test(name) && name.trim().length >= 2;
        
        return {
            valid: isValid,
            error: isValid ? null : 'Name must be at least 2 characters and contain only letters'
        };
    }

    /**
     * Validate date
     * @param {string|Date} date - Date to validate
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validateDate(date) {
        if (!date) {
            return { valid: false, error: 'Date is required' };
        }
        
        const dateObj = new Date(date);
        const isValid = !isNaN(dateObj.getTime());
        
        return {
            valid: isValid,
            error: isValid ? null : 'Invalid date format'
        };
    }

    /**
     * Validate age from birthdate
     * @param {Date} birthDate - Date of birth
     * @param {number} minAge - Minimum age (default 18)
     * @param {number} maxAge - Maximum age (default 120)
     * @returns {Object} {valid: boolean, error: string|null, age: number}
     */
    validateAge(birthDate, minAge = 18, maxAge = 120) {
        if (!birthDate) {
            return { valid: false, error: 'Birth date is required', age: null };
        }
        
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        const isValid = age >= minAge && age <= maxAge;
        
        return {
            valid: isValid,
            error: isValid ? null : `Age must be between ${minAge} and ${maxAge}`,
            age: age
        };
    }

    /**
     * Validate numeric value with optional range
     * @param {number} value - Value to validate
     * @param {number|null} min - Minimum value
     * @param {number|null} max - Maximum value
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validateNumber(value, min = null, max = null) {
        if (typeof value !== 'number' && isNaN(value)) {
            return { valid: false, error: 'Value must be a number' };
        }
        
        const num = Number(value);
        
        if (min !== null && num < min) {
            return { valid: false, error: `Value must be at least ${min}` };
        }
        
        if (max !== null && num > max) {
            return { valid: false, error: `Value must be at most ${max}` };
        }
        
        return { valid: true, error: null };
    }

    /**
     * Validate UUID format
     * @param {string} uuid - UUID to validate
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validateUUID(uuid) {
        if (!uuid || typeof uuid !== 'string') {
            return { valid: false, error: 'UUID must be a string' };
        }
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValid = uuidRegex.test(uuid);
        
        return {
            valid: isValid,
            error: isValid ? null : 'Invalid UUID format'
        };
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validateURL(url) {
        if (!url || typeof url !== 'string') {
            return { valid: false, error: 'URL must be a string' };
        }
        
        try {
            new URL(url);
            return { valid: true, error: null };
        } catch (e) {
            return { valid: false, error: 'Invalid URL format' };
        }
    }

    /**
     * Validate array
     * @param {Array} arr - Array to validate
     * @param {number|null} minLength - Minimum length
     * @param {number|null} maxLength - Maximum length
     * @returns {Object} {valid: boolean, error: string|null}
     */
    validateArray(arr, minLength = null, maxLength = null) {
        if (!Array.isArray(arr)) {
            return { valid: false, error: 'Value must be an array' };
        }
        
        if (minLength !== null && arr.length < minLength) {
            return { valid: false, error: `Array must have at least ${minLength} items` };
        }
        
        if (maxLength !== null && arr.length > maxLength) {
            return { valid: false, error: `Array must have at most ${maxLength} items` };
        }
        
        return { valid: true, error: null };
    }
}

export default new ValidationService();
