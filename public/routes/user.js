import { Router } from "express";
import {
  createUserValidation,
  loginUserValidation,
} from "../validation/user.js";
import { validateRequest } from "../middelware/validation.js";
import { verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";
import * as userController from "../controllers/user.js";

const router = new Router();

router.post(
  "/",
  validateRequest(createUserValidation),
  userController.createUser,
);
router.post(
  "/login",
  validateRequest(loginUserValidation),
  userController.loginUser,
);
router.get("/", verifyAdminToken, userController.getUsers);
router.put(
  "/:id",
  verifyAdminToken,
  validateRequest(loginUserValidation),
  userController.updateUser,
);

export default router;
