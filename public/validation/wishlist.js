import Joi from "joi";
import { objectId } from "./common.js";

export const addWishlistValidation = Joi.object({
    product_id: objectId.required().messages({
        "any.required": "Product id is required",
    }),
});
