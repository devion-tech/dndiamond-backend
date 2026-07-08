import * as cartService from "../services/cart.js";
import { errorHandler, success } from "../helpers/response.js";

/* Add to cart with or without login */
export const addToCart = async (req, res, next) => {
  try {
    const result = await cartService.addToCart(req.user?._id || null, req.body);

    return success(res, {}, "Product added to cart successfully");
  } catch (error) {
    next(error);
  }
};

/* Get cart details with or without login user */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user || null;
    const guestId = req.query.guest_id || null;
    const result = await cartService.getCart(userId, guestId);
    return success(res, result, "Cart fetched successfully");
  } catch (error) {
    next(error);
  }
};

/* Update single cart api  */
export const updateCart = async (req, res, next) => {
  try {
    const userId = req.user || null;

    const result = await cartService.updateCart(
      userId,
      req.body.guest_id,
      req.body.item_id,
      req.body.quantity,
    );

    return success(res, result, "Cart updated successfully");
  } catch (error) {
    next(error);
  }
};

/* Delete single cart api  */
export const deleteCartItem = async (req, res, next) => {
  try {
    const userId = req.user || null;
    const body = req.body;

    const result = await cartService.deleteCartItem(
      userId,
      body.guest_id,
      body.item_id,
    );
    if (!result.success) {
      return errorHandler(res, result.message, 404);
    }
    return success(res, result.cart, "Cart item removed successfully");
  } catch (error) {
    next(error);
  }
};

/* Clear all cart at time */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user || null;
    const { guest_id } = req.query;
    const result = await cartService.clearCart(userId, guest_id);
    if (!result.success) {
      return errorHandler(res, result.message, 404);
    }
    return success(res, result.data, "Cart cleared successfully");
  } catch (error) {
    next(error);
  }
};

/* Merge cart after login */
export const mergeCart = async (req, res, next) => {
  try {
    const result = await cartService.mergeCart(req.user._id, req.body.guest_id);

    if (!result.success) {
      return errorHandler(res, result.message);
    }
    return success(res, result, "Cart merged successfully");
  } catch (error) {
    next(error);
  }
};
