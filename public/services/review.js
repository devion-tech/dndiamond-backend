import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const addReview = async ({
    user_id,
    product_id,
    rating,
    review,
}) => {
    const product = await Product.findOne({
        _id: product_id,
        is_deleted: 0,
    });

    if (!product) {
        return {
            success: false,
            message: "Product not found",
            status: 404,
        };
    }

    const existingReview = await Review.findOne({
        user_id,
        product_id,
        is_deleted: 0,
    });

    if (existingReview) {
        existingReview.rating = rating;
        existingReview.review = review || "";

        await existingReview.save();

        return {
            success: true,
            message: "Review updated successfully",
            review: existingReview,
        };
    }

    const newReview = await Review.create({
        user_id,
        product_id,
        rating,
        review: review || "",
    });

    return {
        success: true,
        message:
            "Review added successfully",
        review: newReview,
    };
};