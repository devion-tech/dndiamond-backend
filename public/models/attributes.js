import mongoose from "mongoose";

const AttributeOptionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const AttributeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },

    attributes: {
      type: Map,
      of: [AttributeOptionSchema],
      default: {},
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toObject: { flattenMaps: true },
    toJSON: { flattenMaps: true },
  },
);

const Attribute = new mongoose.model("Attribute", AttributeSchema);
export default Attribute;
