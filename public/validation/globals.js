import Joi from "joi";

export const addGlobalsValidation = Joi.object({
  "10k": Joi.number().required().messages({
    "any.required": "10k value is required",
    "number.base": "10k must be a number",
  }),
  "14k": Joi.number().required().messages({
    "any.required": "14k value is required",
    "number.base": "14k must be a number",
  }),
  "18k": Joi.number().required().messages({
    "any.required": "18k value is required",
    "number.base": "18k must be a number",
  }),
  "22k": Joi.number().required().messages({
    "any.required": "22k value is required",
    "number.base": "22k must be a number",
  }),
  "24k": Joi.number().required().messages({
    "any.required": "24k value is required",
    "number.base": "24k must be a number",
  }),
  making_charge: Joi.number().required().messages({
    "any.required": "Making charge is required",
    "number.base": "Making charge must be a number",
  }),
});

export const updateGlobalsValidation = Joi.object({
  "10k": Joi.number().messages({
    "number.base": "10k must be a number",
  }),
  "14k": Joi.number().messages({
    "number.base": "14k must be a number",
  }),
  "18k": Joi.number().messages({
    "number.base": "18k must be a number",
  }),
  "22k": Joi.number().messages({
    "number.base": "22k must be a number",
  }),
  "24k": Joi.number().messages({
    "number.base": "24k must be a number",
  }),
  making_charge: Joi.number().messages({
    "number.base": "Making charge must be a number",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
