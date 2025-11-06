// Validation Error - NO optional chaining
import AppError from './AppError.js';

class ValidationError extends AppError {
    constructor(message, details) {
        super(message || 'Validation failed', 400);
        this.name = 'ValidationError';
        this.details = details || null;
    }
}

export default ValidationError;