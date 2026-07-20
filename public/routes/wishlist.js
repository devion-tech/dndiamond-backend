import { validateRequest, validateRequestForQuery } from "../middelware/validation.js";
import { optionalAuth, verifytoken } from "../utills/jwt.helper.js";
import { addWishlistValidation } from "../validation/wishlist.js";
import * as wishlistController from "../controllers/wishlist.js";
import { Router } from "express";
import { pageValidation } from "../validation/common.js";

const router = new Router();

/* Add and remove from wishlist common api */
router.post("/", verifytoken, validateRequest(addWishlistValidation), wishlistController.addWishlist);
router.get("/", optionalAuth, validateRequestForQuery(pageValidation), wishlistController.getWishlist);

export default router;
