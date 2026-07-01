import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        review: {
            type: String,
            trim: true,
            default: "",
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

// One review per user per product
ReviewSchema.index(
    {
        user_id: 1,
        product_id: 1,
    },
    {
        unique: true,
    },
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
