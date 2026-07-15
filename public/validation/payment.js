import Joi from "joi";

/* Create Stripe session */
export const createStripeSessionValidation = Joi.object({
    order_id: Joi.string().required().messages({ "any.required": "Order id is required" })
});