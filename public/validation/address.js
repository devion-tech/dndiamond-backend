import Joi from "joi";

/* Create address validation */
export const createAddressValidation = Joi.object({
    first_name: Joi.string().trim().required().messages({
        "any.required": "Full name is required",
    }),
    last_name: Joi.string().trim().required().messages({
        "any.required": "Full name is required",
    }),
    mobile: Joi.string().trim().required().messages({
        "any.required": "Mobile number is required",
    }),
    email: Joi.string().email().optional(),
    country: Joi.string().trim().required().messages({
        "any.required": "Country is required",
    }),
    state: Joi.string().trim().required().messages({
        "any.required": "State is required",
    }),
    city: Joi.string().trim().required().messages({
        "any.required": "City is required",
    }),
    address_line_1: Joi.string().trim().required().messages({
        "any.required": "Address line 1 is required",
    }),
    address_line_2: Joi.string().trim().allow("", null).optional(),
    landmark: Joi.string().trim().allow("", null).optional(),
    postal_code: Joi.string().trim().required().messages({
        "any.required": "Postal code is required",
    }),
});

/* Update address validation */
export const updateAddressValidation = Joi.object({
    first_name: Joi.string().trim().optional(),
    last_name: Joi.string().trim().optional(),
    mobile: Joi.string().trim().optional(),
    email: Joi.string().email().optional(),
    country: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    address_line_1: Joi.string().trim().optional(),
    address_line_2: Joi.string()
        .trim()
        .allow("", null)
        .optional(),
    landmark: Joi.string()
        .trim()
        .allow("", null)
        .optional(),
    postal_code: Joi.string().trim().optional(),
    is_default: Joi.number().optional().valid(0, 1).messages({
        "any.only": "is_default must be either 0 or 1",
    }),
});