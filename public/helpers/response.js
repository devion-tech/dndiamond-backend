export const success = (res, data = {}, message = "Success", status = 200 ) => {
    return res.status(status).json({
        status,
        success: true,
        message,
        data
    });
};

export const errorHandler = (res, message = "Something went wrong", status = 400, data = {}) => {
    return res.status(status).json({
        status,
        success: false,
        message,
        data
    });
};

export const getPagination = (query) => {

    const pageNumber = Number(query.page ?? 1);
    const pageLimit = Number(query.limit ?? 10);
    const skip = (pageNumber - 1) * pageLimit;

    return {
        pageNumber,
        pageLimit,
        skip
    };
};


