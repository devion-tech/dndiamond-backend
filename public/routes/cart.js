import { addToCartValidation } from "../validation/cart.js";
import * as cartController from "../controllers/cart.js";
import { validateRequest } from "../middelware/validation.js";
import { Router } from "express";

const router = new Router();

/* Add to cart api with validation */
router.post("/", validateRequest(addToCartValidation), cartController.addToCart);

export default router;
