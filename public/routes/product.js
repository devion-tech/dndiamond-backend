import { Router } from "express";
import * as productController from "../controllers/product.js";
import { verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";
import { validateRequest, validateRequestForQuery } from "../middelware/validation.js";
import { createProductValidation } from "../validation/product.js";
import { getProducts } from "../services/product.js";
import { paginationValidation } from "../validation/common.js";

const router = new Router();

/* Create product */
router.post(
  "/",
  verifyAdminToken,
  validateRequest(createProductValidation),
  productController.createProduct,
);


/* Get all product by  */
router.get("/", validateRequestForQuery(paginationValidation), productController.getAllProduct);

export default router;
