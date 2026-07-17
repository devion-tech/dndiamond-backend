import { errorHandler, success } from "../helpers/response.js";
import * as addressService from "../services/address.js";

/* Create a new address */
export const createAddress = async (req, res, next) => {
    try {
        const result = await addressService.createAddress(req.user, req.body);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, {}, "Address added successfully");
    } catch (error) {
        next(error);
    }
};

/* Get addresses of a user */
export const getAddresses = async (req, res, next) => {
    try {
        const result = await addressService.getAddresses(req.user);

        return success(res, result.data, "Addresses fetched successfully");
    } catch (error) {
        next(error);
    }
};

/* Update an existing address */
export const updateAddress = async (req, res, next) => {
    try {
        const result = await addressService.updateAddress(req.user, req.params.id, req.body);

        if (!result.success) {
            return errorHandler(res, result.message);
        }
        return success(res, {}, "Address updated successfully");

    } catch (error) {
        next(error);
    }
};

/* Delete an existing address */
export const deleteAddress = async (req, res, next) => {
    try {
        const result = await addressService.deleteAddress(req.user, req.params.id);

        if (!result.success) {
            return errorHandler(res, result.message);
        }

        return success(res, null, result.message);
    } catch (error) {
        next(error);
    }
};