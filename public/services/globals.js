import Globals from "../models/globals.js";

export const addGlobals = async (payload) => {
  const existing = await Globals.findOne();
  if (existing) {
    return {
      success: false,
      message: "Global settings already exist. Use update instead.",
    };
  }

  const globals = await Globals.create(payload);
  return {
    success: true,
    data: globals,
  };
};

export const updateGlobals = async (payload) => {
  const existing = await Globals.findOne();
  if (!existing) {
    return {
      success: false,
      message: "Global settings not found. Create it first.",
    };
  }

  Object.assign(existing, payload);
  await existing.save();

  return {
    success: true,
    data: existing,
  };
};

export const getGlobals = async () => {
  const globals = await Globals.findOne();
  if (!globals) {
    return {
      success: false,
      message: "Global settings not found.",
    };
  }

  return {
    success: true,
    data: globals,
  };
};
