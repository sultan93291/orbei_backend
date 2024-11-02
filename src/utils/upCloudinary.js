/**
 * @fileoverview This module handles uploading images to Cloudinary and removes the local copy after upload.
 * @author Md. Abib Ahmed Dipto
 * @description Uploads an image to a specified Cloudinary folder and deletes the local file upon successful upload.
 * @date 2024-11-01
 * @copyright © abib.web.dev@gmail.com
 */

// Importing required modules
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_SERVER_NAME, // Cloudinary cloud name from environment variables
  api_key: process.env.CLOUD_API_KEY, // Cloudinary API key from environment variables
  api_secret: process.env.CLOUD_API_PASS, // Cloudinary API secret (not 'api_proxy', corrected here)
});

/**
 * Asynchronously uploads an image file to Cloudinary and deletes the local file after upload.
 * @param {string} localFilePath - Path to the local file to be uploaded.
 */
const uploadCloudinary = async (localFilePath = "public\\temp\\demo.jpg") => {
  try {
    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "orebi/product/images/", // Folder path in Cloudinary
    });

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      } else {
        console.log("Local file deleted successfully.");
      }
    });
    return uploadResult
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null
  }
};

// Exporting the upload function for use in other modules
module.exports = { uploadCloudinary };
