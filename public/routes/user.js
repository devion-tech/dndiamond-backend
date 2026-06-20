import { Router } from "express";
import { createUserValidation, loginUserValidation } from "../validation/user.js";
import { validateRequest } from "../middelware/validation.js";
import { createUser, loginUser } from "../controllers/user.js";

const router = new Router();

router.post("/", validateRequest(createUserValidation), createUser);
router.post("/login", validateRequest(loginUserValidation), loginUser);

export default router;  

