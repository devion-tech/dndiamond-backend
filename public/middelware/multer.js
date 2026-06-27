import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multerFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Please upload a valid image"), false);
  }
};

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadToCloudinary = async (file, folder = "products") => {
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder,
      resource_type: "auto",
      quality: "auto", // Size decresed
      fetch_format: "auto",
    },
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const destroyFiles = async (publicIds) => {
  return await cloudinary.api.delete_resources(publicIds);
};

export default cloudinary;
