// Authentication Error - NO optional chaining
import AppError from './AppError.js';

class AuthenticationError extends AppError {
    constructor(message) {
        super(message || 'Authentication failed', 401);
        this.name = 'AuthenticationError';
    }
}

export default AuthenticationError;