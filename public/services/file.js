import cloudinary, {
  uploadImage,
  uploadToCloudinary,
  destroyFiles,
} from "../middelware/multer.js";

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
