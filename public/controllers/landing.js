import { errorHandler, success } from "../helpers/response.js";
import * as landingService from "../services/landing.js";

/* Get all landing page hero images */
export const getLandings = async (req, res, next) => {
  try {
    const result = await landingService.getLandings();

    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, result.data, "Hero images retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/* Get landing page hero image by ID */
export const getLandingById = async (req, res, next) => {
  try {
    const result = await landingService.getLandingById({ id: req.params.id });

    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, result.data, "Hero image retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/* Create landing page hero image */
export const createLanding = async (req, res, next) => {
  try {
    const result = await landingService.createLanding({
      ...req.body,
      file: req.file,
    });

    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, result.data, "Hero section Image added successfully");
  } catch (error) {
    next(error);
  }
};

/* Update landing page hero image */
export const updateLanding = async (req, res, next) => {
  try {
    const result = await landingService.updateLanding({
      id: req.params.id,
      ...req.body,
      file: req.file,
    });

    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, result.data, "Hero image updated successfully");
  } catch (error) {
    next(error);
  }
};

/* Delete landing page hero image */
export const deleteLanding = async (req, res, next) => {
  try {
    const result = await landingService.deleteLanding({ id: req.params.id });

    if (!result.success) {
      return errorHandler(res, result.message);
    }

    return success(res, null, result.message);
  } catch (error) {
    next(error);
  }
};
