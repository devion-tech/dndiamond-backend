import { Router } from "express";
import * as productController from "../controllers/product.js";
import { verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";
import {
  validateRequest,
  validateRequestForParams,
  validateRequestForQuery,
} from "../middelware/validation.js";
import {
  createProductValidation,
  editProductValidation,
  getProductsValidation,
} from "../validation/product.js";
import { getProducts } from "../services/product.js";
import {
  commonIdValidation,
  paginationValidation,
} from "../validation/common.js";

const router = new Router();

/* Create product */
router.post(
  "/",
  verifyAdminToken,
  validateRequest(createProductValidation),
  productController.createProduct,
);

/* Get all product by  */
router.get(
  "/",
  validateRequestForQuery(getProductsValidation),
  productController.getAllProduct,
);

/* Edit product */
router.put(
  "/:id",
  verifyAdminToken,
  validateRequest(editProductValidation),
  productController.editProduct,
);

/* Get single product */
router.get(
  "/:id",
  validateRequestForParams(commonIdValidation),
  productController.getSingleProduct,
);

export default router;
