import { JEWELLERY } from "../helpers/constant.js";
import { success } from "../helpers/response.js";
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

/* Get cart details */
export const getCart = async (
    userId,
    guestId
) => {
    if (!userId && !guestId) {
        return {
            items: [],
            total_items: 0,
            subtotal: 0,
        };
    }

    let cart = null;

    if (userId) {
        cart = await Cart.findOne({
            user_id: userId,
        }).populate("items.product_id");
    } else {
        cart = await Cart.findOne({
            guest_id: guestId,
        }).populate("items.product_id");
    }

    if (!cart) {
        return {
            items: [],
            total_items: 0,
            subtotal: 0,
        };
    }

    const pricingSettings = await Global.findOne();

    let subtotal = 0;

    const items = await Promise.all(
        cart.items.map(async (item) => {
            const product = item.product_id;

            if (!product) {
                return null;
            }

            let currentPrice =
                product.price || 0;

            if (
                product.product_type === JEWELLERY
            ) {
                currentPrice =
                    calculateSelectedGoldPrice(
                        product,
                        pricingSettings,
                        item.selected_options.gold_type
                    );
            }

            const total = currentPrice * item.quantity;
            subtotal += total;
            console.log('item :>>12212 ', item);
            return {
                item_id: item._id,
                quantity: item.quantity,
                selected_options: item.selected_options,
                price_snapshot: item.price_snapshot,
                current_price: currentPrice,
                price_changed: currentPrice !== item.price_snapshot,
                total,
                product,
            };
        })
    );

    return {
        items: items.filter(Boolean),
        total_items: items.filter(Boolean).length,
        subtotal,
    };
};

/* Update cart */
export const updateCart = async (
    userId,
    guestId,
    itemId,
    quantity
) => {
    const query = userId
        ? {
            user_id: userId,
            "items._id": itemId,
        }
        : {
            guest_id: guestId,
            "items._id": itemId,
        };

    const cart = await Cart.findOneAndUpdate(
        query,
        {
            $set: {
                "items.$.quantity": quantity,
            },
        },
        {
            new: true,
        }
    );

    if (!cart) {
        return {
            success: false,
            message: "Cart item not found",
        };
    }

    return cart;
};

/* Delete cart */
export const deleteCartItem = async (
    userId,
    guestId,
    itemId
) => {
    const query = userId
        ? { user_id: userId }
        : { guest_id: guestId };

    const cart = await Cart.findOneAndUpdate(
        query,
        {
            $pull: {
                items: {
                    _id: itemId,
                },
            },
        },
        {
            new: true,
        }
    );

    if (!cart) {
        return {
            success: false,
            message: "Cart not found",
        };
    }

    return cart;
};

/* Clear full cart */
export const clearCart = async (userId, guestId) => {
    const query = userId
        ? { user_id: userId }
        : { guest_id: guestId };

    const cart = await Cart.findOneAndUpdate(
        query,
        {
            $set: {
                items: [],
            },
        },
        {
            new: true,
        }
    );
    if (!cart) {
        return {
            success: false,
            message: "Cart not found",
        };
    }

    return {
        success: true,
        data: cart,
    };
};

/* Merge cart */
export const mergeCart = async (userId, guestId) => {
    const guestCart = await Cart.findOne({ guest_id: guestId });
    if (!guestCart) {
        return {
            success: false,
            message: "Guest cart not found",
        };
    }

    let userCart = await Cart.findOne({ user_id: userId });

    // User has no cart
    if (!userCart) {
        guestCart.user_id = userId;
        guestCart.guest_id = null;

        await guestCart.save();

        return {
            success: true,
            cart: guestCart,
        };
    }

    // Merge items
    for (const guestItem of guestCart.items) {
        const existingItem = userCart.items.find((item) => item.product_id.toString() === guestItem.product_id.toString());

        if (existingItem) {
            existingItem.quantity += guestItem.quantity;
        } else {
            userCart.items.push(guestItem);
        }
    }

    await userCart.save();
    await Cart.findByIdAndDelete(guestCart._id);

    return {
        success: true,
        cart: userCart,
    };
};