import { encryptData, verifyData } from "../common/randomPassword.js";
import User from "../models/user.js"
import { authToken } from "../utills/jwt.helper.js"

export const createUser = async (data) => {
    const password = data.password;
    data.password = await encryptData(password);
    const user = new User(data)
    return user.save()
}

export const findUser = async (data) => {
   const user = await User.findOne(data);
   return user
}

export const loginUser = async (email, password) => {
    try {
        const user = await findUser({ email });
        if (!user) {
            return { success: false, message: "User not found" };
        }
        const isMatch = await verifyData(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid password" };
        }
        const token = await authToken( {
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        return { success: true, token, user };
    } catch (error) {
        throw new Error("Error logging in user: " + error.message);
    }
};