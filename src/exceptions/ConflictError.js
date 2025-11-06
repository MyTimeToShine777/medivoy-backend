// Conflict Error - NO optional chaining
import AppError from './AppError.js';

class ConflictError extends AppError {
    constructor(message, resource) {
        const msg = message || `${resource || 'Resource'} already exists`;
        super(msg, 409);
        this.name = 'ConflictError';
        this.resource = resource || null;
    }
}

export default ConflictError;