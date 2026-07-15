import cloudinary, {
  uploadImage,
  uploadToCloudinary,
  destroyFiles,
} from "../middelware/multer.js";
import Landing from "../models/landing.js";

/* Get all landing page hero images */
export const getLandings = async () => {
  try {
    const landings = await Landing.find().sort({ createdAt: -1 });
    return { success: true, data: landings };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/* Get landing page hero image by ID */
export const getLandingById = async ({ id }) => {
  try {
    const landing = await Landing.findById(id);

    if (!landing) {
      return { success: false, message: "Hero image not found" };
    }

    return { success: true, data: landing };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/* Create landing page hero image */
export const createLanding = async ({ title, description, file }) => {
  let image = null;

  if (file) {
    const uploaded = await uploadToCloudinary(file, "landing");

    image = {
      image: uploaded.url,
      public_id: uploaded.publicId,
    };
  }

  const landing = await Landing.create({
    title,
    description,
    image: image,
  });

  return {
    success: true,
    data: landing,
  };
};

/* Update landing page hero image */
export const updateLanding = async ({ id, title, description, file }) => {
  try {
    const landing = await Landing.findById(id);

    if (!landing) {
      return { success: false, message: "Hero image not found" };
    }

    if (file) {
      if (landing.image && landing.image.public_id) {
        await destroyFiles([landing.image.public_id]);
      }

      const uploaded = await uploadToCloudinary(file, "landing");
      landing.image = {
        image: uploaded.url,
        public_id: uploaded.publicId,
      };
    }

    if (title !== undefined) landing.title = title;
    if (description !== undefined) landing.description = description;

    await landing.save();

    return { success: true, data: landing };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/* Delete landing page hero image */
export const deleteLanding = async ({ id }) => {
  try {
    const landing = await Landing.findById(id);

    if (!landing) {
      return { success: false, message: "Hero image not found" };
    }

    if (landing.image && landing.image.public_id) {
      await destroyFiles([landing.image.public_id]);
    }

    await Landing.findByIdAndDelete(id);

    return { success: true, message: "Hero image deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
