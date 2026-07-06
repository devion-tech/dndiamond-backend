import Product from "../models/product.js";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Attribute from "../models/attributes.js";
import Globals from "../models/globals.js";
import {
  calculateJewelleryPrice,
  calculateJewelleryVariantPrices,
} from "../utills/productPrice.helper.js";
import { JEWELLERY } from "../helpers/constant.js";
import mongoose from "mongoose";
import Review from "../models/review.js";
import Wishlist from "../models/wishlist.js";

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

export const editProduct = async (id, payload) => {
  const product = await Product.findOne({ _id: id, is_deleted: 0 });
  if (!product) {
    return { success: false, message: "Product not found" };
  }

  const { slug, category_id, subcategory_id, attribute_id } = payload;

  if (category_id) {
    const category = await Category.findOne({
      _id: category_id,
      is_deleted: 0,
    });
    if (!category) {
      return {
        success: false,
        message: `Category with id ${category_id} not found`,
      };
    }
  }

  if (subcategory_id) {
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
  }

  if (attribute_id) {
    const attribute = await Attribute.findById(attribute_id);
    if (!attribute) {
      return {
        success: false,
        message: `Attribute with id ${attribute_id} not found`,
      };
    }
  }

  if (slug) {
    const existingSlug = await Product.findOne({
      slug,
      is_deleted: 0,
      _id: { $ne: id },
    });
    if (existingSlug) {
      return { success: false, message: `Slug ${slug} already exists` };
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return { success: true, data: updatedProduct };
};

/* Get product with pagination */
export const getProducts = async ({
  page,
  limit,
  skip,
  product_type,
  filters,
  sort_by,
  search,
  category_slug,
  subcategory_slug,
  user_id = null
}) => {
  const filter = { is_deleted: 0 };

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category_slug) {
    const category = await Category.findOne({
      slug: category_slug,
      is_deleted: 0,
    });
    filter.category_id = category?._id;
  }

  if (subcategory_slug) {
    const subcategory = await Subcategory.findOne({
      slug: subcategory_slug,
      is_deleted: 0,
    });
    filter.subcategory_id = subcategory?._id;
  }

  if (product_type) {
    filter.product_type = product_type;
  }

  const optionFilters = [];

  if (filters) {
    Object.entries(filters).forEach(([optionName, values]) => {
      if (Array.isArray(values) && values.length) {
        optionFilters.push({
          options: {
            $elemMatch: {
              name: optionName.toLowerCase(),
              values: {
                $elemMatch: {
                  value: {
                    $in: values,
                  },
                },
              },
            },
          },
        });
      }
    });
  }

  if (optionFilters.length) {
    filter.$and = optionFilters;
  }

  const products = await Product.find(filter)
    .select({ pricing: 0 })
    .populate("subcategory_id");

  let wishlistProductIds = new Set();

  if (user_id) {
    const wishlist = await Wishlist.findOne({ user_id });
    wishlistProductIds =
      new Set(
        wishlist.products.map(
          (item) =>
            item.product_id.toString()
        )
      );
  }
  const pricingSettings = await Globals.findOne();

  const productsWithPrice = products.map((product) => {
    let displayPrice = product.price;

    if (product.product_type === JEWELLERY) {
      displayPrice = calculateJewelleryPrice(product, pricingSettings);
    }

    return {
      ...product.toObject(),
      display_price: displayPrice,
      is_wishlist: user_id
        ? wishlistProductIds.has(
          product._id.toString()
        )
        : false,
    };
  });

  switch (sort_by) {
    case "name_asc":
      productsWithPrice.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "name_desc":
      productsWithPrice.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "price_low_high":
      productsWithPrice.sort((a, b) => a.display_price - b.display_price);
      break;

    case "price_high_low":
      productsWithPrice.sort((a, b) => b.display_price - a.display_price);
      break;

    default:
      productsWithPrice.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
  }

  const total = productsWithPrice.length;
  const paginatedProducts = productsWithPrice.slice(skip, skip + limit);

  return {
    products: paginatedProducts,
    total,
  };
};

/* Get single product by id */
export const getSingleProduct = async (id, userId = null) => {
  const query = mongoose.Types.ObjectId.isValid(id)
    ? {
      _id: id,
      is_deleted: 0,
    }
    : {
      slug: id,
      is_deleted: 0,
    };

  const product = await Product.findOne(query).select("-updatedAt -__v")
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
    goldPrices = calculateJewelleryVariantPrices(product, pricingSettings);
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

  const reviews = await Review.find({ product_id: product._id, is_deleted: 0 })
    .populate("user_id", "name")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  let myReview = null;

  if (userId) {
    myReview = await Review.findOne({
      product_id: product._id,
      user_id: userId,
      is_deleted: 0,
    }).select("rating review createdAt");
  }

  let isWishlist = false;

  if (userId) {
    const wishlist =
      await Wishlist.findOne({
        user_id: userId,
        "products.product_id":
          product._id,
      });

    isWishlist = !!wishlist;
  }

  return {
    ...product.toObject(),
    options: updatedOptions,
    review_summary: {
      average_rating: Number(averageRating.toFixed(1)),
      total_reviews: totalReviews,
    },
    my_review: myReview,
    reviews,
    is_wishlist: isWishlist,
    success: true,
  };
};

/* Delete single product */
export const deleteProduct = async (id) => {
  const product = await Product.findOne({ _id: id, is_deleted: 0 });

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  const result = await Product.findByIdAndUpdate(
    { _id: id },
    { is_deleted: 1 },
  );
  return {
    success: true,
    data: result,
  };
};
