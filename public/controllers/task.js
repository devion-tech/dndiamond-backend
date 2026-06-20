import { createTaskService } from "../services/task.js";

export const creatTask = async (req, res) => {
    try {
        const task = await createTaskService(req.body);
        if (task && Object.keys(task)?.length > 0) {
            return res.status(201).json({
                status: 201,
                success: true,
                message: "Task created successfully",
                data: task
            });
        } else {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to create task",
                data: null
            });
        }

    } catch (err) {
        return res.status(500).json({ status: 500, success: false, message: "Internal server error", data: {} });
    }
}