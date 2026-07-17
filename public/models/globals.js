import mongoose from "mongoose";

const GlobalsSchema = new mongoose.Schema(
  {
    "10k": {
      type: Number,
      required: true,
      default: 0,
    },
    "14k": {
      type: Number,
      required: true,
      default: 0,
    },
    "18k": {
      type: Number,
      required: true,
      default: 0,
    },
    "22k": {
      type: Number,
      required: true,
      default: 0,
    },
    "24k": {
      type: Number,
      required: true,
      default: 0,
    },
    making_charge: {
      type: Number,
      required: true,
      default: 0,
    },
    currency_rates: {
      type: Map,
      of: Number,
      default: {
        HKD: 1
      }
    }
  },
  {
    timestamps: true,
  },
);

const Globals = mongoose.model("Globals", GlobalsSchema);
export default Globals;
