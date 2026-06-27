import * as cartService from "../services/cart.js";
import { success } from "../helpers/response.js";

/* Add to cart with or without login */
export const addToCart = async (req, res, next) => {
    try {
        const result = await cartService.addToCart(
            req.user?._id || null,
            req.body
        );

        return success(
            res,
            result,
            "Product added to cart successfully"
        );
    } catch (error) {
        next(error);
    }
};