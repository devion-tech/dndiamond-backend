import Attribute from "../models/attributes.js";

const typeQuery = (type) => ({
  type: {
    $regex: `^${type.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    $options: "i",
  },
});

export const createAttribute = async (payload) => {
  const { type, attributes } = payload;

  const existing = await Attribute.findOne({
    ...typeQuery(type),
    is_deleted: 0,
  });

  if (existing) {
    return {
      success: false,
      message: `${type} attributes already exist`,
    };
  }

  const attribute = await Attribute.create({
    type,
    attributes,
  });

  return {
    success: true,
    data: attribute,
  };
};

export const updateAttribute = async (payload) => {
  const { id, attributes, type } = payload;

  const existing = await Attribute.findById(id);

  if (!existing) {
    return {
      success: false,
      message: `Attributes with id ${id} not found`,
    };
  }

  if (type) {
    const duplicate = await Attribute.findOne({
      ...typeQuery(type),
      _id: { $ne: id },
      is_deleted: 0,
    });

    if (duplicate) {
      return {
        success: false,
        message: `${type} attributes already exist`,
      };
    }

    existing.type = type;
  }

  if (attributes !== undefined) {
    existing.attributes = attributes;
  }

  await existing.save();

  return {
    success: true,
    data: existing,
  };
};

export const deleteAttribute = async (payload) => {
  const { id } = payload;

  const existing = await Attribute.findById(id);

  if (!existing) {
    return {
      success: false,
      message: `Attributes with id ${id} not found`,
    };
  }

  existing.is_deleted = 1;
  await existing.save();

  return {
    success: true,
    data: null,
  };
};

export const getAttributes = async (filter) => {
  try {
    const query = { is_deleted: 0 };

    if (filter.type) {
      query.type = filter.type;
    }

    const attributes = await Attribute.find(query);

    return {
      success: true,
      data: attributes,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
