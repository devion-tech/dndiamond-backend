import { errorHandler, success } from "../helpers/response.js";
import * as paymentService from "../services/payment.js"

/* Create stripe session */
export const createStripeSession = async (req, res, next) => {
    try {
        const result = await paymentService.createStripeSession(req.user, req.body.order_id);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, result.data, result.message);
    } catch (error) {
        next(error);
    }
};

/* Stripe webhook for payment status */
export const stripeWebhook = async (req, res, next) => {
    try {
        const result = await paymentService.stripeWebhook(req);

        return success(res, result.data, "Payment recived");
    } catch (error) {
        console.log(error);
        next(error);
    }
};