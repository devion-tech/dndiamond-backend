import { Router } from "express";
import * as globalsController from "../controllers/globals.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import { validateRequest } from "../middelware/validation.js";
import {
  addGlobalsValidation,
  updateGlobalsValidation,
} from "../validation/globals.js";

const router = new Router();

router.get("/", verifyAdminToken, globalsController.getGlobals);
router.post(
  "/",
  verifyAdminToken,
  validateRequest(addGlobalsValidation),
  globalsController.addGlobals,
);
router.put(
  "/",
  verifyAdminToken,
  validateRequest(updateGlobalsValidation),
  globalsController.updateGlobals,
);

export default router;
