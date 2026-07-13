import { errorHandler, success } from "../helpers/response.js";
import * as adminService from "../services/admin.js"; // Import your service function

/* Create admin */
export const createAdmin = async (req, res) => {
  try {
    const userData = req.body;
    const exist = await adminService.findAdmin({ email: userData.email });
    if (exist) {
      errorHandler(res, "Admin already exist", 400);
      return;
    }
    const newAdmin = await adminService.createAdmin(userData);
    success(res, newAdmin, "Admin Registered successful", 200);
  } catch (error) {
    errorHandler(res, "Internal server error", 500);
  }
};

/* Login admin */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await adminService.loginAdmin(email, password);

    if (!result.success) {
      errorHandler(res, result.message, 400);
      return;
    }
    success(
      res,
      { token: result.token, admin: result.admin },
      "Login successful",
      200,
    );
  } catch (error) {
    errorHandler(res, "Internal server error", 500);
  }
};

/* Get admin dashboard */
export const getDashboard = async (req, res, next) => {
  try {
    const result = await adminService.getDashboard();

    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, result.data, result.messag);
  } catch (error) {
    next(error);
  }
};