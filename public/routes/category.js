import { Router } from "express";
import * as categoryController from "../controllers/category.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import { validateRequest, validateRequestForParams } from "../middelware/validation.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
  createSubcategoryValidation,
  updateSubcategoryValidation,
} from "../validation/category.js";
import { commonIdValidation } from "../validation/common.js";

const router = new Router();

router.get("/subcategory", verifyAdminToken, categoryController.getSubCategories);
router.get("/", categoryController.getCategories);
router.get("/:id", validateRequestForParams(commonIdValidation), categoryController.getCategoryById);
router.post("/", verifyAdminToken, validateRequest(createCategoryValidation), categoryController.createCategory); /* Create category */
router.post("/subcategory", verifyAdminToken, validateRequest(createSubcategoryValidation), categoryController.createSubcategory); /* Create sub-category */
router.put("/subcategory/:id", verifyAdminToken, validateRequest(updateSubcategoryValidation), categoryController.updateSubcategory); /* Update sub-category */
router.put("/:id", verifyAdminToken, validateRequest(updateCategoryValidation), categoryController.updateCategory); /* Update category */
router.delete("/subcategory/:id", verifyAdminToken, validateRequestForParams(commonIdValidation), categoryController.deleteSubcategory); /* Delete sub-category */
router.delete("/:id", verifyAdminToken, validateRequestForParams(commonIdValidation), categoryController.deleteCategory); /* Delete category */

export default router;
