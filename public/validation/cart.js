import Joi from "joi";
import { objectId } from "./common.js";

/* Add to cart joi validation */
export const addToCartValidation = Joi.object({
    guest_id: Joi.string().optional(),

    product_id: objectId.required().messages({
        "any.required": "Product ID is required",
    }),

    quantity: Joi.number().integer().min(1).required().messages({
        "any.required": "Quantity is required",
        "number.min": "Quantity must be at least 1",
    }),

    selected_options: Joi.object()
        .pattern(Joi.string(), Joi.string())
        .min(1)
        .required()
        .messages({
            "any.required": "Selected options are required",
        }),
});