import mongoose from "mongoose";
import { productTypes } from "../helpers/constant.js";

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
  },
  { _id: false },
);

const OptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    weight: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: productTypes,
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      default: 0,
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

    // Mainly for jewellery products
    pricing: {
      diamond_cost: {
        type: Number,
        default: 0,
      },

      gemstone_cost: {
        type: Number,
        default: 0,
      },

      additional_cost: {
        type: Number,
        default: 0,
      },
    },

    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
