import Joi from "joi";

export const fileDeleteValidation = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Id is required",
    "string.empty": "Id cannot be empty",
  }),
});
