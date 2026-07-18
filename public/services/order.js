import Address from "../models/address.js";
import Globals from "../models/globals.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import PromoCode from "../models/promoCode.js";
import { calculateSelectedGoldPrice } from "../utills/productPrice.helper.js";
import { JEWELLERY, ROLE } from "../helpers/constant.js";

/* Create Order */
export const createOrder = async (userId, payload, currency) => {

    const { address_id, promo_code = null, notes = "", } = payload;

    // Get Cart
    const cart = await Cart.findOne({ user_id: userId }).populate("items.product_id");

    if (!cart || !cart.items.length) {
        return {
            success: false,
            message: "Cart is empty",
        };
    }

    // Get Address
    const address = await Address.findOne({
        _id: address_id,
        user_id: userId,
        is_deleted: 0,
    });

    if (!address) {
        return {
            success: false,
            message: "Address not found",
        };
    }

    const pricingSettings = await Globals.findOne();

    const orderProducts = [];

    let subtotal = 0;

    // Calculate prices again
    for (const item of cart.items) {
        const product = item.product_id;

        if (!product || product.is_deleted === 1) {
            continue;
        }

        let unitPrice = product.price_snapshot;

        // Jewellery Dynamic Price
        if (product.product_type === JEWELLERY) {
            const selectedGoldType = item.selected_options?.gold_type;

            unitPrice = calculateSelectedGoldPrice(
                product,
                pricingSettings,
                selectedGoldType,
                currency
            );
        }

        const totalPrice = unitPrice * item.quantity;

        subtotal += totalPrice;

        orderProducts.push({
            product_id: product._id,
            name: product.name,
            image: product.images?.[0] || "",
            quantity: item.quantity,
            selected_options: item.selected_options,
            price: unitPrice,
            total_price: totalPrice,
        });
    }

    // Promo Code Logic
    let discountAmount = 0;

    if (promo_code) {
        const promo = await PromoCode.findOne({
            code: promo_code,
            is_active: true,
        });

        if (promo) {
            if (promo.discount_type === "percentage") {
                discountAmount = (subtotal * promo.discount_value) / 100;

                if (promo.maximum_discount && discountAmount > promo.maximum_discount) {
                    discountAmount = promo.maximum_discount;
                }
            } else {
                discountAmount = promo.discount_value;
            }
        }
    }

    const shippingCharge = 0;

    const totalAmount = subtotal + shippingCharge - discountAmount;

    // Generate Order Number
    const orderNumber = `ORD${Date.now()}`;

    const order = await Order.create({
        user_id: userId,
        order_number: orderNumber,
        products: orderProducts,
        address: {
            first_name: address.first_name,
            last_name: address.last_name,
            mobile: address.mobile,
            email: address.email,
            country: address.country,
            city: address.city,
            state: address.state,
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2,
            landmark: address.landmark,
            postal_code: address.postal_code,
        },

        promo_code,
        discount_amount: discountAmount,
        subtotal,
        shipping_charge: shippingCharge,
        total_amount: totalAmount,
        notes,
    });

    // Clear Cart
    cart.products = [];
    await cart.save();

    return {
        success: true,
        data: order,
    };
};

/* Get Orders */
export const getOrders = async ({
    page = 1,
    limit = 10,
    skip,
    order_status,
    payment_status,
    search
}) => {

    const filter = { is_deleted: 0 };

    if (order_status) {
        filter.order_status = order_status;
    }

    if (payment_status) {
        filter.payment_status = payment_status;
    }

    if (search) {
        filter.order_number = {
            $regex: search,
            $options: "i",
        };
    }

    const orders = await Order.find(filter)
        .populate("user_id", "name email")
        .select("-__v -is_deleted -updatedAt")
        .sort({ createdAt: -1, })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments(filter);

    return {
        success: true,
        orders,
        total
    };
};

/* Get User's own Orders */
export const getMyOrders = async ({
    page = 1,
    limit = 10,
    skip,
    order_status,
    payment_status,
    search,
    start_date,
    end_date,
}) => {

    const filter = { is_deleted: 0, };

    if (order_status) {
        filter.order_status = order_status;
    }

    if (payment_status) {
        filter.payment_status = payment_status;
    }

    if (search) {
        filter.order_number = {
            $regex: search,
            $options: "i",
        };
    }

    // Date Filter
    if (start_date || end_date) {
        filter.createdAt = {};

        if (start_date) {
            filter.createdAt.$gte = new Date(start_date);
        }

        if (end_date) {
            const endDate = new Date(end_date);

            // Include full day
            endDate.setHours(23, 59, 59, 999);

            filter.createdAt.$lte = endDate;
        }
    }

    const orders = await Order.find(filter)
        // .populate("user_id", "name email")
        .select("-user_id -payment_intent_id -payment_method -payment_gateway -__v -is_deleted -updatedAt")
        .sort({ createdAt: -1, })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments(filter);

    return {
        success: true,
        orders,
        total
    };
};

/* Get single order by admin */
export const getSingleOrder = async (orderId) => {

    const filter = { _id: orderId, is_deleted: 0 };

    const order = await Order.findOne(filter)
        .populate("user_id", "name email mobile")
        .populate("products.product_id")
        .select("-promo_code -__v -is_deleted -updatedAt");

    if (!order) {
        return {
            success: false,
            message: "Order not found",
        };
    }

    return {
        success: true,
        data: order,
    };
};

/* Update order status by admin */
export const updateOrderStatus = async (orderId, orderStatus) => {

    const order = await Order.findOne({ _id: orderId, is_deleted: 0 });

    if (!order) {
        return {
            success: false,
            message: "Order not found",
        };
    }

    order.order_status = orderStatus;

    await order.save();

    return {
        success: true,
        message: "Order status updated successfully",
        data: order,
    };
};