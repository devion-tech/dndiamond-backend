import mongoose from "mongoose";

const OptionValueSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    is_disabled: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      required: false,
    },
  },
  { _id: false },
);

const OptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    values: [OptionValueSchema],
  },
  { _id: false },
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      default: [],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: false,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    attribute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
    options: [OptionSchema],
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Product = new mongoose.model("Product", ProductSchema);
export default Product;
