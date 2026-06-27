import { JEWELLERY } from "../helpers/constant.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Global from "../models/globals.js";
import { calculateSelectedGoldPrice } from "../utills/productPrice.helper.js";

/* Add to cart services */
export const addToCart = async (
    userId,
    payload
) => {
    const {
        guest_id,
        product_id,
        quantity,
        selected_options,
    } = payload;

    const product = await Product.findOne({
        _id: product_id,
        is_deleted: 0,
    });

    if (!product) {
        throw new Error("Product not found");
    }

    let priceSnapshot = product.price || 0;

    if (product.product_type === JEWELLERY) {
        const pricingSettings = await Global.findOne();

        priceSnapshot =
            calculateSelectedGoldPrice(
                product,
                pricingSettings,
                selected_options.gold_type
            );
    }

    let cart = null;

    if (userId) {
        cart = await Cart.findOne({
            user_id: userId,
        });
    } else {
        cart = await Cart.findOne({
            guest_id,
        });
    }

    if (!cart) {
        cart = await Cart.create({
            user_id: userId || null,
            guest_id: userId ? null : guest_id,
            items: [],
        });
    }

    const existingItem =
        cart.items.find((item) => {
            return (
                item.product_id.toString() ===
                product_id &&
                JSON.stringify(
                    item.selected_options
                ) ===
                JSON.stringify(
                    selected_options
                )
            );
        });

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product_id,
            quantity,
            selected_options,
            price_snapshot:
                priceSnapshot,
        });
    }

    await cart.save();

    return cart;
};