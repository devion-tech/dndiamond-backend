import { JEWELLERY } from "../helpers/constant.js";
import Globals from "../models/globals.js";
import Product from "../models/product.js";
import Wishlist from "../models/Wishlist.js";
import { calculateJewelleryPrice } from "../utills/productPrice.helper.js";

/* Add wishlist by login user */
export const toggleWishlist = async (userId, productId) => {
    const isProductExist = await Product.findById({ _id: productId, is_deleted: 0 });
    if (!isProductExist) {
        return {
            success: false,
            message: "Product not found!"
        };
    }

    let wishlist = await Wishlist.findOne({ user_id: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user_id: userId,
            products: [
                {
                    product_id: productId,
                },
            ],
        });
        return {
            success: true,
            is_wishlisted: true,
            wishlist_count: wishlist.products.length,
        };

    }

    const existingIndex = wishlist.products.findIndex(
        (item) => item.product_id.toString() === productId
    );

    if (existingIndex > -1) {
        wishlist.products.splice(existingIndex, 1);
        await wishlist.save();
        return {
            success: true,
            is_wishlisted: false,
            wishlist_count: wishlist.products.length,
        };
    }

    wishlist.products.push({ product_id: productId });
    await wishlist.save();
    return {
        success: true,
        is_wishlisted: true,
        wishlist_count: wishlist.products.length,
    };
};

/* Get wishlist api service */
export const getWishlist = async ({ userId, page, limit, currency }) => {

    const wishlist = await Wishlist.findOne({ user_id: userId })
        .populate({
            path: "products.product_id",
            select: "-pricing  -updatedAt -is_deleted -__v ",
            // populate: [
            //     {
            //         path: "category_id",
            //     },
            //     {
            //         path: "subcategory_id",
            //     },
            //     {
            //         path: "attribute_id",
            //     },
            // ],
        });

    if (!wishlist) {
        return {
            products: [],
            total: 0,
        };
    }

    const pricingSettings = await Globals.findOne();

    const total = wishlist.products.length;
    const startIndex = (page - 1) * limit;

    const endIndex = startIndex + limit;
    const products = wishlist.products
        .slice(startIndex, endIndex)
        .map((item) => {
            const product = item.product_id.toObject();
            if (product.product_type === JEWELLERY) {
                product.display_price = calculateJewelleryPrice(product, pricingSettings, currency);
            } else {
                product.display_price = product.price;
            }

            return product;
        });

    return {
        products,
        total,
    };
};