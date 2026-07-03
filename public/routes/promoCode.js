import { Router } from "express";
import * as promoCodeController from "../controllers/promoCode.js";
import { optionalAuth, verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";
import { validateRequest, validateRequestForParams, validateRequestForQuery } from "../middelware/validation.js";
import { commonIdValidation, paginationValidation, pageValidation } from "../validation/common.js";
import { createPromoCodeValidation, updatePromoCodeValidation } from "../validation/promoCode.js";

const router = new Router();

/* Create promo code */
router.post("/", verifyAdminToken, validateRequest(createPromoCodeValidation), promoCodeController.createPromoCode);
router.get("/", verifyAdminToken, validateRequestForQuery(pageValidation), promoCodeController.getPromoCodes);
router.put("/:id", verifyAdminToken, validateRequestForParams(commonIdValidation), validateRequest(updatePromoCodeValidation), promoCodeController.updatePromoCode);
router.delete("/:id", verifyAdminToken, validateRequestForParams(commonIdValidation), promoCodeController.deletePromoCode);

export default router;
