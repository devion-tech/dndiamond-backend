import { Router } from "express";
import { verifytoken } from "../utills/jwt.helper.js";
import { validateRequestForQuery } from "../middelware/validation.js";
import { uploadImage } from "../middelware/multer.js";
import { addFiles, deleteImage } from "../controllers/file.js";
import { fileDeleteValidation } from "../validation/common.js";

const router = new Router();

/* Add file */
router.post(
  "/addFiles",
  //   verifytoken,
  uploadImage.array("images", 10),
  addFiles,
);

/* Delete uploaded image */
router.delete(
  "/destroyFile",
  //   verifytoken,
  validateRequestForQuery(fileDeleteValidation),
  deleteImage,
);

export default router;
