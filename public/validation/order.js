import Joi from "joi";
import { objectId } from "./common.js";

/* Create Order Validation */
export const createOrderValidation = Joi.object({
  address_id: objectId.required().messages({
    "any.required": "Address is required",
  }),
  promo_code: Joi.string().trim().uppercase().allow("", null).optional(),
  notes: Joi.string().allow("", null).optional(),
});

/* Get Orders Validation */
export const getOrdersValidation = Joi.object({
  page: Joi.number().required().default(1),
  limit: Joi.number().required().default(10),
  order_status: Joi.string().optional().allow(""),
  payment_status: Joi.string().optional().allow(""),
  search: Joi.string().allow("").optional(),
});

/* Get My Orders Validation */
export const getMyOrdersValidation = Joi.object({
  page: Joi.number().default(1),
  limit: Joi.number().default(10),
  order_status: Joi.string().optional().allow(""),
  payment_status: Joi.string().optional().allow(""),
  search: Joi.string().allow("").optional().allow(""),
  start_date: Joi.date().iso().optional().allow(""),
  end_date: Joi.date()
    .iso()
    .min(Joi.ref("start_date"))
    .optional()
    .allow("")
    .messages({ "date.min": "end_date must be greater than or equal to start_date" }),
});

/* Update Order Status Validation */
export const updateOrderStatusValidation = Joi.object({
  order_status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned"
    )
    .required(),
});

/* Stripe session create api */
export const createStripeSessionValidation = Joi.object({
  order_id: objectId.required().messages({
    "any.required": "Order id is required",
  }),
});