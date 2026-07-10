import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("Invalid ObjectId");
  }
  return value;
});

export const createCategoryValidation = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  attribute_id: objectId.required().messages({
    "any.required": "Attribute ID is required",
  }),
  image: Joi.string().required(),
  subcategories: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().trim().messages({
          "any.required": "Subcategory name is required",
          "string.empty": "Subcategory name cannot be empty",
        }),
      }),
    )
    .optional(),
});

export const updateCategoryValidation = Joi.object({
  name: Joi.string().optional().trim().messages({
    "string.empty": "Name cannot be empty",
  }),
  image: Joi.string().optional(),
  attribute_id: objectId.optional(),
});

export const createSubcategoryValidation = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Subcategory name is required",
    "string.empty": "Subcategory name cannot be empty",
  }),
  parent_id: objectId.required().messages({
    "any.required": "Parent category ID is required",
  })
});

export const updateSubcategoryValidation = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Subcategory name cannot be empty",
  }),
  parent_id: objectId.messages({}),
});
