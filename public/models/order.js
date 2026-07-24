import mongoose from "mongoose";
import { paymentMethods } from "../helpers/constant.js";

const OrderProductSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        selected_options: {
            type: Object,
            default: {},
        },

        price: {
            type: Number,
            required: true,
        },

        total_price: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const OrderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        order_number: {
            type: String,
            required: true,
            unique: true,
        },

        products: [OrderProductSchema],

        address: {
            first_name: String,
            last_name: String,
            mobile: String,
            email: String,
            country: String,
            state: String,
            city: String,
            address_line_1: String,
            address_line_2: String,
            landmark: String,
            postal_code: String,
        },

        promo_code: {
            type: String,
            default: null,
        },

        discount_amount: {
            type: Number,
            default: 0,
        },

        subtotal: {
            type: Number,
            required: true,
        },

        shipping_charge: {
            type: Number,
            default: 0,
        },

        total_amount: {
            type: Number,
            required: true,
        },

        payment_gateway: {
            type: String,
            enum: paymentMethods,
            default: "stripe",
        },

        currency: {
            type: String,
            default: "HKD",
        },

        payment_method: {
            type: String,
            default: null,
        },

        payment_status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded",
            ],
            default: "pending",
        },

        stripe_session_id: {
            type: String,
            default: null,
        },
        payment_intent_id: {
            type: String,
            default: null,
        },

        transaction_id: {
            type: String,
            default: null,
        },

        order_status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "pending",
        },

        notes: {
            type: String,
            default: "",
        },

        is_deleted: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;