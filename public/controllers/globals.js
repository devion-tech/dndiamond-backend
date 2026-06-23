import { errorHandler, success } from "../helpers/response.js";
import * as globalsService from "../services/globals.js";

export const addGlobals = async (req, res) => {
  try {
    const result = await globalsService.addGlobals(req.body);
    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }
    return success(
      res,
      result.data,
      "Global settings created successfully",
      201,
    );
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const updateGlobals = async (req, res) => {
  try {
    const result = await globalsService.updateGlobals(req.body);
    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }
    return success(
      res,
      result.data,
      "Global settings updated successfully",
      200,
    );
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const getGlobals = async (req, res) => {
  try {
    const result = await globalsService.getGlobals();
    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }
    return success(
      res,
      result.data,
      "Global settings retrieved successfully",
      200,
    );
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};
