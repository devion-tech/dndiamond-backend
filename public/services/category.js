import mongoose from "mongoose";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Attribute from "../models/attributes.js";
import Product from "../models/product.js";
import { generateSlug } from "../helpers/slug.js";
import { escapeRegex } from "../helpers/constant.js";

export const createCategory = async (payload) => {
  const { name, attribute_id, image, subcategories = [] } = payload;

  const existing = await Category.findOne({
    name: {
      $regex: `^${escapeRegex(name.trim())}$`,
      $options: "i",
    },
    is_deleted: 0,
  });

  if (existing) {
    return {
      success: false,
      message: `Category ${name} already exists`,
    };
  }

  const attribute = await Attribute.findById(attribute_id);
  if (!attribute) {
    return {
      success: false,
      message: `Attribute with id ${attribute_id} not found`,
    };
  }

  const slug = await generateSlug(name);

  const category = await Category.create({
    name,
    attribute_id,
    image,
    slug,
  });

  const createdSubcategories = [];
  const processedNames = new Set();

  // Process and deduplicate subcategories
  for (const subcategory of subcategories) {
    if (!subcategory?.name) {
      continue;
    }

    const normalizedName = subcategory.name.trim().toLowerCase();

    // Check if empty after trim or already processed
    if (!normalizedName) {
      continue;
    }

    // Check if this name was already processed in this batch
    if (processedNames.has(normalizedName)) {
      continue;
    }

    // Check if this subcategory already exists globally (in any category)
    const existingSubcategory = await Subcategory.findOne({
      name: {
        $regex: `^${escapeRegex(subcategory.name.trim())}$`,
        $options: "i",
      },
      is_deleted: 0,
    });

    if (existingSubcategory) {
      continue;
    }

    // Mark as processed and create
    processedNames.add(normalizedName);

    const created = await Subcategory.create({
      name: subcategory.name.trim(),
      parent_id: category._id,
    });
    createdSubcategories.push(created);
  }

  return {
    success: true,
    data: {
      category,
    },
  };
};

export const createSubcategory = async (payload) => {
  const { name, parent_id } = payload;

  const category = await Category.findById(parent_id);
  if (!category || category.is_deleted === 1) {
    return {
      success: false,
      message: `Category with id ${parent_id} not found`,
    };
  }

  const existing = await Subcategory.findOne({
    name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" },
    parent_id,
    is_deleted: 0,
  });

  if (existing) {
    return {
      success: false,
      message: `Subcategory ${name} already exists for this category`,
    };
  }

  const slug = await generateSlug(name);
  const subcategory = await Subcategory.create({
    name,
    parent_id,
    slug,
  });

  return {
    success: true,
    data: subcategory,
  };
};

export const updateSubcategory = async (payload) => {
  const { id, name, parent_id } = payload;

  const existing = await Subcategory.findById(id);

  if (!existing) {
    return {
      success: false,
      message: `Subcategory with id ${id} not found`,
    };
  }

  if (name !== undefined && name !== existing.name) {
    const newSlug = await generateSlug(name);

    const slugExists = await Subcategory.findOne({
      _id: { $ne: id },
      slug: newSlug,
      is_deleted: 0,
    });

    if (slugExists) {
      return {
        success: false,
        message: `Subcategory slug "${newSlug}" already exists`,
      };
    }

    existing.name = name;
    existing.slug = newSlug;
  }

  if (parent_id !== undefined && parent_id !== existing.parent_id) {
    const category = await Category.findById(parent_id);
    if (!category || category.is_deleted === 1) {
      return {
        success: false,
        message: `Category with id ${parent_id} not found`,
      };
    }

    existing.parent_id = parent_id;

    await Product.updateMany(
      { subcategory_id: id, is_deleted: 0 },
      { category_id: parent_id },
    );
  }

  const duplicate = await Subcategory.findOne({
    _id: { $ne: id },
    name: { $regex: `^${escapeRegex(existing.name)}$`, $options: "i" },
    parent_id: existing.parent_id,
    is_deleted: 0,
  });

  if (duplicate) {
    return {
      success: false,
      message: `Subcategory ${existing.name} already exists for this category`,
    };
  }

  await existing.save();

  return {
    success: true,
    data: existing,
  };
};

export const updateCategory = async (payload) => {
  const { id, name, attribute_id, image } = payload;

  const category = await Category.findById(id);
  if (!category || category.is_deleted === 1) {
    return {
      success: false,
      message: `Category with id ${id} not found`,
    };
  }

  // Check if new name already exists (excluding current category)
  if (name !== undefined && name !== category.name) {
    const existing = await Category.findOne({
      _id: { $ne: id },
      name: {
        $regex: `^${escapeRegex(name)}$`,
        $options: "i",
      },
      is_deleted: 0,
    });

    if (existing) {
      return {
        success: false,
        message: `Category ${name} already exists`,
      };
    }
  }

  // Validate attribute exists if provided
  if (attribute_id !== undefined) {
    const attribute = await Attribute.findById(attribute_id);
    if (!attribute) {
      return {
        success: false,
        message: `Attribute with id ${attribute_id} not found`,
      };
    }
  }

  // Update category
  if (name !== undefined) {
    category.name = name;
    category.slug = await generateSlug(name);
  }

  if (attribute_id !== undefined) category.attribute_id = attribute_id;
  if (image !== undefined) category.image = image;

  await category.save();

  return {
    success: true,
    data: category,
  };
};

export const deleteSubcategory = async (payload) => {
  const { id } = payload;

  const subcategory = await Subcategory.findById(id);
  if (!subcategory || subcategory.is_deleted === 1) {
    return {
      success: false,
      message: `Subcategory with id ${id} not found`,
    };
  }

  subcategory.is_deleted = 1;
  await subcategory.save();

  return {
    success: true,
    data: subcategory,
  };
};

export const deleteCategory = async (payload) => {
  const { id } = payload;

  const category = await Category.findById(id);
  if (!category || category.is_deleted === 1) {
    return {
      success: false,
      message: `Category with id ${id} not found`,
    };
  }

  category.is_deleted = 1;
  await category.save();

  await Subcategory.updateMany(
    { parent_id: category._id, is_deleted: 0 },
    { is_deleted: 1 },
  );

  return {
    success: true,
    data: category,
  };
};

export const getCategories = async (filter) => {
  try {
    const query = { is_deleted: 0 };

    if (filter.name) {
      query.name = {
        $regex: `^${filter.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }

    const categories = await Category.find(query).select(
      "_id name image attribute_id slug",
    );

    const categoriesWithSub = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({
          parent_id: category._id,
          is_deleted: 0,
        }).select("_id name slug");

        return {
          ...category.toObject(),
          subcategories,
        };
      }),
    );

    return {
      success: true,
      data: categoriesWithSub,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCategoryById = async (payload) => {
  try {
    const { id } = payload;

    const category = await Category.findOne({
      _id: id,
      is_deleted: 0,
    })
      .select("_id name attribute_id")
      .populate({
        path: "attribute_id",
        select: "type attributes",
      });

    if (!category) {
      return {
        success: false,
        message: `Category with id ${id} not found`,
      };
    }

    const subcategories = await Subcategory.find({
      parent_id: category._id,
      is_deleted: 0,
    }).select("_id name ");

    return {
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSubCategories = async () => {
  try {
    const query = { is_deleted: 0 };
    const subCategories = await Subcategory.find(query).select("_id name");
    return subCategories;
  } catch (error) {
    throw new Error("Internal server error", error.message);
  }
};
