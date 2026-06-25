import Product from "../models/product.js";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Attribute from "../models/attributes.js";
import Globals from "../models/globals.js";
import { calculateJewelryPrice } from "../utills/productPrice.helper.js";

export const createProduct = async (payload) => {
  const { name, slug, category_id, subcategory_id, attribute_id } = payload;

  const category = await Category.findOne({ _id: category_id, is_deleted: 0 });
  if (!category) {
    return {
      success: false,
      message: `Category with id ${category_id} not found`,
    };
  }

  const subcategory = await Subcategory.findOne({
    _id: subcategory_id,
    is_deleted: 0,
  });
  if (!subcategory) {
    return {
      success: false,
      message: `Subcategory with id ${subcategory_id} not found`,
    };
  }

  const attribute = await Attribute.findById(attribute_id);
  if (!attribute) {
    return {
      success: false,
      message: `Attribute with id ${attribute_id} not found`,
    };
  }

  const existingSlug = slug
    ? await Product.findOne({ slug, is_deleted: 0 })
    : null;
  if (existingSlug) {
    return {
      success: false,
      message: `Slug ${slug} already exists`,
    };
  }

  const product = await Product.create(payload);

  return {
    success: true,
    data: product,
  };
};

/* Get product with pagination */
export const getProducts = async ({
  page,
  limit,
  skip,
  id,
}) => {
  const filter = { is_deleted: 0 };

  if (id) {
    filter.subcategory_id = id;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("subcategory_id")
      .populate("attribute_id")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Product.countDocuments(filter),
  ]);

  const pricingSettings = await Globals.findOne();

  const productsWithPrice = products.map(
    (product) => {
      let displayPrice = product.price;
      if (product.product_type === "jewelry") {
        displayPrice = calculateJewelryPrice(
          product,
          pricingSettings,
        );
      }
      return {
        ...product.toObject(),
        display_price: displayPrice,
      };
    },
  );

  return {
    products: productsWithPrice,
    total,
  };
};