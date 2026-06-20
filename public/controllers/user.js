import { errorHandler, success } from "../helpers/response.js";
import * as userService from "../services/user.js"; // Import your service function


export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const exist = await userService.findUser({ email: userData.email });
        if (exist) {
            errorHandler(res, "User already exist", 400);
            return;
        }
        const newUser = await userService.createUser(userData); 
       success(res, newUser, "User Registered successful", 200);
    } catch (error) {
         errorHandler(res, "Error creating user", 500);
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await userService.loginUser(email, password);
        if (!result.success) {
            errorHandler(res, result.message, 400);
            return;
        }   
        success(res, { token: result.token, user: result.user }, "Login successful", 200);
    } catch (error) {
        errorHandler(res, "Error logging in user", 500);
    }
};