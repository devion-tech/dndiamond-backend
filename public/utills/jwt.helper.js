import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Admin from "../models/admin.js";
import { ROLE } from "../helpers/constant.js";

// generate token
export const authToken = async (obj) => {
  try {
    const token = await jwt.sign(obj, process.env.SECRET_KEY, {
      expiresIn: obj.role !== ROLE.ADMIN ? "2d" : "30d",
    });
    return token;
  } catch (error) {
    return error;
  }
};

// verify token
export const verifytoken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "You are not authorized!",
      data: [{ isExpire: 1 }],
    });
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.SECRET_KEY,
    async (err, user) => {
      if (err) {
        return res.status(200).json({
          status: 401,
          success: false,
          message: "User is unAuthorized!",
        });
      } else {
        let getUser = await User.findById({ _id: user._id });
        if (getUser) {
          req.user = getUser._id;
          next();
        } else {
          return res
            .status(500)
            .json({ success: false, message: "User not found!" });
        }
      }
    },
  );
};

export const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "You are not authorized!",
      data: [{ isExpire: 1 }],
    });
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.SECRET_KEY,
    async (err, user) => {
      if (err) {
        return res.status(200).json({
          status: 401,
          success: false,
          message: "Admin is unAuthorized!",
        });
      } else {
        let getUser = await Admin.findById({ _id: user._id });
        if (getUser) {
          req.user = getUser._id;
          next();
        } else {
          return res
            .status(500)
            .json({ success: false, message: "User not authorized!" });
        }
      }
    },
  );
};

// generate refresh token
export const refreshToken = async (obj) => {
  try {
    const token = jwt.sign(obj, process.env.REFRESH_TOKEN_SECRETE_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    return error;
  }
};

// Verify refresh token
export const refreshVerifytoken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    return res.json({ success: false, message: "You are not authorized!" });
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.REFRESH_TOKEN_SECRETE_KEY,
    (err, user) => {
      if (err) {
        return res.send("token is not valid");
      }
      req.user = user;
      next();
    },
  );
};
