// Database Error - NO optional chaining
import AppError from './AppError.js';

class DatabaseError extends AppError {
    constructor(message, originalError) {
        super(message || 'Database operation failed', 500);
        this.name = 'DatabaseError';
        this.originalError = originalError || null;
    }
}

export default DatabaseError;