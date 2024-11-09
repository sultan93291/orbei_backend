/**
 * @fileoverview This module handles uploading images to Cloudinary and removes the local copy after upload.
 * @author Md. Abib Ahmed Dipto
 * @description Uploads an image to a specified Cloudinary folder and deletes the local file upon successful upload.
 * @date 2024-11-10
 * @copyright © 2024 Md. Abib Ahmed Dipto (abib.web.dev@gmail.com)
 */

// Dependencies

// Internal dependencies
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { productModel } = require("../../../Schema/productSchema");
const { merchantModel } = require("../../../Schema/MerchantSchema");
const {
  uploadCloudinary,
  deleteCloudinaryAssets,
} = require("../../../utils/upCloudinary");
const { decodeToken } = require("../../../helpers/helper");
const { asyncHandler } = require("../../../utils/asyncaHandler");

/**
 * Update product mechanism
 * @description Handles the update of product details, including images.
 */
const updateProduct = asyncHandler(async (req, res, next) => {
  // Destructure required fields from the request body and parameters
  const { name, description, category, subCategory, price, discountPrice } =
    req.body;
  const { id } = req.params;

  // Decode token to check if the user is a merchant
  const DecodedData = await decodeToken(req);
  if (DecodedData?.Data.userRole !== "merchant") {
    return next(
      new apiError(401, `Only a merchant can update a product`, null, false)
    );
  }

  // Check if the user is a valid merchant
  const isMerchant = await merchantModel.findOne({
    userId: DecodedData?.Data?.userId,
  });
  if (!isMerchant) {
    return next(
      new apiError(
        401,
        `Sorry, only a merchant can post a product`,
        null,
        false
      )
    );
  }

  // Normalize images to be an array, handling both single and multiple uploads
  let images = req.files?.image;
  if (images && !Array.isArray(images)) {
    images = [images]; // Wrap single image in an array
  }

  // If no images and no product details to update, return an error
  if (
    !images &&
    !(name || description || category || subCategory || price || discountPrice)
  ) {
    return next(new apiError(400, `Nothing to update`, null, false));
  }

  // Check if the product exists
  const isExistedProduct = await productModel.findById(id);
  if (!isExistedProduct) {
    return next(new apiError(404, "Product not found", null, false));
  }

  // Upload new images if provided
  let imageUrls = [];
  if (images && images.length > 0) {
    const imagePaths = images.map((image) => image.path).filter(Boolean);
    const imageUploadInfo = await uploadCloudinary(imagePaths, "images");

    // Handle single or multiple images consistently
    imageUrls = Array.isArray(imageUploadInfo)
      ? imageUploadInfo.map((info) => info.secure_url)
      : [imageUploadInfo.secure_url];

    if (!imageUrls.length) {
      return next(
        new apiError(500, "Unable to upload images at the moment", null, false)
      );
    }
  }

  // Delete old images if new images were uploaded successfully
  if (imageUrls.length > 0 && isExistedProduct.image) {
    const deleteStatus = await deleteCloudinaryAssets(isExistedProduct.image);

    // Check the deletion status of old images
    if (!deleteStatus) {
      return next(
        new apiError(
          500,
          "Unable to delete previous images at the moment",
          null,
          false
        )
      );
    }
  }

  // Update the product fields with the new values or keep the old ones
  isExistedProduct.name = name || isExistedProduct.name;
  isExistedProduct.description = description || isExistedProduct.description;
  isExistedProduct.category = category || isExistedProduct.category;
  isExistedProduct.subCategory = subCategory || isExistedProduct.subCategory;
  isExistedProduct.price = price || isExistedProduct.price;
  isExistedProduct.discountPrice =
    discountPrice || isExistedProduct.discountPrice;
  isExistedProduct.image = imageUrls.length
    ? imageUrls
    : isExistedProduct.image;

  // Save the updated product to the database
  await isExistedProduct.save();

  // Return a success response
  return res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Product updated successfully",
        200,
        isExistedProduct,
        false
      )
    );
});

module.exports = { updateProduct };
