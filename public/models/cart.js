import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },

        selected_options: {
            type: Map,
            of: String,
            default: {},
        },

        price_snapshot: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "USD",
        },
    },
    {
        _id: true,
    },
);

const CartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        guest_id: {
            type: String,
            default: null,
        },

        items: [CartItemSchema],
    },
    {
        timestamps: true,
    },
);


const Cart = new mongoose.model("Cart", CartSchema);
export default Cart;