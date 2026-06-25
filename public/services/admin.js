import { encryptData, verifyData } from "../common/randomPassword.js";
import { ROLE } from "../helpers/constant.js";
import Admin from "../models/admin.js";
import { authToken } from "../utills/jwt.helper.js";

export const createAdmin = async (data) => {
  const password = data.password;
  data.password = await encryptData(password);
  const user = new Admin(data);
  return user.save();
};

export const findAdmin = async (data) => {
  const admin = await Admin.findOne(data);
  return admin;
};

export const loginAdmin = async (email, password) => {
  try {
    const admin = await findAdmin({ email });
    if (!admin) {
      return { success: false, message: "Admin not found" };
    }
    const isMatch = await verifyData(password, admin.password);
    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }
    const token = await authToken({
      _id: admin._id,
      email: admin.email,
      role: ROLE.ADMIN,
    });
    return {
      success: true,
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    };
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error("internal server error");
  }
};
