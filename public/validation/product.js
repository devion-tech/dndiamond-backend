import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("Invalid ObjectId");
  }
  return value;
});

const optionValueSchema = Joi.object({
  value: Joi.string().required().trim().messages({
    "any.required": "Option value is required",
    "string.empty": "Option value cannot be empty",
  }),
  image: Joi.string().uri().trim().messages({
    "string.uri": "Option image must be a valid URL",
  }),
  price: Joi.number().messages({
    "number.base": "Option price must be a number",
  }),
  weight: Joi.number().messages({
    "number.base": "Option weight must be a number",
  }),
  is_disabled: Joi.boolean().messages({
    "boolean.base": "Option is_disabled must be a boolean",
  }),
});

const optionSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Option name is required",
    "string.empty": "Option name cannot be empty",
  }),
  values: Joi.array().items(optionValueSchema).min(1).required().messages({
    "any.required": "Option values are required",
    "array.min": "Option values must include at least one value",
    "array.base": "Option values must be an array",
  }),
}).custom((option, helpers) => {
  if (option.name.trim().toLowerCase() !== "gold_type") {
    return option;
  }

  const missingWeight = option.values.some(
    (value) => value.weight === undefined || value.weight === null,
  );

  if (missingWeight) {
    return helpers.message("Weight is required for gold_type option values");
  }

  return option;
});

export const createProductValidation = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Product name is required",
    "string.empty": "Product name cannot be empty",
  }),
  description: Joi.string().allow("", null).optional(),
  images: Joi.array().items(Joi.string().uri().trim()).min(1).required().messages({
    "any.required": "At least one product image is required",
    "array.min": "At least one product image is required",
    "array.base": "Images must be an array",
  }),
  slug: Joi.string().trim().lowercase().optional(),
  price: Joi.number().optional().messages({
    "number.base": "Price must be a number",
  }),
  category_id: objectId.required().messages({
    "any.required": "Category ID is required",
  }),
  subcategory_id: objectId.required().messages({
    "any.required": "Subcategory ID is required",
  }),
  attribute_id: objectId.required().messages({
    "any.required": "Attribute ID is required",
  }),
  options: Joi.array().items(optionSchema).optional(),
});
