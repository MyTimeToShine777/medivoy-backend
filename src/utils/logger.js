'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGER UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

const getTimestamp = () => {
    return new Date().toISOString();
};

const log = (level, message, data) => {
    const timestamp = getTimestamp();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    if (level === LOG_LEVELS.ERROR) {
        console.error(logMessage, data || '');
    } else if (level === LOG_LEVELS.WARN) {
        console.warn(logMessage, data || '');
    } else if (level === LOG_LEVELS.INFO) {
        console.log(logMessage, data || '');
    } else if (level === LOG_LEVELS.DEBUG) {
        if (process.env.DEBUG === 'true') {
            console.log(logMessage, data || '');
        }
    }
};

export const logger = {
    error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
    warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
    info: (message, data) => log(LOG_LEVELS.INFO, message, data),
    debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data)
};

export default logger;