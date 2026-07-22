import { Router } from "express";
import * as attributeController from "../controllers/attributes.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";
import {
  validateRequest,
  validateRequestForParams,
} from "../middelware/validation.js";
import {
  createAttributeValidation,
  updateAttributeValidation,
} from "../validation/attributes.js";
import { commonIdValidation } from "../validation/common.js";

const router = new Router();

router.get("/", attributeController.getAttributes);

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

router.delete(
  "/:id",
  verifyAdminToken,
  validateRequestForParams(commonIdValidation),
  attributeController.deleteAttribute,
);

export default router;
