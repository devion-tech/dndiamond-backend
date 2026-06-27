import Product from "../models/product.js";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Attribute from "../models/attributes.js";
import Globals from "../models/globals.js";
import { calculateJewelleryPrice, calculateJewelleryVariantPrices } from "../utills/productPrice.helper.js";
import { JEWELLERY } from "../helpers/constant.js";

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
export const getProducts = async ({ page, limit, skip, subcategory_id }) => {
  const filter = { is_deleted: 0 };

  if (subcategory_id) {
    filter.subcategory_id = subcategory_id;
  }

  const [products, total] = await Promise.all([
    Product.find(filter).select({ pricing: 0 })
      .populate("subcategory_id")
      // .populate("attribute_id")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Product.countDocuments(filter),
  ]);

  const pricingSettings = await Globals.findOne();

  const productsWithPrice = products.map(
    (product) => {
      let displayPrice = product.price;
      if (product.product_type === JEWELLERY) {
        displayPrice = calculateJewelleryPrice(
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

/* Get single product by id */
export const getSingleProduct = async (id) => {
  const product = await Product.findOne({
    _id: id,
    is_deleted: 0,
  })
    .populate("category_id")
    .populate("subcategory_id")
    .populate("attribute_id");

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  const pricingSettings = await Globals.findOne();
  let goldPrices = [];

  if (product.product_type === JEWELLERY) {
    goldPrices =
      calculateJewelleryVariantPrices(
        product,
        pricingSettings,
      );
  }

  const updatedOptions = product.options.map((option) => {
    if (option.name.toLowerCase() !== "gold_type") {
      return option;
    }

    return {
      ...option.toObject(),
      values: option.values.map((gold) => {
        const goldRate = pricingSettings[gold.value] || 0;
        const goldPrice = product.weight * goldRate;
        const makingCharge = product.weight * pricingSettings.making_charge;

        const finalPrice =
          goldPrice +
          makingCharge +
          (product.pricing?.diamond_cost || 0) +
          (product.pricing?.gemstone_cost || 0) +
          (product.pricing?.additional_cost || 0);

        return {
          value: gold.value,
          is_disabled: gold.is_disabled,
          price: finalPrice,
        };
      }),
    };
  });

  return {
    ...product.toObject(),
    options: updatedOptions,
  };
};
