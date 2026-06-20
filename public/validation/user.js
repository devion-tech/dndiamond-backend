// validations/userValidation.js
import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('Invalid ObjectId');
    }
    return value;
});

export const createUserValidation = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required',
        'string.empty': 'Name cannot be empty',
    }),
    email: Joi.string().required().messages({
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),
    phone: Joi.string().required().messages({
        'any.required': 'Phone number is required',
        'string.empty': 'Phone number cannot be empty',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
    }),
});

export const loginUserValidation = Joi.object({
    email: Joi.string().required().messages({
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
    }),
});
