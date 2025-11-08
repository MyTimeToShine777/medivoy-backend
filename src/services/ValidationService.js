// Validation Service - Advanced input validation
// NO optional chaining - Production Ready

class ValidationService {
    // ========== EMAIL VALIDATION ==========
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, error: 'Email must be a string' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        return {
            valid: isValid,
            error: isValid ? null : 'Invalid email format',
        };
    }

    // ========== PHONE VALIDATION ==========
    validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return { valid: false, error: 'Phone must be a string' };
        }

        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        const isValid = phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;

        return {
            valid: isValid,
            error: isValid ? null : 'Phone must be at least 10 digits',
        };
    }

    // ========== PASSWORD VALIDATION ==========
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
            error: errors.length > 0 ? errors.join('. ') : null,
            requirements: {
                minLength: password.length >= 8,
                hasUpperCase: /[A-Z]/.test(password),
                hasLowerCase: /[a-z]/.test(password),
                hasNumbers: /[0-9]/.test(password),
            },
        };
    }

    // ========== NAME VALIDATION ==========
    validateName(name) {
        if (!name || typeof name !== 'string') {
            return { valid: false, error: 'Name must be a string' };
        }

        const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
        const isValid = nameRegex.test(name);

        return {
            valid: isValid,
            error: isValid ? null : 'Name must be 2-50 characters with letters only',
        };
    }

    // ========== DATE VALIDATION ==========
    validateDate(date) {
        if (!date) {
            return { valid: false, error: 'Date is required' };
        }

        const dateObj = new Date(date);
        const isValidDate = dateObj instanceof Date && !isNaN(dateObj);

        return {
            valid: isValidDate,
            error: isValidDate ? null : 'Invalid date format',
        };
    }

    // ========== AGE VALIDATION ==========
    validateAge(birthDate, minAge = 18, maxAge = 120) {
        if (!birthDate) {
            return { valid: false, error: 'Birth date is required' };
        }

        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();

        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        const isValid = age >= minAge && age <= maxAge;

        return {
            valid: isValid,
            age,
            error: isValid ? null : `Age must be between ${minAge} and ${maxAge}`,
        };
    }

    // ========== NUMBER VALIDATION ==========
    validateNumber(value, min = null, max = null) {
        if (typeof value !== 'number' && isNaN(value)) {
            return { valid: false, error: 'Value must be a number' };
        }

        const num = Number(value);
        const errors = [];

        if (min !== null && num < min) {
            errors.push(`Value must be at least ${min}`);
        }
        if (max !== null && num > max) {
            errors.push(`Value must be at most ${max}`);
        }

        return {
            valid: errors.length === 0,
            error: errors.length > 0 ? errors.join('. ') : null,
        };
    }

    // ========== STRING LENGTH VALIDATION ==========
    validateStringLength(str, minLength = 1, maxLength = 255) {
        if (!str || typeof str !== 'string') {
            return { valid: false, error: 'Value must be a string' };
        }

        const length = str.length;
        const isValid = length >= minLength && length <= maxLength;

        return {
            valid: isValid,
            length,
            error: isValid ? null : `String must be between ${minLength} and ${maxLength} characters`,
        };
    }

    // ========== BOOKING DATA VALIDATION ==========
    validateBookingData(data) {
        const errors = [];
        const warnings = [];

        // Required fields
        if (!data.hospitalId) {
            errors.push('Hospital is required');
        }
        if (!data.treatmentId) {
            errors.push('Treatment is required');
        }
        if (!data.userId) {
            errors.push('User ID is required');
        }

        // Date validation
        if (!data.startDate) {
            errors.push('Start date is required');
        }
        if (!data.endDate) {
            errors.push('End date is required');
        }

        // Date logic validation
        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);

            if (isNaN(start)) {
                errors.push('Invalid start date format');
            } else if (isNaN(end)) {
                errors.push('Invalid end date format');
            } else if (end <= start) {
                errors.push('End date must be after start date');
            } else {
                const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                if (daysDiff > 365) {
                    warnings.push('Booking duration exceeds 365 days');
                }
            }
        }

        // Optional fields
        if (data.totalCost) {
            const costValidation = this.validateNumber(data.totalCost, 0.01, 999999);
            if (!costValidation.valid) {
                errors.push('Invalid total cost: ' + costValidation.error);
            }
        }

        if (data.status && !['inquiry', 'pending_confirmation', 'confirmed', 'payment_pending', 'payment_received', 'completed', 'cancelled'].includes(data.status)) {
            errors.push('Invalid booking status');
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }

    // ========== APPOINTMENT DATA VALIDATION ==========
    validateAppointmentData(data) {
        const errors = [];

        if (!data.doctorId) {
            errors.push('Doctor ID is required');
        }
        if (!data.patientId) {
            errors.push('Patient ID is required');
        }
        if (!data.appointmentDate) {
            errors.push('Appointment date is required');
        }

        // Validate appointment date is in future
        if (data.appointmentDate) {
            const appointmentDate = new Date(data.appointmentDate);
            const now = new Date();

            if (isNaN(appointmentDate)) {
                errors.push('Invalid appointment date format');
            } else if (appointmentDate < now) {
                errors.push('Appointment date must be in the future');
            }
        }

        if (data.status && !['requested', 'confirmed', 'completed', 'cancelled'].includes(data.status)) {
            errors.push('Invalid appointment status');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    // ========== PAYMENT DATA VALIDATION ==========
    validatePaymentData(data) {
        const errors = [];

        if (!data.bookingId) {
            errors.push('Booking ID is required');
        }
        if (!data.userId) {
            errors.push('User ID is required');
        }
        if (!data.amount) {
            errors.push('Amount is required');
        }

        // Validate amount
        if (data.amount) {
            const amountValidation = this.validateNumber(data.amount, 0.01, 999999);
            if (!amountValidation.valid) {
                errors.push('Invalid amount: ' + amountValidation.error);
            }
        }

        if (data.method && !['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'].includes(data.method)) {
            errors.push('Invalid payment method');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    // ========== REVIEW DATA VALIDATION ==========
    validateReviewData(data) {
        const errors = [];

        if (!data.userId) {
            errors.push('User ID is required');
        }
        if (!data.rating) {
            errors.push('Rating is required');
        }

        // Validate rating
        if (data.rating) {
            const ratingValidation = this.validateNumber(data.rating, 1, 5);
            if (!ratingValidation.valid) {
                errors.push('Rating must be between 1 and 5');
            }
        }

        if (!data.review || typeof data.review !== 'string') {
            errors.push('Review text is required');
        } else if (data.review.length < 10) {
            errors.push('Review must be at least 10 characters');
        } else if (data.review.length > 1000) {
            errors.push('Review must not exceed 1000 characters');
        }

        if (!data.doctorId && !data.hospitalId) {
            errors.push('Either doctor ID or hospital ID is required');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    // ========== PAGINATION VALIDATION ==========
    validatePagination(limit, offset) {
        const errors = [];

        let validLimit = parseInt(limit) || 20;
        let validOffset = parseInt(offset) || 0;

        if (validLimit < 1) {
            errors.push('Limit must be at least 1');
            validLimit = 20;
        }
        if (validLimit > 100) {
            errors.push('Limit cannot exceed 100');
            validLimit = 100;
        }

        if (validOffset < 0) {
            errors.push('Offset cannot be negative');
            validOffset = 0;
        }

        return {
            valid: errors.length === 0,
            limit: validLimit,
            offset: validOffset,
            errors,
        };
    }

    // ========== SEARCH FILTERS VALIDATION ==========
    validateSearchFilters(filters) {
        const errors = [];
        const sanitizedFilters = {};

        if (filters.search && typeof filters.search === 'string') {
            if (filters.search.length > 100) {
                errors.push('Search query cannot exceed 100 characters');
            }
            sanitizedFilters.search = filters.search.trim();
        }

        if (filters.startDate) {
            const startValidation = this.validateDate(filters.startDate);
            if (!startValidation.valid) {
                errors.push('Invalid start date');
            } else {
                sanitizedFilters.startDate = new Date(filters.startDate);
            }
        }

        if (filters.endDate) {
            const endValidation = this.validateDate(filters.endDate);
            if (!endValidation.valid) {
                errors.push('Invalid end date');
            } else {
                sanitizedFilters.endDate = new Date(filters.endDate);
            }
        }

        if (filters.minPrice && filters.maxPrice) {
            const minValidation = this.validateNumber(filters.minPrice, 0);
            const maxValidation = this.validateNumber(filters.maxPrice, 0);

            if (!minValidation.valid || !maxValidation.valid) {
                errors.push('Invalid price range');
            } else if (filters.minPrice > filters.maxPrice) {
                errors.push('Minimum price cannot exceed maximum price');
            } else {
                sanitizedFilters.minPrice = parseFloat(filters.minPrice);
                sanitizedFilters.maxPrice = parseFloat(filters.maxPrice);
            }
        }

        const paginationValidation = this.validatePagination(filters.limit, filters.offset);
        sanitizedFilters.limit = paginationValidation.limit;
        sanitizedFilters.offset = paginationValidation.offset;

        return {
            valid: errors.length === 0,
            sanitizedFilters,
            errors,
        };
    }

    // ========== VALIDATE REQUIRED FIELDS ==========
    validateRequiredFields(data, requiredFields) {
        const errors = [];

        requiredFields.forEach(field => {
            if (data[field] === undefined || data[field] === null || data[field] === '') {
                errors.push(`${field} is required`);
            }
        });

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    // ========== VALIDATE FILE UPLOAD ==========
    validateFileUpload(file, maxSizeInMB = 10, allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf']) {
        const errors = [];

        if (!file) {
            return { valid: false, error: 'File is required' };
        }

        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        const fileSize = file.size ? file.size : 0;
        const mimeType = file.mimetype ? file.mimetype : '';

        if (fileSize === 0) {
            errors.push('File size is 0');
        }
        if (fileSize > maxSizeInBytes) {
            errors.push(`File size must not exceed ${maxSizeInMB}MB`);
        }
        if (!allowedMimeTypes.includes(mimeType)) {
            errors.push(`File type must be one of: ${allowedMimeTypes.join(', ')}`);
        }

        return {
            valid: errors.length === 0,
            fileSize,
            mimeType,
            errors,
        };
    }

    // ========== VALIDATE URL ==========
    validateURL(url) {
        try {
            const urlObj = new URL(url);
            return {
                valid: true,
                protocol: urlObj.protocol,
                hostname: urlObj.hostname,
            };
        } catch (error) {
            return {
                valid: false,
                error: 'Invalid URL format',
            };
        }
    }

    // ========== VALIDATE ENUM ==========
    validateEnum(value, allowedValues) {
        const isValid = allowedValues.includes(value);

        return {
            valid: isValid,
            error: isValid ? null : `Value must be one of: ${allowedValues.join(', ')}`,
        };
    }

    // ========== SANITIZE STRING ==========
    sanitizeString(str) {
        if (typeof str !== 'string') {
            return '';
        }

        return str
            .trim()
            .replace(/[<>]/g, '')
            .substring(0, 1000);
    }

    // ========== SANITIZE OBJECT ==========
    sanitizeObject(obj, allowedFields = []) {
        if (typeof obj !== 'object' || obj === null) {
            return {};
        }

        const sanitized = {};

        Object.keys(obj).forEach(key => {
            if (allowedFields.length === 0 || allowedFields.includes(key)) {
                const value = obj[key];

                if (typeof value === 'string') {
                    sanitized[key] = this.sanitizeString(value);
                } else if (typeof value === 'number') {
                    sanitized[key] = value;
                } else if (typeof value === 'boolean') {
                    sanitized[key] = value;
                } else if (value instanceof Date) {
                    sanitized[key] = value;
                }
            }
        });

        return sanitized;
    }
}

export default new ValidationService();