import mongoose from "mongoose";

const PromoCodeUsageSchema = new mongoose.Schema(
    {
        promo_code_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PromoCode",
            required: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

PromoCodeUsageSchema.index(
    {
        promo_code_id: 1,
        user_id: 1,
    },
    {
        unique: true,
    },
);

const PromoCodeUsage = mongoose.models.PromoCodeUsage || mongoose.model("PromoCodeUsage", PromoCodeUsageSchema);

export default PromoCodeUsage;