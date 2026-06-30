import { errorHandler, getPagination, success } from "../helpers/response.js";
import * as productService from "../services/product.js";

/* Create profuct by admin API */
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

/* Edit product by admin API */
export const editProduct = async (req, res) => {
  try {
    const result = await productService.editProduct(req.params.id, req.body);
    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }
    return success(res, result.data, "Product updated successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

/* Get product by all user */
export const getAllProduct = async (req, res, next) => {
  try {
    const { pageNumber, pageLimit, skip, product_type } = await getPagination(
      req.query,
    );
    const result = await productService.getProducts({
      page: pageNumber,
      limit: pageLimit,
      skip,
      subcategory_id: req.query.subcategory_id,
      product_type: req.query.product_type,
    });

    return success(
      res,
      {
        products: result.products,
        pagination: {
          total: result.total,
          page: pageNumber,
          limit: pageLimit,
          total_pages: Math.ceil(result.total / pageLimit),
        },
      },
      "Products fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

/* Get single product by id */
export const getSingleProduct = async (req, res, next) => {
  try {
    const result = await productService.getSingleProduct(req.params.identifier);
    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, result, "Product fetched successfully!", 200);
  } catch (error) {
    next(error);
  }
};

/* Delete product by id */
export const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (!result.success) {
      return errorHandler(res, result.message, 404);
    }

    return success(res, {}, "Product delete successfully!", 200);
  } catch (error) {
    next(error);
  }
};
