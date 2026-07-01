import Joi from "joi";
import { objectId } from "./common.js";

export const reviewValidation = Joi.object({
    product_id: objectId.required().messages({ "any.required": "Product id is required" }),

    rating: Joi.number()
        .min(1)
        .max(5)
        .required()
        .messages({
            "any.required": "Rating is required",
            "number.min": "Rating must be at least 1",
            "number.max": "Rating cannot exceed 5",
        }),

    review: Joi.string().trim().max(1000).allow("").optional(),
});