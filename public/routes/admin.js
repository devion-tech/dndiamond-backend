import { Router } from "express";
import { createAdminValidation, loginAdminValidation } from "../validation/admin.js";
import { validateRequest } from "../middelware/validation.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import * as adminController from "../controllers/admin.js";
const router = new Router();

router.post("/", validateRequest(createAdminValidation), adminController.createAdmin);
router.post("/login", validateRequest(loginAdminValidation), adminController.loginAdmin);
router.get("/dashboard", verifyAdminToken, adminController.getDashboard);

export default router;
