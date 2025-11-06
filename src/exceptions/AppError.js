// Custom Error Classes - NO optional chaining
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.name = 'AppError';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;