import { errorHandler, getPagination, success } from "../helpers/response.js";
import * as diamondInquiryService from "../services/diamondInquiry.js";

/* Send diamond inquiry to admin */
export const createDiamondInquiry = async (req, res, next) => {
    try {
        const result = await diamondInquiryService.createDiamondInquiry(req.body, req.user || null);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, result.data, result.message);
    } catch (error) {
        next(error);
    }
};

/* Get diamond inquiry for admin */
export const getDiamondInquiries = async (req, res, next) => {
    try {
        const query = req.query;
        const { pageNumber, pageLimit, skip } = await getPagination(query);
        const result = await diamondInquiryService.getDiamondInquiries({
            page: pageNumber,
            limit: pageLimit,
            skip,
            status: query.status,
            search: query.search,
        });
        return success(
            res,
            {
                Inquiries: result.inquiries,
                pagination: {
                    total: result.total,
                    page: pageNumber,
                    limit: pageLimit,
                    total_pages: Math.ceil(result.total / pageLimit),
                },
            },
            "Diamond inquiries fetched successfully."
        );
    } catch (error) {
        next(error);
    }
};

/* Get my inquiry */
export const getMyInquiries = async (req, res, next) => {
    try {
        const query = req.query;
        const { pageNumber, pageLimit, skip } = await getPagination(query);

        const result = await diamondInquiryService.getMyInquiries({
            userId: req.user,
            page: pageNumber,
            limit: pageLimit,
            skip
        });

        return success(
            res,
            {
                myInquiry: result.myInquiry,
                pagination: {
                    total: result.total,
                    page: pageNumber,
                    limit: pageLimit,
                    total_pages: Math.ceil(result.total / pageLimit),
                },
            },
            "My inquiries fetched successfully."
        );

    } catch (error) {
        next(error);
    }
};

/* Update diamond inquiry by admin */
export const updateDiamondInquiry = async (req, res, next) => {
    try {
        const result = await diamondInquiryService.updateDiamondInquiry(req.params.id, req.body);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, {}, result.message);
    } catch (error) {
        next(error);
    }
};

/* Delete diamond inquiry by admin */
export const deleteDiamondInquiry = async (req, res, next) => {
    try {
        const result = await diamondInquiryService.deleteDiamondInquiry(req.params.id);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, {}, result.message);
    } catch (error) {
        next(error);
    }
};