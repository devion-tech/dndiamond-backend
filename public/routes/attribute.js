import { Router } from "express";
import * as attributeController from "../controllers/attributes.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import { validateRequest } from "../middelware/validation.js";
import {
  createAttributeValidation,
  updateAttributeValidation,
} from "../validation/attributes.js";

const router = new Router();
router.get("/", verifyAdminToken, attributeController.getAttributes);
router.post(
  "/",
  verifyAdminToken,
  validateRequest(createAttributeValidation),
  attributeController.createAttribute,
);
router.put(
  "/:id",
  verifyAdminToken,
  validateRequest(updateAttributeValidation),
  attributeController.updateAttribute,
);
router.delete("/:id", verifyAdminToken, attributeController.deleteAttribute);

export default router;
