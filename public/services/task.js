import Task from "../models/Task.js";

export const createTaskService = async (taskData) => {
    try {
        const response = await Task.create(taskData);
        return response;
    } catch (error) {
        throw new Error("Failed to create task");
    }
};
