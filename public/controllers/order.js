import { errorHandler, getPagination, success } from "../helpers/response.js";
import * as orderService from "../services/order.js";

/* Create order when checkout */
export const createOrder = async (req, res, next) => {
    try {
        const currency = req.headers["x-currency"] || "HKD";
        const result = await orderService.createOrder(req.user, req.body, currency);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, result.data, "Order created successfully");
    } catch (error) {
        next(error);
    }
};

/* Get orders */
export const getOrders = async (req, res, next) => {
    try {
        const query = req.query;
        const { pageNumber, pageLimit, skip } = await getPagination(query);
        const result = await orderService.getOrders({
            page: pageNumber,
            limit: pageLimit,
            skip,
            order_status: query.order_status,
            payment_status: query.payment_status,
            search: query.search,
        });

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(
            res,
            {
                orders: result.orders,
                pagination: {
                    total: result.total,
                    page: pageNumber,
                    limit: pageLimit,
                    total_pages: Math.ceil(result.total / pageLimit),
                },
            },
            "Orders fetched successfully"
        );

    } catch (error) {
        next(error);
    }
};

/* Get user own order  */
export const getMyOrders = async (req, res, next) => {
    try {
        const query = req.query;
        const { pageNumber, pageLimit, skip } = await getPagination(query);

        const result = await orderService.getMyOrders({
            user_id: req.user,
            page: pageNumber,
            limit: pageLimit,
            skip,
            order_status: query.order_status,
            payment_status: query.payment_status,
            search: query.search,
            start_date: query.start_date,
            end_date: query.end_date,
        });

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(
            res,
            {
                orders: result.orders,
                pagination: {
                    total: result.total,
                    page: pageNumber,
                    limit: pageLimit,
                    total_pages: Math.ceil(result.total / pageLimit),
                },
            },
            "Orders fetched successfully");
    } catch (error) {
        next(error);
    }
};

/* Get single order */
export const getSingleOrder = async (req, res, next) => {
    try {
        const result = await orderService.getSingleOrder(req.params.id);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, result.data, result.message);

    } catch (error) {
        next(error);
    }
};

/* Update order status by admin */
export const updateOrderStatus = async (req, res, next) => {
    try {
        const result = await orderService.updateOrderStatus(req.params.id, req.body.order_status);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, {}, result.message);
    } catch (error) {
        next(error);
    }
};

/* Create Stripe Session API with validation */
export const createStripeSession = async (req, res, next) => {
    try {

        const result = await orderService.createStripeSession({
            userId: req.user,
            orderId: req.body.order_id,
        });

        return success(res, result, "Stripe session created successfully.");

    } catch (error) {
        next(error);
    }
};

/* Stripe webhook API call for confirmation */
export const stripeWebhook = async (req, res, next) => {
    try {
        await orderService.stripeWebhook(req);
        return res.status(200).send();

    } catch (error) {
        next(error);
    }
};