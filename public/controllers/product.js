import { errorHandler, success } from "../helpers/response.js";
import * as productService from "../services/product.js";

export const createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);
    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }
    return success(res, result.data, "Product created successfully", 201);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};
