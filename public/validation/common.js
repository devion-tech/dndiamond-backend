import Joi from "joi";

export const fileDeleteValidation = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Id is required",
    "string.empty": "Id cannot be empty",
  }),
});

// Note :- common pagination validation
export const paginationValidation = Joi.object({
  page: Joi.number().required().min(1).default(1),
  limit: Joi.number().required().min(1).default(5),
  search: Joi.string().allow(""),
  id: Joi.string().required(),
});

// Common validation of id
export const commonIdValidation = Joi.object({
  id: Joi.string().required(),
});
