import { encryptData, verifyData } from "../common/randomPassword.js";
import { JEWELLERY, ROLE } from "../helpers/constant.js";
import Globals from "../models/globals.js";
import Landing from "../models/landing.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { authToken } from "../utills/jwt.helper.js";
import { calculateJewelleryPrice } from "../utills/productPrice.helper.js";

export const createUser = async (data) => {
  const password = data.password;
  data.password = await encryptData(password);
  const user = new User(data);
  await user.save();

  const token = await authToken({
    _id: user._id,
    email: user.email,
    role: ROLE.USER,
  });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const findUser = async (data) => {
  const user = await User.findOne(data);
  return user;
};

export const findUsers = async ({
  pageNumber,
  pageLimit,
  skip,
  search,
  ...filter
} = {}) => {
  const query = {
    isDeleted: 0,
    ...filter,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  let dbQuery = User.find(query);
  if (typeof skip === "number" && typeof pageLimit === "number") {
    dbQuery = dbQuery.skip(skip).limit(pageLimit);
  }

  const [users, total] = await Promise.all([
    dbQuery.exec(),
    User.countDocuments(query),
  ]);
  return { users, total };
};

export const loginUser = async (email, password) => {
  try {
    const user = await findUser({ email });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const isMatch = await verifyData(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid login credentials!" };
    }
    const token = await authToken({
      _id: user._id,
      email: user.email,
      role: ROLE.USER,
    });

    return {
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    throw new Error("internal server error");
  }
};

export const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await encryptData(data.password);
  }
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  return user;
};

/* get main page data */
export const getMainPageData = async (currency) => {
  const heroImage = await Landing.find();

  const bestSellingProduct = await Product.find({
    isBestSell: 1,
    is_deleted: 0,
  });

  const pricingSettings = await Globals.findOne();

  const bestSellingProductsWithPrice = bestSellingProduct.map((product) => {
    let displayPrice = product.price;

    if (product.product_type === JEWELLERY) {
      displayPrice = calculateJewelleryPrice(product, pricingSettings, currency);
    }

    return {
      ...product.toObject(),
      display_price: displayPrice,
    };
  });

  return {
    image: heroImage,
    best_selling_products: bestSellingProductsWithPrice,
  };
};
