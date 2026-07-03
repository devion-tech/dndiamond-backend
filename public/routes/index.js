import userRouter from "./user.js";
import adminRouter from "./admin.js";
import attributeRouter from "./attribute.js";
import categoryRouter from "./category.js";
import uploadRouter from "./file.js";
import globalsRouter from "./globals.js";
import productRouter from "./product.js";
import cartRouter from "./cart.js";
import wishlistRouter from "./wishlist.js";
import reviewRouter from "./review.js";
import promoCodeRouter from "./promoCode.js";
import { Router } from "express";

const router = new Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/attribute", attributeRouter);
router.use("/category", categoryRouter);
router.use("/uploads", uploadRouter);
router.use("/globals", globalsRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/review", reviewRouter);
router.use("/promoCodes", promoCodeRouter);

export default router;
