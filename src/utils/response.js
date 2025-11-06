// Response Formatting Utility - NO optional chaining
const sendSuccess = (res, statusCode, message, data) => {
    const response = {
        success: true,
        message: message || 'Success',
        data: data || null,
    };

    return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errorDetails) => {
    const response = {
        success: false,
        message: message || 'An error occurred',
    };

    if (process.env.NODE_ENV === 'development' && errorDetails !== undefined && errorDetails !== null) {
        response.error = errorDetails;
    }

    return res.status(statusCode).json(response);
};

const sendPaginatedSuccess = (res, statusCode, message, data, pagination) => {
    const response = {
        success: true,
        message: message || 'Success',
        data: data || [],
        pagination: {
            page: pagination && pagination.page ? pagination.page : 1,
            limit: pagination && pagination.limit ? pagination.limit : 10,
            total: pagination && pagination.total ? pagination.total : 0,
            totalPages: pagination && pagination.totalPages ? pagination.totalPages : 0,
        },
    };

    return res.status(statusCode).json(response);
};

export { sendSuccess, sendError, sendPaginatedSuccess };