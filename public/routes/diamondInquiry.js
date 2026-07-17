import { Router } from "express";
import * as diamondInquiryController from "../controllers/diamondInquiry.js";
import { verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";
import { validateRequest, validateRequestForParams, validateRequestForQuery } from "../middelware/validation.js";
import { commonIdValidation } from "../validation/common.js";
import { getDiamondInquiryValidation, sendInquiryValidation, updateDiamondInquiryValidation } from "../validation/diamondInquiry.js";

const router = new Router();

router.post("/", verifytoken, validateRequest(sendInquiryValidation), diamondInquiryController.createDiamondInquiry); /* Create Diamond Inquiry  */
router.get("/", verifyAdminToken, validateRequestForQuery(getDiamondInquiryValidation), diamondInquiryController.getDiamondInquiries); /* Get diamond inquiry by admin */
router.get("/myInquiry", verifytoken, validateRequestForQuery(getDiamondInquiryValidation), diamondInquiryController.getMyInquiries); /* Get user own inquiry */
router.put("/:id", verifyAdminToken, validateRequest(updateDiamondInquiryValidation), diamondInquiryController.updateDiamondInquiry); /* Update diamond inquiry status by admin */
router.delete("/:id", verifyAdminToken, validateRequestForParams(commonIdValidation), diamondInquiryController.deleteDiamondInquiry); /* Delete diamond inquiry by admin */

export default router;
