import Joi from "joi";

/* Create promo code validation */
export const createPromoCodeValidation = Joi.object({
    code: Joi.string()
        .trim()
        .uppercase()
        .required()
        .messages({
            "any.required": "Promo code is required"
        }),

    discount_type: Joi.string()
        .valid("fixed", "percentage")
        .required()
        .messages({
            "any.required": "Discount type is required",
        }),

    discount_value: Joi.number().min(1).required(),
    minimum_order_amount: Joi.number().min(0).default(0),
    maximum_discount_amount: Joi.number().min(0).default(0),
    usage_limit: Joi.number().min(0).default(0),
    start_date: Joi.date().required(),
    expiry_date: Joi.date().required(),
});

/* Update promo code validation */
export const updatePromoCodeValidation = Joi.object({
    code: Joi.string().trim().uppercase().optional(),
    discount_type: Joi.string().valid("fixed", "percentage").optional(),
    discount_value: Joi.number().min(1).optional(),
    minimum_order_amount: Joi.number().min(0).optional(),
    maximum_discount_amount: Joi.number().min(0).optional(),
    usage_limit: Joi.number().min(0).optional(),
    start_date: Joi.date().optional(),
    expiry_date: Joi.date().optional(),
    is_active: Joi.boolean().optional(),
});