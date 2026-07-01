import { validateRequest } from "../middelware/validation.js";
import { verifytoken } from "../utills/jwt.helper.js";
import { reviewValidation } from "../validation/review.js";
import { Router } from "express";
import * as reviewController from "../controllers/review.js";

const router = new Router();

/* Add review API */
router.post("/", verifytoken, validateRequest(reviewValidation), reviewController.addReview);

export default router;
