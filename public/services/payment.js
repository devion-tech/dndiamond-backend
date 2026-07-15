import Order from "../models/order.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js"

/* Create stripe session */
export const createStripeSession = async (userId, orderId) => {

    const order = await Order.findOne({
        _id: orderId,
        user_id: userId,
        is_deleted: 0,
    });

    if (!order) {
        return {
            success: false,
            message: "Order not found",
        };
    }

    if (order.payment_status === "paid") {
        return {
            success: false,
            message: "Order already paid",
        };
    }

    return {
        success: true,
        message: "Stripe session created successfully",
        data: {
            order_id: order._id,
            amount: order.total_amount,
            currency: "usd",
            checkout_url: null, /* session.url */
        },
    };
};

/* Stripe web hook */
export const stripeWebhook = async (req) => {

    const event = req.body;

    switch (event.type) {

        case "checkout.session.completed": {

            const session = event.data.object;
            const orderId = session.metadata.order_id;

            const order = await Order.findById(orderId);

            if (!order) { return; }

            if (order.payment_status === "paid") {
                return;
            }

            order.payment_status = "paid";
            order.order_status = "confirmed";
            await order.save();

            // Reduce Stock
            for (const item of order.products) {

                await Product.updateOne(
                    {
                        _id: item.product_id,
                    },
                    {
                        $inc: {
                            qty: -item.quantity,
                        },
                    }
                );
            }

            // Clear Cart
            await Cart.updateOne(
                {
                    user_id: order.user_id,
                },
                {
                    $set: {
                        items: [],
                    },
                }
            );

            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }
};