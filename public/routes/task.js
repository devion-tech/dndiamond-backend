import { Router } from "express";
import { createTaskValidation } from "../validation/task.js";
import { validateRequest } from "../middelware/validation.js";
import { creatTask } from "../controllers/task.js";

const router = new Router();

router.post("/createTask", validateRequest(createTaskValidation), creatTask);

export default router;  