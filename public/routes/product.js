import { Router } from "express";
import * as productController from "../controllers/product.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import { validateRequest } from "../middelware/validation.js";
import { createProductValidation } from "../validation/product.js";

const router = new Router();

router.post(
  "/",
  verifyAdminToken,
  validateRequest(createProductValidation),
  productController.createProduct,
);

export default router;
