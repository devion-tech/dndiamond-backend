import { Router } from "express";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import { validateRequest } from "../middelware/validation.js";
import { uploadImage } from "../middelware/multer.js";
import {
  createLandingValidation,
  fileDeleteValidation,
} from "../validation/file.js";
import * as fileController from "../controllers/file.js";

const router = new Router();

/* Add file */
router.post(
  "/",
  verifyAdminToken,
  uploadImage.array("images", 10),
  fileController.addFiles,
);
router.post(
  "/heroImage",
  verifyAdminToken,
  uploadImage.single("image"),
  validateRequest(createLandingValidation),
  fileController.createLanding,
); /* Add landing page hero image */

/* Delete uploaded image */
router.post(
  "/destroyFile",
  verifyAdminToken,
  validateRequest(fileDeleteValidation),
  fileController.deleteImage,
);

export default router;
