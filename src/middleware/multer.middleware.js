/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 01-11-2024
 * Description: This middleware handles image uploads for temporary storage,
 *              enforcing orebi-like rules for file types, size, and multiple uploads.
 *              Files are saved in the 'public/temp/images' folder with their original names.
 */

const multer = require("multer");

// Configure storage for image uploads
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/images"); // Directory for images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  },
});

// Define file filter for images (JPEG, PNG, and optional GIF support)
const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/; // Restrict to JPEG and PNG for Instagram-like behavior
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    file.originalname.split(".").pop().toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only JPEG and PNG files are allowed!"));
};

// Initialize multer for multiple image uploads with Instagram-like restrictions
const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit per file (Instagram-like size limit)
  fileFilter: imageFilter,
});

module.exports = {
  uploadImages
};
