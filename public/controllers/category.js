import { errorHandler, success } from "../helpers/response.js";
import * as categoryService from "../services/category.js";

export const createCategory = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Category created successfully", 201);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const getCategories = async (req, res) => {
  try {
    const result = await categoryService.getCategories(req.query);

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Categories retrieved successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.getCategoryById({ id });

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Category retrieved successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const createSubcategory = async (req, res) => {
  try {
    const result = await categoryService.createSubcategory(req.body);

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Subcategory created successfully", 201);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.updateSubcategory({ id, ...req.body });

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Subcategory updated successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.updateCategory({
      id,
      ...req.body,
    });

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Category updated successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteSubcategory({ id });

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, null, "Subcategory deleted successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory({ id });

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, null, "Category deleted successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const result = await categoryService.getSubCategories();

    if (result && result.length === 0) {
      return errorHandler(res, "subCategory not found!", 404);
    }

    return success(res, result.data, "subCategories retrieved successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};
