import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const LandingSchema = new mongoose.Schema(
  {
    image: {
      type: ImageSchema,
      default: null,
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Landing = mongoose.model("Landing", LandingSchema);
export default Landing;
