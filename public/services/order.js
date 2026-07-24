import Address from "../models/address.js";
import Globals from "../models/globals.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import PromoCode from "../models/promoCode.js";
import { calculateSelectedGoldPrice } from "../utills/productPrice.helper.js";
import { JEWELLERY, ROLE } from "../helpers/constant.js";
import stripe from "../../db/stripe.js";
import Product from "../models/product.js";

/* Create Order */
export const createOrder = async (userId, payload, currency) => {
  const { address_id, promo_code = null, notes = "" } = payload;

  // Get Cart
  const cart = await Cart.findOne({
    user_id: userId,
  }).populate("items.product_id");

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

  for (const item of cart.items) {
    const product = item.product_id;

    if (!product || product.is_deleted === 1) {
      continue;
    }

    let unitPrice = item.price_snapshot;

    if (product.product_type === JEWELLERY) {
      const selectedGoldType = item.selected_options?.gold_type;

      unitPrice = calculateSelectedGoldPrice(
        product,
        pricingSettings,
        selectedGoldType,
        currency,
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

  // Promo Code
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
      state: address.state,
      city: address.city,
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
    currency,
    notes,
    payment_status: "pending",
    order_status: "pending",
  });

  // Create Stripe Checkout Session

  console.log("process.env.FRONTEND_URL :>> ", process.env.FRONTEND_URL);
  console.log(
    `${process.env.FRONTEND_URL}/order/success?order_id=${order._id}`,
  );
  console.log(`${process.env.FRONTEND_URL}/order/cancel?order_id=${order._id}`);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    // automatic_payment_methods: {
    //   enabled: true,
    // },

    line_items: [
      {
        price_data: {
          currency: order.currency.toLowerCase(),

          product_data: {
            name: `Order ${order.order_number}`,
          },

          unit_amount: Math.round(order.total_amount * 100),
        },

        quantity: 1,
      },
    ],

    metadata: {
      order_id: order._id.toString(),
      user_id: order.user_id.toString(),
    },

    success_url: `${process.env.FRONTEND_URL}/order/success?order_id=${order._id}`,
    cancel_url: `${process.env.FRONTEND_URL}/order/cancel?order_id=${order._id}`,
  });

  order.stripe_session_id = session.id;

  await order.save();

  return {
    success: true,
    data: {
      order_id: order._id,
      order_number: order.order_number,
      checkout_url: session.url,
      session_id: session.id,
    },
  };
};

/* Get Orders */
export const getOrders = async ({
  page = 1,
  limit = 10,
  skip,
  order_status,
  payment_status,
  search,
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
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  return {
    success: true,
    orders,
    total,
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
    .select(
      "-user_id -payment_intent_id -payment_method -payment_gateway -__v -is_deleted -updatedAt",
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  return {
    success: true,
    orders,
    total,
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

/* Create stripe session and return url */
export const createStripeSession = async ({ userId, orderId }) => {
  const order = await Order.findOne({
    _id: orderId,
    user_id: userId,
    is_deleted: 0,
  });

  if (!order) {
    return {
      success: false,
      message: "Order not found.",
    };
  }

  if (order.payment_status !== "pending") {
    return {
      success: false,
      message: "Payment already completed.",
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    automatic_payment_methods: { enabled: true },
    // payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: order.currency.toLowerCase(),
          product_data: { name: order.order_number },
          unit_amount: Math.round(order.total_amount * 100),
        },
        quantity: 1,
      },
    ],

    metadata: {
      order_id: order._id.toString(),
      user_id: order.user_id.toString(),
    },

    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
  });

  order.stripe_session_id = session.id;
  await order.save();

  return {
    checkout_url: session.url,
    session_id: session.id,
  };
};

/* Stripe webhook */
export const stripeWebhook = async (req) => {
  const signature = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata.order_id;
      const order = await Order.findById(orderId);

      if (!order) {
        return;
      }

      // Prevent duplicate webhook processing
      if (order.payment_status === "paid") {
        return;
      }

      order.payment_status = "paid";
      order.order_status = "confirmed";
      order.payment_method = session.payment_method_types?.[0] || "card";
      order.payment_intent_id = session.payment_intent;
      order.transaction_id = session.payment_intent;
      order.stripe_session_id = session.id;

      await order.save();

      // Reduce stock
      for (const item of order.products) {
        await Product.updateOne(
          {
            _id: item.product_id,
          },
          {
            $inc: {
              qty: -item.quantity,
            },
          },
        );
      }

      // Clear Cart
      await Cart.deleteOne({ user_id: order.user_id });

      break;
    }

    default:
      console.log(`Unhandled event ${event.type}`);
  }
  return;
};
