// src/middleware/index.js
// Export commonly-used middleware as a convenience.

module.exports = {
    asyncHandler: require('./asyncHandler.middleware'),
    auth: require('./auth.middleware'),
    authorization: require('./authorization.middleware'),
    cache: require('./cache.middleware'),
    cors: require('./cors.middleware'),
    errorHandler: require('./errorHandler'),
    healthCheck: require('./healthCheck'),
    logger: require('./logger'),
    logging: require('./logging.middleware'),
    multilingual: require('./multilingual.middleware'),
    notFound: require('./notFound'),
    permission: require('./permission.middleware'),
    rateLimit: require('./rateLimit.middleware'),
    roleBasedAccess: require('./roleBasedAccess.middleware'),
    upload: require('./upload.middleware'),
    validateRequest: require('./validation.middleware')
};