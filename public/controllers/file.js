import { errorHandler, success } from "../helpers/response.js";
import * as fileService from "../services/file.js";

/* Add files or documents for user */
export const addFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorHandler(res, "Please enter valid files!", 400);
    }
    const images = await fileService.addNewFile(req.files);
    return success(res, images, "Files uploaded successfully!", 200);
  } catch (error) {
    next(error);
  }
};

/* Delete files by product id */
export const deleteImage = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const response = await fileService.deleteFile(ids);
    success(res, {}, "Image deleted successfully!", 200);
    return;
  } catch (error) {
    next(error);
  }
};

/* Create landing page hero image */
export const createLanding = async (req, res, next) => {
  try {
    const result = await fileService.createLanding({
      ...req.body,
      file: req.file,
    });

    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, {}, "Hero section Image added successfully");
  } catch (error) {
    next(error);
  }
};
