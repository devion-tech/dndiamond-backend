import {
  addToCartValidation,
  deleteCartValidation,
  getCartValidation,
  updateCartValidation,
} from "../validation/cart.js";
import * as cartController from "../controllers/cart.js";
import {
  validateRequest,
  validateRequestForQuery,
} from "../middelware/validation.js";
import { Router } from "express";
import { optionalAuth } from "../utills/jwt.helper.js";
import { verifytoken } from "../utills/jwt.helper.js";

const router = new Router();

/* Add to cart api with validation */
router.post(
  "/",
  optionalAuth,
  validateRequest(addToCartValidation),
  cartController.addToCart,
);

router.get(
  "/getCart",
  optionalAuth,
  validateRequestForQuery(getCartValidation),
  cartController.getCart,
); /* Get cart with optional token  */

router.put(
  "/updateCart",
  optionalAuth,
  validateRequest(updateCartValidation),
  cartController.updateCart,
);

router.post(
  "/deleteCart",
  optionalAuth,
  validateRequest(deleteCartValidation),
  cartController.deleteCartItem,
);

router.delete(
  "/clear",
  optionalAuth,
  validateRequestForQuery(getCartValidation),
  cartController.clearCart,
);

router.post(
  "/merge",
  optionalAuth,
  validateRequest(getCartValidation),
  cartController.mergeCart,
);

export default router;
