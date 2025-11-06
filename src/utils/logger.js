// Logger Utility - NO optional chaining
const logger = {
    info: (message, data) => {
        const timestamp = new Date().toISOString();
        if (data !== undefined && data !== null) {
            console.log(`[${timestamp}] ℹ️  INFO: ${message}`, data);
        } else {
            console.log(`[${timestamp}] ℹ️  INFO: ${message}`);
        }
    },

    error: (message, error) => {
        const timestamp = new Date().toISOString();
        if (error !== undefined && error !== null) {
            const errorMessage = error.message ? error.message : String(error);
            console.error(`[${timestamp}] ❌ ERROR: ${message}`, errorMessage);
            if (error.stack && process.env.NODE_ENV === 'development') {
                console.error('Stack trace:', error.stack);
            }
        } else {
            console.error(`[${timestamp}] ❌ ERROR: ${message}`);
        }
    },

    warn: (message, data) => {
        const timestamp = new Date().toISOString();
        if (data !== undefined && data !== null) {
            console.warn(`[${timestamp}] ⚠️  WARN: ${message}`, data);
        } else {
            console.warn(`[${timestamp}] ⚠️  WARN: ${message}`);
        }
    },

    debug: (message, data) => {
        if (process.env.NODE_ENV === 'development') {
            const timestamp = new Date().toISOString();
            if (data !== undefined && data !== null) {
                console.log(`[${timestamp}] 🔧 DEBUG: ${message}`, data);
            } else {
                console.log(`[${timestamp}] 🔧 DEBUG: ${message}`);
            }
        }
    },
};

export default logger;