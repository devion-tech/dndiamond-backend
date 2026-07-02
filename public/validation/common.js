import Joi from "joi";
import mongoose from "mongoose";

// Note :- common pagination validation with id field
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

/* Common object id validation */
export const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }

  return value;
});

/* Pagination required */
export const pagValidation = Joi.object({
  page: Joi.number().required().min(1).default(1),
  limit: Joi.number().required().min(1).default(5).max(50),
  search: Joi.string().allow("")
});