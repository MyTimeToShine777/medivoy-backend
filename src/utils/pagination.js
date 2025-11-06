// Pagination Utility - NO optional chaining
import helpers from './helpers.js';

const paginationUtil = {
    // Get pagination params from request
    getPaginationParams: (query) => {
        const page = helpers.toInt(query.page, 1);
        const limit = helpers.toInt(query.limit, 10);
        const offset = (page - 1) * limit;

        return {
            page,
            limit,
            offset,
        };
    },

    // Build pagination response
    buildPaginationResponse: (data, total, page, limit) => {
        const pagination = helpers.calculatePagination(page, limit, total);

        return {
            data,
            pagination,
        };
    },

    // Get Sequelize pagination options
    getSequelizePagination: (page, limit) => {
        const offset = (page - 1) * limit;

        return {
            limit,
            offset,
        };
    },
};

export default paginationUtil;