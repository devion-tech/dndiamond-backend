import cloudinary, {
  uploadImage,
  uploadToCloudinary,
  destroyFiles,
} from "../middelware/multer.js";
import Landing from "../models/landing.js";

/* Add new product image by admin */
export const addNewFile = async (files) => {
  try {
    const response = await Promise.all(
      files.map((file) => uploadToCloudinary(file, "products")),
    );
    return response;
  } catch (error) {
    throw new Error("Failed to add new file!");
  }
};

/* Destroy image by admin */
export const deleteFile = async (ids) => {
  try {
    const response = await destroyFiles(ids);
    return response;
  } catch (error) {
    throw new Error(error, "Failed to delete  file!");
  }
};

/* Create landing page hero image */
export const createLanding = async ({ title, description, files }) => {
  const images = [];

  if (files && files.length) {
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file, "landing");

      images.push({
        image: uploaded.url,
        public_id: uploaded.publicId,
      });
    }
  }

  const landing = await Landing.create({
    title,
    description,
    image: images,
  });

  return {
    success: true,
    data: landing,
  };
};