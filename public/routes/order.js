import { Router } from "express";
import { validateRequest, validateRequestForParams, validateRequestForQuery } from "../middelware/validation.js";
import { createOrderValidation, createStripeSessionValidation, getMyOrdersValidation, getOrdersValidation, updateOrderStatusValidation } from "../validation/order.js";
import { verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";
import * as orderController from "../controllers/order.js";
import { commonIdValidation } from "../validation/common.js";
import express from "express";

const router = new Router();

router.post("/", verifytoken, validateRequest(createOrderValidation), orderController.createOrder); /* Create order by user */
router.get("/", verifyAdminToken, validateRequestForQuery(getOrdersValidation), orderController.getOrders); /* Get all order of user for admin */
router.get("/myOrders", verifytoken, validateRequestForQuery(getMyOrdersValidation), orderController.getMyOrders);
router.get("/:id", verifyAdminToken, validateRequestForParams(commonIdValidation), orderController.getSingleOrder); /* Get order by id for user */
router.put("/:id", verifyAdminToken, validateRequest(updateOrderStatusValidation), orderController.updateOrderStatus); /* Update order status by admin */

/* Create stripe session api */
router.post("/createSession", verifytoken, validateRequest(createStripeSessionValidation), orderController.createStripeSession);
router.post("/webhook", express.raw({ type: "application/json" }), orderController.stripeWebhook);

export default router;