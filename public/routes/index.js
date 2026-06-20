import userRouter from "./user.js"
import adminRouter from "./admin.js"
import taskRouter from "./task.js"
import { Router } from "express";

const router = new Router();

router.use("/user", userRouter)
router.use("/admin", adminRouter)
router.use("/task", taskRouter);

export default router;