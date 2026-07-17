import DiamondInquiry from "../models/diamondInquiry.js";

/* Send diamond inquiry by user api  */
export const createDiamondInquiry = async (payload, userId = null) => {

    const inquiry = await DiamondInquiry.create({
        ...payload,
        user_id: userId,
    });

    return {
        success: true,
        message: "Diamond inquiry submitted successfully.",
        data: inquiry,
    };
};

/* Get diamond inquiry by admin */
export const getDiamondInquiries = async ({ page = 1, limit = 10, skip, status, search }) => {

    const filter = {
        is_deleted: 0,
    };

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                mobile: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                country: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const inquiries = await DiamondInquiry.find(filter)
        .sort({ createdAt: -1, })
        .select("-is_deleted -updatedAt")
        .skip(skip)
        .limit(limit)
        .select("-__v");

    const total = await DiamondInquiry.countDocuments(filter);

    return {
        inquiries,
        total
    };
};

/* Get user inquiry by userId */
export const getMyInquiries = async ({
    userId,
    page = 1,
    limit = 10,
    skip
}) => {

    const filter = { user_id: userId, is_deleted: 0 };

    const inquiries = await DiamondInquiry.find(filter)
        .sort({ createdAt: -1, })
        .select("-status -is_deleted -updatedAt")
        .skip(skip)
        .limit(limit)
        .select("-__v");

    const total = await DiamondInquiry.countDocuments(filter);

    return {
        myInquiry: inquiries,
        total,
    };
};

/* Update diamond inquiry status by admin */
export const updateDiamondInquiry = async (id, payload) => {
    const inquiry = await DiamondInquiry.findOne({ _id: id, is_deleted: 0 });

    if (!inquiry) {
        return {
            success: false,
            message: "Inquiry not found.",
        };
    }

    if (payload.status !== undefined) {
        inquiry.status = payload.status;
    }

    if (payload.admin_notes !== undefined) {
        inquiry.admin_notes = payload.admin_notes;
    }

    await inquiry.save();

    return {
        success: true,
        message: "Inquiry updated successfully.",
        data: inquiry,
    };
};

/* Delete diamond inquiry by admin */
export const deleteDiamondInquiry = async (id) => {

    const inquiry = await DiamondInquiry.findOne({
        _id: id,
        is_deleted: 0,
    });

    if (!inquiry) {
        return {
            success: false,
            message: "Inquiry not found.",
        };
    }

    inquiry.is_deleted = 1;

    await inquiry.save();

    return {
        success: true,
        message: "Inquiry deleted successfully.",
    };
};