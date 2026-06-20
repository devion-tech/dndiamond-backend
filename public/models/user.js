import mongoose from "mongoose";

const userDetails = new mongoose.Schema(
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
    meta: {
      type: String,
      required: false,
      default: "",
    },
    isGoogleLogin: {
      type: Number,
      required: false,
      default: 0,
    },
    isBlock: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
const User = new mongoose.model("User", userDetails);
export default User;
