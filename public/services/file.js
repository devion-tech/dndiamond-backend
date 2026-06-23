import cloudinary, {
  uploadImage,
  uploadToCloudinary,
  destroyFile,
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
export const deleteFile = async (id) => {
  try {
    const response = await destroyFile(id);
    return response;
  } catch (error) {
    throw new Error(error, "Failed to delete  file!");
  }
};
