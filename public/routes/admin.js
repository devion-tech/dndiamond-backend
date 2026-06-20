import { Router } from "express";
import { createAdminValidation, loginAdminValidation } from "../validation/admin.js";
import { validateRequest } from "../middelware/validation.js";
import { createAdmin, loginAdmin } from "../controllers/admin.js";

const router = new Router();

router.post("/", validateRequest(createAdminValidation), createAdmin);
router.post("/login", validateRequest(loginAdminValidation), loginAdmin);

export default router;  

