/**
 * @fileoverview This module handles uploading images to Cloudinary and removes the local copy after upload.
 * @description Uploads a single or multiple images to a specified Cloudinary folder and deletes the local file(s) upon successful upload.
 * @date 2024-11-01
 */

const cloudinary = require("cloudinary").v2;
const { log } = require("console");
const fs = require("fs");

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_SERVER_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_PASS,
});

/**
 * Uploads a single image or multiple images to Cloudinary and deletes local files after a successful upload.
 * @param {string|string[]} localFilePaths - Path or array of paths to local file(s) to be uploaded.
 * @param {string} folder - The target folder in Cloudinary for uploaded files (e.g., "profilePictures" or "postImages").
 * @returns {Promise<Array|Object>} An array of upload results for multiple files, or a single result object for a single file.
 */
const uploadCloudinary = async (localFilePaths, folder) => {
  try {
    // Ensure localFilePaths is an array to handle single or multiple uploads uniformly
    const files = Array.isArray(localFilePaths)
      ? localFilePaths
      : [localFilePaths];

    // Map each file path to a Cloudinary upload promise
    const uploadPromises = files.map(async (filePath) => {
      // Check if filePath is a valid string
      if (typeof filePath !== "string") {
        console.error("Invalid file path:", filePath);
        throw new TypeError("Each file path must be a string.");
      }

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: `orebi/product/${folder}`, // Use dynamic folder based on function argument
      });

      fs.unlinkSync(filePath); // Delete the local file after successful upload
      return uploadResult;
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Return single result if only one file was uploaded
    return files.length === 1 ? results[0] : results;
  } catch (error) {
    console.error("Error uploading images to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

const deleteCloudinaryAssets = async (imagePaths) => {
  try {
    let allDeleted = true;
    console.log("Image paths to delete:", imagePaths);

    for (let imgLocation of imagePaths) {
      const publicId = imgLocation.split("/").pop().split(".").shift();
      console.log("Extracted publicId:", publicId);

      const deletedItems = await cloudinary.api.delete_resources(
        `orebi/product/images/${publicId}`,
        {
          type: "upload",
          resource_type: "image",
        }
      );

      // Log the entire deletion response for debugging
      console.log("Deletion response for", publicId, ":", deletedItems);

      // Verify deletion status with full path matching the response
      const deletionStatus =
        deletedItems?.deleted?.[`orebi/product/images/${publicId}`];
      if (deletionStatus !== "deleted") {
        allDeleted = false;
        console.warn(
          `Image with publicId ${publicId} could not be verified as deleted.`
        );
      }
    }
    return allDeleted;
  } catch (error) {
    console.error(`Error deleting images: ${error.message}`);
    return false;
  }
};

// Exporting the function for use in other modules
module.exports = { uploadCloudinary, deleteCloudinaryAssets };
