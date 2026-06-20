import { encryptData, verifyData } from "../common/randomPassword.js";
import { ROLE } from "../helpers/constant.js";
import User from "../models/user.js";
import { authToken } from "../utills/jwt.helper.js";

export const createUser = async (data) => {
  const password = data.password;
  data.password = await encryptData(password);
  const user = new User(data);
  return user.save();
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
      return { success: false, message: "Invalid password" };
    }
    const token = await authToken({
      _id: user._id,
      email: user.email,
      role: ROLE.USER,
    });
    return { success: true, token, user };
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
