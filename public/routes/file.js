import { Router } from "express";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import { validateRequest } from "../middelware/validation.js";
import { uploadImage } from "../middelware/multer.js";
import { addFiles, deleteImage } from "../controllers/file.js";
import { fileDeleteValidation } from "../validation/common.js";

const router = new Router();

/* Add file */
router.post(
  "/addFiles",
  verifyAdminToken,
  uploadImage.array("images", 10),
  addFiles,
);

/* Delete uploaded image */
router.post(
  "/destroyFile",
  verifyAdminToken,
  validateRequest(fileDeleteValidation),
  deleteImage,
);

export default router;
