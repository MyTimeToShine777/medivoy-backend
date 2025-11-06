// Authorization Error - NO optional chaining
import AppError from './AppError.js';

class AuthorizationError extends AppError {
    constructor(message) {
        super(message || 'Access denied', 403);
        this.name = 'AuthorizationError';
    }
}

export default AuthorizationError;