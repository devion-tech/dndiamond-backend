import { errorHandler, getPagination, success } from "../helpers/response.js";
import * as promoCodeService from "../services/promoCode.js";

/* Create promo code */
export const createPromoCode = async (req, res) => {
    try {
        const result = await promoCodeService.createPromoCode(req.body);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, {}, "Promo code created successfully");

    } catch (error) {
        next(error);
    }
};

export const getPromoCodes = async (req, res, next) => {
    try {
        const { pageNumber, pageLimit, skip } = await getPagination(req.query);

        const result = await promoCodeService.getPromoCodes(
            {
                skip,
                limit: pageLimit,
                search: req.query.search || "",
            }
        );

        return success(
            res,
            {
                promo_codes: result.promoCodes,
                pagination: {
                    total: result.total,
                    page: pageNumber,
                    limit: pageLimit,
                    total_pages: Math.ceil(result.total / pageLimit),
                },
            },
            "Promo codes fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

/* Update promo code */
export const updatePromoCode = async (req, res, next) => {
    try {
        const result = await promoCodeService.updatePromoCode(req.params.id, req.body);

        if (!result.success) {
            return errorHandler(res, result.message);
        }
        return success(res, {}, "Promo code updated successfully");

    } catch (error) {
        next(error);
    }
};

export const deletePromoCode = async (req, res, next) => {
    try {
        const result = await promoCodeService.deletePromoCode(req.params.id);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, {}, "Promo code deleted successfully");
    } catch (error) {
        next(error);
    }
};