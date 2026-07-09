import Joi from "joi";
import mongoose from "mongoose";
import { productTypes } from "../helpers/constant.js";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("Invalid ObjectId");
  }
  return value;
});

const optionValueSchema = Joi.object({
  value: Joi.string().required().trim().messages({
    "any.required": "Option value is required",
    "string.empty": "Option value cannot be empty",
  }),
  image: Joi.string().uri().trim().messages({
    "string.uri": "Option image must be a valid URL",
  }),
  is_disabled: Joi.boolean().messages({
    "boolean.base": "Option is_disabled must be a boolean",
  }),
});

const optionSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Option name is required",
    "string.empty": "Option name cannot be empty",
  }),
  values: Joi.array().items(optionValueSchema).min(1).required().messages({
    "any.required": "Option values are required",
    "array.min": "Option values must include at least one value",
    "array.base": "Option values must be an array",
  }),
});

export const createProductValidation = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Product name is required",
    "string.empty": "Product name cannot be empty",
  }),
  description: Joi.string().allow("", null).optional(),
  images: Joi.array()
    .items(Joi.string().uri().trim())
    .min(1)
    .required()
    .messages({
      "any.required": "At least one product image is required",
      "array.min": "At least one product image is required",
      "array.base": "Images must be an array",
    }),
  product_type: Joi.string()
    .valid("jewellery", "diamond", "watch")
    .required()
    .messages({
      "any.required": "Product type is required",
      "any.only": "Invalid product type",
    }),
  diamond_type: Joi.string()
    .valid("labgrown", "natural")
    .required()
    .messages({
      "any.required": "Diamond type is required",
      "any.only": "Invalid diamond type",
    }),
  slug: Joi.string().trim().lowercase().optional(),
  price: Joi.number().optional().messages({
    "number.base": "Price must be a number",
  }),
  qty: Joi.number().required().messages({
    "number.base": "Quantity must be a number",
  }),
  pricing: Joi.object({
    diamond_cost: Joi.number().min(0).default(0),
    gemstone_cost: Joi.number().min(0).default(0),
    additional_cost: Joi.number().min(0).default(0),
  }).optional(),
  category_id: objectId.required().messages({
    "any.required": "Category ID is required",
  }),
  subcategory_id: objectId.required().messages({
    "any.required": "Subcategory ID is required",
  }),
  attribute_id: objectId.required().messages({
    "any.required": "Attribute ID is required",
  }),
  weight: Joi.number()
    .messages({ "number.base": "Option weight must be a number" })
    .required(),
  sku: Joi.string().required().trim().messages({
    "any.required": "SKU is required",
    "string.empty": "SKU cannot be empty",
  }),
  options: Joi.array().items(optionSchema).min(1).required().messages({
    "any.required": "Options are required",
    "array.min": "At least one option is required",
    "array.base": "Options must be an array",
  }),
}).custom((value, helpers) => {
  if (value.product_type !== "jewellery") {
    return value;
  }

  const hasGoldType = value.options.some(
    (option) => option.name.trim().toLowerCase() === "gold_type",
  );

  if (!hasGoldType) {
    return helpers.message(
      "gold_type option is required for jewellery products",
    );
  }

  return value;
});

export const editProductValidation = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Product name cannot be empty",
  }),
  description: Joi.string().allow("", null).optional(),
  images: Joi.array().items(Joi.string().uri().trim()).min(1).messages({
    "array.min": "At least one product image is required",
    "array.base": "Images must be an array",
  }),
  product_type: Joi.string().valid("jewellery", "diamond", "watch").messages({
    "any.only": "Invalid product type",
  }),
  diamond_type: Joi.string()
    .valid("labgrown", "natural")
    .optional()
    .disallow("")
    .messages({
      "any.required": "Diamond type is required",
      "any.only": "Invalid diamond type",
    }),
  slug: Joi.string().trim().lowercase().optional(),
  price: Joi.number().messages({
    "number.base": "Price must be a number",
  }),
  qty: Joi.number().required().messages({
    "number.base": "Quantity must be a number",
  }),
  sku: Joi.string().required().trim().messages({
    "any.required": "SKU is required",
    "string.empty": "SKU cannot be empty",
  }),
  pricing: Joi.object({
    diamond_cost: Joi.number().min(0).default(0),
    gemstone_cost: Joi.number().min(0).default(0),
    additional_cost: Joi.number().min(0).default(0),
  }).optional(),
  category_id: objectId.messages({
    "any.required": "Category ID is required",
  }),
  subcategory_id: objectId.messages({
    "any.required": "Subcategory ID is required",
  }),
  attribute_id: objectId.messages({
    "any.required": "Attribute ID is required",
  }),
  weight: Joi.number().messages({
    "number.base": "Option weight must be a number",
  }),
  options: Joi.array().items(optionSchema).optional(),
});

export const getProductsValidation = Joi.object({
  page: Joi.number().required().min(1).default(1),
  limit: Joi.number().required().min(1).default(5),
  search: Joi.string().allow(""),
  product_type: Joi.string()
    .valid(...productTypes)
    .optional(),
  sort_by: Joi.string()
    .valid(
      "latest",
      "name_asc",
      "name_desc",
      "price_low_high",
      "price_high_low",
    )
    .default("latest"),

  filters: Joi.object().optional(),
  category_slug: Joi.string().optional(),
  subcategory_slug: Joi.string().optional(),
});

/* Product get by id or slug identifier validation */
export const productIdentifierValidation = Joi.object({
  identifier: Joi.string().required().messages({
    "any.required": "Identifier is required",
    "string.empty": "Identifier cannot be empty",
  }),
});
