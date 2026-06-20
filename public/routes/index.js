// import userRouter from "./user.js"
import taskRouter from "./task.js"
import { Router } from "express";

const router = new Router();

// router.use("/user", userRouter)
router.use("/taskAssign", taskRouter);

export default router;