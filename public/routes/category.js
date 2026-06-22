import { Router } from "express";
import * as categoryController from "../controllers/category.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";

const router = new Router();

router.get("/", categoryController.getCategories);
router.post("/", verifyAdminToken, categoryController.createCategory);
router.post(
  "/subcategory",
  verifyAdminToken,
  categoryController.createSubcategory,
);
router.put(
  "/subcategory/:id",
  verifyAdminToken,
  categoryController.updateSubcategory,
);

export default router;
