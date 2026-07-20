import { escapeRegex } from "../helpers/constant.js";
import PromoCode from "../models/promoCode.js";

/* Create promo code */
export const createPromoCode = async (payload) => {
    const {
        code,
        discount_type,
        discount_value,
        minimum_order_amount,
        maximum_discount_amount,
        usage_limit,
        start_date,
        expiry_date,
    } = payload;

    const existing = await PromoCode.findOne({
        code: code.toUpperCase(),
        is_deleted: 0,
    });

    if (existing) {
        return {
            success: false,
            message: "Promo code already exists",
        };
    }

    if (new Date(expiry_date) <= new Date(start_date)) {
        return {
            success: false,
            message: "Expiry date must be greater than start date",
        };
    }

    const promoCode = await PromoCode.create({
        code: code.toUpperCase(),
        discount_type,
        discount_value,
        minimum_order_amount,
        maximum_discount_amount,
        usage_limit,
        start_date,
        expiry_date,
    });

    return {
        success: true,
        data: promoCode,
    };
};

/* Get promo codes */
export const getPromoCodes = async ({ skip, limit, search }) => {
    const filter = { is_deleted: 0 };

    if (search) {
        filter.code = {
            $regex: `^${escapeRegex(search.trim())}$`,
            $options: "i",
        };
    }

    const [promoCodes, total] = await Promise.all(
        [
            PromoCode.find(filter)
                .select("_id code discount_type discount_value minimum_order_amount maximum_discount_amount usage_limit start_date expiry_date")
                .sort({ createdAt: -1, })
                .skip(skip)
                .limit(limit),

            PromoCode.countDocuments(filter)]);

    return { promoCodes, total };
};

/* Update promo code */
export const updatePromoCode = async (id, payload) => {
    const promoCode = await PromoCode.findOne({
        _id: id,
        is_deleted: 0,
    });

    if (!promoCode) {
        return {
            success: false,
            message: "Promo code not found",
        };
    }

    if (payload.code) {
        const existing = await PromoCode.findOne({
            _id: { $ne: id, },
            code: payload.code.toUpperCase(),
            is_deleted: 0,
        });

        if (existing) {
            return {
                success: false,
                message: "Promo code already exists",
            };
        }
    }

    const startDate = payload.start_date || promoCode.start_date;
    const expiryDate = payload.expiry_date || promoCode.expiry_date;

    if (new Date(expiryDate) <= new Date(startDate)) {
        return {
            success: false,
            message: "Expiry date must be greater than start date",
        };
    }

    const updated = await PromoCode.findByIdAndUpdate(
        id,
        {
            $set: {
                ...payload,
                ...(payload.code && {
                    code:
                        payload.code.toUpperCase(),
                }),
            },
        },
        {
            new: true,
        }
    );

    return {
        success: true,
        data: updated,
    };
};

export const deletePromoCode = async (id) => {
    const promoCode = await PromoCode.findOne({
        _id: id,
        is_deleted: 0,
    });

    if (!promoCode) {
        return {
            success: false,
            message: "Promo code not found",
        };
    }

    await PromoCode.findByIdAndUpdate(id, { is_deleted: 1, });

    return {
        success: true,
    };
};