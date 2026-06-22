import * as attributeService from "../services/attributes.js";
import { errorHandler, success } from "../helpers/response.js";

export const createAttribute = async (req, res) => {
  try {
    const result = await attributeService.createAttribute(req.body);

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Attribute created successfully", 201);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { id, ...req.body };

    const result = await attributeService.updateAttribute(payload);

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Attribute updated successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await attributeService.deleteAttribute({ id });

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, null, "Attribute deleted successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};

export const getAttributes = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { type };

    const result = await attributeService.getAttributes(filter);

    if (!result.success) {
      return errorHandler(res, result.message, 400);
    }

    return success(res, result.data, "Attributes fetched successfully", 200);
  } catch (error) {
    return errorHandler(res, "Internal server error", 500);
  }
};
