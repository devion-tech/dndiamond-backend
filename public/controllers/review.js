import { errorHandler, success } from "../helpers/response.js";
import * as reviewService from "../services/review.js";

/* Add review API */
export const addReview = async (req, res, next) => {
    try {
        const result = await reviewService.addReview({
            user_id: req.user,
            product_id: req.body.product_id,
            rating: req.body.rating,
            review: req.body.review,
        });

        if (!result.success) {
            return errorHandler(res, result?.message, result?.status);
        }

        return success(res, {}, result.message);
    } catch (error) {
        next(error);
    }
};

/* Delete review */
export const deleteReview = async (req, res, next) => {
    try {
        const result = await reviewService.deleteReview(req.params.id, req.user);

        if (!result.success) {
            return errorHandler(res, result?.message, 404);
        }

        return success(res, {}, result.message);
    } catch (error) {
        next(error);
    }
};