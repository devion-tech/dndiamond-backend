import userRouter from "./user.js";
import adminRouter from "./admin.js";
import attributeRouter from "./attribute.js";
import categoryRouter from "./category.js";
import { Router } from "express";

const router = new Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/attribute", attributeRouter);
router.use("/category", categoryRouter);

export default router;
