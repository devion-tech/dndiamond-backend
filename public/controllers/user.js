import { errorHandler, getPagination, success } from "../helpers/response.js";
import * as userService from "../services/user.js"; // Import your service function

/* User signup */
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
    errorHandler(res, "Internal server error", 500);
    return;
  }
};

/* User login */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userService.loginUser(email, password);
    if (!result.success) {
      errorHandler(res, result.message, 400);
      return;
    }
    success(
      res,
      { token: result.token, user: result.user },
      "Login successful",
      200,
    );
  } catch (error) {
    errorHandler(res, "Internal server error", 500);
    return;
  }
};

/* Get user with and without pagination */
export const getUsers = async (req, res) => {
  try {
    const pagination = getPagination(req.query);
    const users = await userService.findUsers({
      ...(pagination || {}),
      search: req.query.search,
    });
    success(
      res,
      {
        ...users,
        page: pagination?.pageNumber || 1,
        limit: pagination?.pageLimit || users.length,
      },
      "Users retrieved successfully",
      200,
    );
  } catch (error) {
    errorHandler(res, "Internal server error", 500);
    return;
  }
};

/* Update user  */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await userService.updateUser(id, updateData);
    if (!updated) {
      errorHandler(res, "User not found", 404);
      return;
    }
    success(res, updated, "User updated successfully", 200);
    return;
  } catch (error) {
    errorHandler(res, "Internal server error", 500);
  }
};

/* Get main page data */
export const getMainPageData = async (req, res) => {
  try {
    const currency = req.headers["x-currency"] || "HKD";
    const result = await userService.getMainPageData(currency);
    success(res, result, "Main page data retrieved successfully", 200);
    return;
  } catch (error) {
    errorHandler(res, "Internal server error", 500);
    return;
  }
};
