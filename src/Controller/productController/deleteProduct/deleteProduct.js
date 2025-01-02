/**
 * @fileoverview This module handles the deletion of files from a specified directory or storage location.
 * @author Md. Abib Ahmed Dipto
 * @description Deletes a specified file from the local file system or remote storage.
 * @date 2024-11-10
 * @copyright © 2024 Md. Abib Ahmed Dipto (abib.web.dev@gmail.com)
 */

// Dependencies

// internal dependencies
const { decodeToken } = require("../../../helpers/helper");
const { CategoryModel } = require("../../../Schema/CategorySchema");
const { merchantModel } = require("../../../Schema/MerchantSchema");
const { productModel } = require("../../../Schema/productSchema");
const { SubCategoryModel } = require("../../../Schema/SubCategorySchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");




// Delete product handler
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Decode the token to authenticate the user
  const DecodedData = await decodeToken(req);

  if (DecodedData?.Data?.userRole !== "merchant") {
    return next(
      new apiError(401, "Only merchants can delete a product.", null, false)
    );
  }

  // Verify merchant authorization
  const isMerchant = await merchantModel.findOne({
    userId: DecodedData?.Data?.userId,
  });

  if (!isMerchant) {
    return next(
      new apiError(401, "Unauthorized merchant access.", null, false)
    );
  }

  // Check if the product exists
  const isExistedProduct = await productModel.findById(id);

  if (!isExistedProduct) {
    return next(new apiError(404, "Product not found.", null, false));
  }

  // Check ownership of the product
  if (DecodedData?.Data?.userId !== isExistedProduct.owner) {
    return next(
      new apiError(
        401,
        "You are not authorized to delete this product.",
        null,
        false
      )
    );
  }

  // Delete associated Cloudinary assets
  const deleteStatus = await deleteCloudinaryAssets(isExistedProduct?.image);

  if (!deleteStatus) {
    return next(
      new apiError(500, "Unable to delete images at the moment.", null, false)
    );
  }

  // Remove the product reference from its category
  try {
    const category = await CategoryModel.findById(isExistedProduct?.category);
    if (category) {
      category.product.pull(isExistedProduct._id);
      await category.save();
    }
    const subCategory = await SubCategoryModel.findById(isExistedProduct.subCategory);
    if (subCategory) {
      subCategory.product.pull()
    }
  } catch (error) {
    return next(
      new apiError(500, "Failed to update the product category.", error, false)
    );
  }

  // Delete the product itself
  const isDeleted = await isExistedProduct.delete();

  if (!isDeleted) {
    return next(
      new apiError(
        500,
        "Unable to delete the product right now. Please try again later.",
        null,
        false
      )
    );
  }

  // Success response
  return res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Product successfully deleted.",
        200,
        isDeleted,
        false
      )
    );
});

module.exports = { deleteProduct };
