import { encryptData, verifyData } from "../common/randomPassword.js";
import { ROLE } from "../helpers/constant.js";
import Admin from "../models/admin.js";
import Category from "../models/category.js";
import DiamondInquiry from "../models/diamondInquiry.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Subcategory from "../models/subcategory.js";
import User from "../models/user.js";
import { authToken } from "../utills/jwt.helper.js";

/* Create admin */
export const createAdmin = async (data) => {
  const password = data.password;
  data.password = await encryptData(password);
  const user = new Admin(data);
  return user.save();
};

/* Find admin */
export const findAdmin = async (data) => {
  const admin = await Admin.findOne(data);
  return admin;
};

/* Login admin */
export const loginAdmin = async (email, password) => {
  try {
    const admin = await findAdmin({ email });
    if (!admin) {
      return { success: false, message: "Admin not found" };
    }
    const isMatch = await verifyData(password, admin.password);
    if (!isMatch) {
      return { success: false, message: "Invalid login credentials" };
    }
    const token = await authToken({
      _id: admin._id,
      email: admin.email,
      role: ROLE.ADMIN,
    });
    return {
      success: true,
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    };
  } catch (error) {
    throw new Error("internal server error");
  }
};

/* Get admin dashboard */
export const getDashboard = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    activeOrders,
    recentOrders,
    diamondInquiry
  ] = await Promise.all([

    User.countDocuments({ is_deleted: 0, }),
    Product.countDocuments({ is_deleted: 0, }),
    Order.countDocuments({ is_deleted: 0, }),
    await Order.countDocuments({
      order_status: {
        $nin: ["cancelled", "returned", "delivered"],
      },
      is_deleted: 0,
    }),
    Order.find({ is_deleted: 0, })
      .populate("user_id", "name email")
      .select("address _id user_id products order_number products total_amount base_total_amount order_status createdAt")
      .sort({ createdAt: -1, })
      .limit(5),
    DiamondInquiry.find({ is_deleted: 0, })
      .populate("user_id", "name email")
      .select("_id createdAt user_id budget_min budget_max")
      .sort({ createdAt: -1, })
      .limit(5),
  ]);

  const revenueData = await Order.aggregate([
    {
      $match: {
        payment_status: "paid",
        order_status: {
          $nin: ["cancelled", "returned"],
        },
        is_deleted: 0,
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum:
            "$total_amount",
        },
      },
    },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  return {
    success: true,
    message: "Dashboard data fetched successfully",
    data: {
      users: totalUsers,
      products: totalProducts,
      orders: {
        total: totalOrders,
        activeOrders: activeOrders
      },
      revenue: totalRevenue,
      recent_orders: recentOrders,
      diamondInquiry
    },
  };
};
