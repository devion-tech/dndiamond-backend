import Joi from "joi";
import { objectId } from "./common.js";

/* Add to cart validation */
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

/* Get cart validation */
export const getCartValidation = Joi.object({
    guest_id: Joi.string().trim().optional(),
});

/* Update cart validation */
export const updateCartValidation = Joi.object({
    guest_id: Joi.string().optional(),
    item_id: Joi.string().required().messages({
        "any.required": "Item id is required",
    }),
    quantity: Joi.number().min(1).required().messages({
        "any.required": "Quantity is required",
    }),
});

/* Delete cart validation */
export const deleteCartValidation = Joi.object({
    guest_id: Joi.string().optional(),

    item_id: Joi.string().required().messages({
        "any.required": "Item id is required",
        "string.empty": "Item id cannot be empty",
    }),
});