import { Router } from "express";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import {
  validateRequest,
  validateRequestForParams,
} from "../middelware/validation.js";
import { uploadImage } from "../middelware/multer.js";
import {
  createLandingValidation,
  updateLandingValidation,
} from "../validation/landing.js";
import { commonIdValidation } from "../validation/common.js";
import * as landingController from "../controllers/landing.js";

const router = new Router();

router.get("/heroImage", verifyAdminToken, landingController.getLandings);

router.get(
  "/heroImage/:id",
  verifyAdminToken,
  validateRequestForParams(commonIdValidation),
  landingController.getLandingById,
);

router.post(
  "/heroImage",
  verifyAdminToken,
  uploadImage.single("image"),
  validateRequest(createLandingValidation),
  landingController.createLanding,
);

router.put(
  "/heroImage/:id",
  verifyAdminToken,
  uploadImage.single("image"),
  validateRequestForParams(commonIdValidation),
  validateRequest(updateLandingValidation),
  landingController.updateLanding,
);

router.delete(
  "/heroImage/:id",
  verifyAdminToken,
  validateRequestForParams(commonIdValidation),
  landingController.deleteLanding,
);

export default router;
