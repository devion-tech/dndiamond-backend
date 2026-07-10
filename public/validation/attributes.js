import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("Invalid ObjectId");
  }
  return value;
});

export const createAttributeValidation = Joi.object({
  type: Joi.string().required().trim().messages({
    "any.required": "Attribute type is required",
    "string.empty": "Attribute type cannot be empty",
  }),
  attributes: Joi.object()
    .pattern(
      Joi.string(),
      Joi.array()
        .items(
          Joi.object({
            value: Joi.string().required().trim().messages({
              "any.required": "Attribute value is required",
              "string.empty": "Attribute value cannot be empty",
            }),
          }),
        )
        .required(),
    )
    .required()
    .messages({
      "any.required": "Attributes object is required",
      "object.base": "Attributes must be an object with key-value pairs",
    }),
  diamond: Joi.object()
    .pattern(
      Joi.string(),
      Joi.array()
        .items(
          Joi.object({
            value: Joi.string().required().trim().messages({
              "any.required": "Attribute value is required",
              "string.empty": "Attribute value cannot be empty",
            }),
          }),
        )
        .required(),
    )
    .required()
    .messages({
      "any.required": "Attributes object is required",
      "object.base": "Attributes must be an object with key-value pairs",
    }),
});

export const updateAttributeValidation = Joi.object({
  type: Joi.string().trim().messages({
    "string.empty": "Attribute type cannot be empty",
  }),
  attributes: Joi.object()
    .pattern(
      Joi.string(),
      Joi.array()
        .items(
          Joi.object({
            value: Joi.string().required().trim().messages({
              "any.required": "Attribute value is required",
              "string.empty": "Attribute value cannot be empty",
            }),
          }),
        )
        .required(),
    )
    .messages({
      "object.base": "Attributes must be an object with key-value pairs",
    }),
  diamond: Joi.object()
    .pattern(
      Joi.string(),
      Joi.array()
        .items(
          Joi.object({
            value: Joi.string().required().trim().messages({
              "any.required": "Attribute value is required",
              "string.empty": "Attribute value cannot be empty",
            }),
          }),
        )
        .required(),
    )
    .required()
    .messages({
      "any.required": "Attributes object is required",
      "object.base": "Attributes must be an object with key-value pairs",
    }),
});
