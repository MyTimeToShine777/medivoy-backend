// Not Found Error - NO optional chaining
import AppError from './AppError.js';

class NotFoundError extends AppError {
    constructor(message, resource) {
        const msg = message || `${resource || 'Resource'} not found`;
        super(msg, 404);
        this.name = 'NotFoundError';
        this.resource = resource || null;
    }
}

export default NotFoundError;