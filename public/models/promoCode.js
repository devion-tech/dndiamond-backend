import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        discount_type: {
            type: String,
            enum: ["fixed", "percentage"],
            required: true,
        },

        discount_value: {
            type: Number,
            required: true,
            min: 1,
        },

        minimum_order_amount: {
            type: Number,
            default: 0,
        },

        maximum_discount_amount: {
            type: Number,
            default: 0,
        },

        usage_limit: {
            type: Number,
            default: 0, // 0 = unlimited
        },

        used_count: {
            type: Number,
            default: 0,
        },

        start_date: {
            type: Date,
            required: true,
        },

        expiry_date: {
            type: Date,
            required: true,
        },

        is_active: {
            type: Boolean,
            default: true,
        },

        is_deleted: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const PromoCode = mongoose.models.PromoCode || mongoose.model("PromoCode", PromoCodeSchema);

export default PromoCode;