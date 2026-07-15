// fileDeleteValidation

import Joi from "joi";

export const fileDeleteValidation = Joi.object({
  ids: Joi.array()
    .items(Joi.string().trim().required())
    .min(1)
    .required()
    .messages({
      "any.required": "Ids are required",
      "array.base": "Ids must be an array",
      "array.min": "At least one id is required",
    }),
});
