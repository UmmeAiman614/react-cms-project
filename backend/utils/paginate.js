const paginate = async (model, query = {}, reqQuery = {}, options = {}) => {
    const { page = 1, limit = 2, sort = '-createdAt' } = reqQuery;
    const paginationOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        ...options
    };
    try {
        const result = await model.paginate(query, paginationOptions);
        return {
            data: result.docs,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            limit: result.limit,
            total: result.totalDocs,
            counter: result.pagingCounter,
            currentPage: result.page,
            totalPages: result.totalPages
        };
    } catch (error) {
        console.log('pagination error', error.message);
    }
};

export default paginate;
