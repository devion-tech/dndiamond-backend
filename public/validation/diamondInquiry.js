import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("Invalid ObjectId");
    }
    return value;
});

export const sendInquiryValidation = Joi.object({
    budget_min: Joi.number().min(0).optional(),
    budget_max: Joi.number().min(0).optional(),
    carat_min: Joi.number().min(0).optional(),
    carat_max: Joi.number().min(0).optional(),
    shape: Joi.string().allow("").optional(),
    clarity_grades: Joi.array().items(Joi.string()).default([]),
    color_grades: Joi.array().items(Joi.string()).default([]),
    certification_labs: Joi.array().items(Joi.string()).default([]),
    cut_grades: Joi.array().items(Joi.string()).default([]),
    polish_grades: Joi.array().items(Joi.string()).default([]),
    symmetry_grades: Joi.array().items(Joi.string()).default([]),
    fluorescence_intensity: Joi.array().items(Joi.string()).default([]),
    additional_notes: Joi.string().allow("").optional(),
});

export const getDiamondInquiryValidation = Joi.object({
    page: Joi.number().integer().required().min(1).default(1),
    limit: Joi.number().integer().required().min(1).max(100).default(10),
    status: Joi.string().valid("new", "contacted", "quoted", "closed", "cancelled").optional(),
    search: Joi.string().allow("").optional(),
});

/* Update diamond inquiry validation */
export const updateDiamondInquiryValidation = Joi.object({
    status: Joi.string().valid("new", "contacted", "quoted", "closed", "cancelled").optional(),
    admin_notes: Joi.string().allow("").optional(),
}).min(1);