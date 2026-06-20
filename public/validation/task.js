// validations/taskValidation.js
import Joi from 'joi';
import mongoose from 'mongoose';

// Custom validation for ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('Invalid ObjectId');
    }
    return value;
});

export const createTaskValidation = Joi.object({
    tenant_id: objectId.required(),
    project_id: objectId.optional(),
    title: Joi.string().required().messages({
        'any.required': 'Title is required',
        'string.empty': 'Title cannot be empty',
    }),
    description: Joi.string().required().messages({
        'any.required': 'Description is required',
        'string.empty': 'Description cannot be empty',
    }),
    created_by: objectId.optional(),
    assigned_to: objectId.optional(),
    status: Joi.string()
        .valid('pending', 'in_progress', 'blocked', 'done')
        .default('pending'),
    is_blocked: Joi.boolean().default(false),
    blocker_ids: Joi.array().items(objectId).optional(),
    origin: Joi.string()
        .valid('whatsapp', 'web', 'voice', 'file_upload')
        .default('whatsapp'),
    due_date: Joi.date().optional(),
    reminder_at: Joi.date().optional(),
    files: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
});
