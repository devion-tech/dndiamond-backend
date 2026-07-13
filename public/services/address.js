import Address from "../models/address.js";

/* Create a new address */
export const createAddress = async (userId, payload) => {

    const { is_default = 0 } = payload;

    // If setting new default address
    if (is_default) {
        await Address.updateMany(
            {
                user_id: userId,
            },
            {
                is_default: 1,
            }
        );
    }

    // First address automatically becomes default
    const addressCount = await Address.countDocuments({
        user_id: userId,
        is_deleted: 0,
    });

    const address =
        await Address.create({
            ...payload,
            user_id: userId,
            is_default: addressCount === 0 ? 1 : is_default,
        });

    return {
        success: true,
        data: address,
    };
};

/* Get address of user */
export const getAddresses = async (userId) => {
    const addresses = await Address.find({ user_id: userId, is_deleted: 0 })
        .sort({
            is_default: -1,
            createdAt: -1,
        })
        .select("-user_id -createdAt -updatedAt -is_deleted -__v");

    return {
        success: true,
        data: addresses,
    };
};

/* Update an existing address */
export const updateAddress = async (userId, addressId, payload) => {

    const address = await Address.findOne({
        _id: addressId,
        user_id: userId,
        is_deleted: 0,
    });

    if (!address) {
        return {
            success: false,
            message: "Address not found",
        };
    }

    // User wants this address to become default
    if (payload.is_default === 1) {
        await Address.updateMany(
            {
                user_id: userId,
                _id: { $ne: addressId },
            },
            {
                is_default: 0,
            }
        );
    }

    Object.assign(address, payload);

    await address.save();

    return {
        success: true,
        data: address,
    };
};

/* Delete an existing address */
export const deleteAddress = async (userId, addressId) => {

    const address = await Address.findOne({
        _id: addressId,
        user_id: userId,
        is_deleted: 0,
    });

    if (!address) {
        return {
            success: false,
            message: "Address not found",
        };
    }

    // Prevent deleting the only address
    const totalAddresses = await Address.countDocuments({
        user_id: userId,
        is_deleted: 0,
    });

    if (totalAddresses === 1) {
        return {
            success: false,
            message: "Cannot delete the only address",
        };
    }

    // If deleting default address,
    // assign another one as default
    if (address.is_default) {
        const newDefault = await Address.findOne({
            user_id: userId,
            _id: { $ne: addressId },
            is_deleted: 0,
        }).sort({
            createdAt: -1,
        });

        if (newDefault) {
            newDefault.is_default = true;
            await newDefault.save();
        }
    }

    address.is_deleted = 1;

    await address.save();

    return {
        success: true,
        message:
            "Address deleted successfully",
    };
};