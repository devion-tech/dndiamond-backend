import userRouter from "./user.js"
import adminRouter from "./admin.js"
import { Router } from "express";

const router = new Router();

router.use("/user", userRouter)
router.use("/admin", adminRouter)

export default router;