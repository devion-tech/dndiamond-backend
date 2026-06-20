import mongoose from "mongoose";

const adminDetails = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "",
    },
    email: {
      type: String,
      required: false,
      default: "",
    },
    isEmailVerify: {
      type: Number,
      required: false,
      default: 1,
    },
    password: {
      type: String,
      required: false,
      default: "",
    },
    isDeleted: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
const Admin = new mongoose.model("Admin", adminDetails);
export default Admin;
