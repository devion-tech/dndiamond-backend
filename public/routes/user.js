import { Router } from "express";
import {
  createUserValidation,
  loginUserValidation,
} from "../validation/user.js";
import { validateRequest } from "../middelware/validation.js";
import {
  createUser,
  loginUser,
  getUsers,
  updateUser,
} from "../controllers/user.js";
import { verifyAdminToken, verifytoken } from "../utills/jwt.helper.js";

const router = new Router();

router.post("/", validateRequest(createUserValidation), createUser);
router.post("/login", validateRequest(loginUserValidation), loginUser);
router.get("/", verifyAdminToken, getUsers);
router.put("/:id", verifyAdminToken, updateUser);

export default router;
