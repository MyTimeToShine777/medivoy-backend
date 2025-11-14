'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION SERVICE - Created from scratch with Prisma
// Comprehensive input validation for the medical tourism platform
// ═══════════════════════════════════════════════════════════════════════════════

class ValidationService {
    // Email validation
    static validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, error: 'Email is required and must be a string' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, error: 'Invalid email format' };
        }

        return { valid: true };
    }

    // Phone validation
    static validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return { valid: false, error: 'Phone number is required and must be a string' };
        }

        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.length < 10 || cleaned.length > 15) {
            return { valid: false, error: 'Phone number must be between 10 and 15 digits' };
        }

        return { valid: true };
    }

    // Password validation
    static validatePassword(password) {
        if (!password || typeof password !== 'string') {
            return { valid: false, error: 'Password is required and must be a string' };
        }

        if (password.length < 8) {
            return { valid: false, error: 'Password must be at least 8 characters long' };
        }

        if (!/[A-Z]/.test(password)) {
            return { valid: false, error: 'Password must contain at least one uppercase letter' };
        }

        if (!/[a-z]/.test(password)) {
            return { valid: false, error: 'Password must contain at least one lowercase letter' };
        }

        if (!/[0-9]/.test(password)) {
            return { valid: false, error: 'Password must contain at least one number' };
        }

        return { valid: true };
    }

    // Name validation
    static validateName(name, fieldName = 'Name') {
        if (!name || typeof name !== 'string') {
            return { valid: false, error: `${fieldName} is required and must be a string` };
        }

        if (name.trim().length < 2) {
            return { valid: false, error: `${fieldName} must be at least 2 characters long` };
        }

        if (name.length > 100) {
            return { valid: false, error: `${fieldName} must not exceed 100 characters` };
        }

        return { valid: true };
    }

    // UUID validation
    static validateUUID(uuid, fieldName = 'ID') {
        if (!uuid || typeof uuid !== 'string') {
            return { valid: false, error: `${fieldName} is required and must be a string` };
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(uuid)) {
            return { valid: false, error: `${fieldName} must be a valid UUID` };
        }

        return { valid: true };
    }

    // Date validation
    static validateDate(date, fieldName = 'Date') {
        if (!date) {
            return { valid: false, error: `${fieldName} is required` };
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return { valid: false, error: `${fieldName} must be a valid date` };
        }

        return { valid: true, date: parsedDate };
    }

    // Age validation
    static validateAge(age, minAge = 0, maxAge = 120) {
        if (age === undefined || age === null) {
            return { valid: false, error: 'Age is required' };
        }

        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum)) {
            return { valid: false, error: 'Age must be a number' };
        }

        if (ageNum < minAge || ageNum > maxAge) {
            return { valid: false, error: `Age must be between ${minAge} and ${maxAge}` };
        }

        return { valid: true, age: ageNum };
    }

    // Number validation
    static validateNumber(value, fieldName = 'Number', min = null, max = null) {
        if (value === undefined || value === null) {
            return { valid: false, error: `${fieldName} is required` };
        }

        const num = parseFloat(value);
        if (isNaN(num)) {
            return { valid: false, error: `${fieldName} must be a number` };
        }

        if (min !== null && num < min) {
            return { valid: false, error: `${fieldName} must be at least ${min}` };
        }

        if (max !== null && num > max) {
            return { valid: false, error: `${fieldName} must not exceed ${max}` };
        }

        return { valid: true, number: num };
    }

    // URL validation
    static validateURL(url, fieldName = 'URL') {
        if (!url || typeof url !== 'string') {
            return { valid: false, error: `${fieldName} is required and must be a string` };
        }

        try {
            new URL(url);
            return { valid: true };
        } catch (error) {
            return { valid: false, error: `${fieldName} must be a valid URL` };
        }
    }

    // Array validation
    static validateArray(array, fieldName = 'Array', minLength = null, maxLength = null) {
        if (!Array.isArray(array)) {
            return { valid: false, error: `${fieldName} must be an array` };
        }

        if (minLength !== null && array.length < minLength) {
            return { valid: false, error: `${fieldName} must have at least ${minLength} items` };
        }

        if (maxLength !== null && array.length > maxLength) {
            return { valid: false, error: `${fieldName} must have at most ${maxLength} items` };
        }

        return { valid: true };
    }
}

export default ValidationService;
