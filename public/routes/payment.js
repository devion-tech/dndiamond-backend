import { Router } from "express";
import { validateRequest } from "../middelware/validation.js";
import { verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";
import * as paymentController from "../controllers/payment.js";
import { commonIdValidation } from "../validation/common.js";
import { createStripeSessionValidation } from "../validation/payment.js";
import express from "express";

const router = new Router();

router.post("/createSession", verifytoken, validateRequest(createStripeSessionValidation), paymentController.createStripeSession); /* Create session api stripe */

router.post("/webhook", express.raw({ type: "application/json" }), paymentController.stripeWebhook); /* Webhook api for check order status */

export default router;