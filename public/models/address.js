import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        first_name: {
            type: String,
            required: true,
            trim: true,
        },

        last_name: {
            type: String,
            required: true,
            trim: true,
        },

        mobile: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },

        country: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        address_line_1: {
            type: String,
            required: true,
            trim: true,
        },

        address_line_2: {
            type: String,
            default: "",
            trim: true,
        },

        landmark: {
            type: String,
            default: "",
            trim: true,
        },

        postal_code: {
            type: String,
            required: true,
            trim: true,
        },

        is_default: {
            type: Number,
            default: 0,
        },

        is_deleted: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);
export default Address;