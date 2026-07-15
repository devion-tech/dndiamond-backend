import Joi from "joi";

/* Add landing page hero image validation */
export const createLandingValidation = Joi.object({
  title: Joi.string().trim().optional().allow(""),
  description: Joi.string().trim().optional().allow(""),
});

/* Update landing page hero image validation */
export const updateLandingValidation = Joi.object({
  title: Joi.string().trim().optional().allow(""),
  description: Joi.string().trim().optional().allow(""),
});
