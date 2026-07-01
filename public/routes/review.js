import { validateRequest, validateRequestForParams } from "../middelware/validation.js";
import { verifytoken } from "../utills/jwt.helper.js";
import { reviewValidation } from "../validation/review.js";
import * as reviewController from "../controllers/review.js";
import { commonIdValidation } from "../validation/common.js";
import { Router } from "express";

const router = new Router();

/* Add review API */
router.post("/", verifytoken, validateRequest(reviewValidation), reviewController.addReview);
router.delete("/:id", verifytoken, validateRequestForParams(commonIdValidation), reviewController.deleteReview); /* Delete review */

export default router;
