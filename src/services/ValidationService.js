'use strict';

class ValidationService {
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, error: 'Email must be a string' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        return { valid: isValid, error: isValid ? null : 'Invalid email format' };
    }

    validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return { valid: false, error: 'Phone must be a string' };
        }
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        const isValid = phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
        return { valid: isValid, error: isValid ? null : 'Phone must be at least 10 digits' };
    }

    validatePassword(password) {
        if (!password || typeof password !== 'string') {
            return { valid: false, error: 'Password must be a string' };
        }
        const errors = [];
        if (password.length < 8) errors.push('Password must be at least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
        if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
        if (!/[0-9]/.test(password)) errors.push('Password must contain numbers');
        return { valid: errors.length === 0, error: errors.length > 0 ? errors.join(', ') : null };
    }

    validateUUID(uuid) {
        if (!uuid || typeof uuid !== 'string') {
            return { valid: false, error: 'UUID must be a string' };
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValid = uuidRegex.test(uuid);
        return { valid: isValid, error: isValid ? null : 'Invalid UUID format' };
    }

    validateDate(date) {
        if (!date) return { valid: false, error: 'Date is required' };
        const dateObj = new Date(date);
        const isValid = !isNaN(dateObj.getTime());
        return { valid: isValid, error: isValid ? null : 'Invalid date format' };
    }
}

export default new ValidationService();
