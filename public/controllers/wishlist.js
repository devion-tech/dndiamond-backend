import { errorHandler, getPagination, success } from "../helpers/response.js";
import * as wishlistService from "../services/wishlist.js";

/* Add wishlist by login user */
export const addWishlist = async (req, res, next) => {
    try {
        const result = await wishlistService.toggleWishlist(req.user, req.body.product_id);
        if (!result.success) {
            return errorHandler(res, result.message, 404);
        }
        return success(
            res,
            {
                count: result.wishlist_count,
            },
            result.is_wishlisted
                ? "Product added to wishlist"
                : "Product removed from wishlist"
        );
    } catch (error) {
        next(error);
    }
};

/* Get wishlist of user */
export const getWishlist = async (req, res, next) => {
    try {
        const { pageNumber, pageLimit, skip } = await getPagination(req.query);
        const currency = req.headers["x-currency"] || "HKD";
        const result = await wishlistService.getWishlist({ userId: req.user, page: pageNumber, limit: pageLimit, currency });
        return success(
            res,
            {
                ...result,
                page: pageNumber || 1,
                limit: pageLimit,
                total: result.total
            },
            "Wishlist fetched successfully"
        );

    } catch (error) {
        next(error);
    }
};
