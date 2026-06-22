import { Router } from "express";
import * as attributeController from "../controllers/attributes.js";
import { verifyAdminToken } from "../utills/jwt.helper.js";

const router = new Router();
router.get("/", verifyAdminToken, attributeController.getAttributes);
router.post("/", verifyAdminToken, attributeController.createAttribute);
router.put("/:id", verifyAdminToken, attributeController.updateAttribute);
router.delete("/:id", verifyAdminToken, attributeController.deleteAttribute);

export default router;
