import { Router } from "express";
import * as categoryController from "../controllers/category.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import { validateRequest } from "../middelware/validation.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
  createSubcategoryValidation,
  updateSubcategoryValidation,
} from "../validation/category.js";

const router = new Router();

router.get("/", categoryController.getCategories);
router.post(
  "/",
  verifyAdminToken,
  validateRequest(createCategoryValidation),
  categoryController.createCategory,
);
router.post(
  "/subcategory",
  verifyAdminToken,
  validateRequest(createSubcategoryValidation),
  categoryController.createSubcategory,
);
router.put(
  "/subcategory/:id",
  verifyAdminToken,
  validateRequest(updateSubcategoryValidation),
  categoryController.updateSubcategory,
);
router.put(
  "/:id",
  verifyAdminToken,
  validateRequest(updateCategoryValidation),
  categoryController.updateCategory,
);
router.delete(
  "/subcategory/:id",
  verifyAdminToken,
  categoryController.deleteSubcategory,
);
router.delete("/:id", verifyAdminToken, categoryController.deleteCategory);

export default router;
