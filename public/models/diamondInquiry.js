import mongoose from "mongoose";

const DiamondInquirySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // Budget
        budget_min: {
            type: Number,
            default: null,
        },

        budget_max: {
            type: Number,
            default: null,
        },

        // Carat
        carat_min: {
            type: Number,
            default: null,
        },

        carat_max: {
            type: Number,
            default: null,
        },

        // Single select
        shape: {
            type: String,
            default: "",
        },

        // Multi Select
        clarity_grades: {
            type: [String],
            default: [],
        },

        color_grades: {
            type: [String],
            default: [],
        },

        certification_labs: {
            type: [String],
            default: [],
        },

        cut_grades: {
            type: [String],
            default: [],
        },

        polish_grades: {
            type: [String],
            default: [],
        },

        symmetry_grades: {
            type: [String],
            default: [],
        },

        fluorescence_intensity: {
            type: [String],
            default: [],
        },

        additional_notes: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "new",
                "contacted",
                "quoted",
                "closed",
                "cancelled",
            ],
            default: "new",
        },

        admin_notes: {
            type: String,
            default: "",
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

const DiamondInquiry = mongoose.models.DiamondInquiry || mongoose.model("DiamondInquiry", DiamondInquirySchema);

export default DiamondInquiry;