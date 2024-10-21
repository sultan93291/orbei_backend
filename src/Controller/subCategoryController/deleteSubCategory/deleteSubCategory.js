/*
 * author: Md. Abib Ahmed Dipto
 * date: 22-10-2024
 * description: This file takes the subcategory ID, checks if the subcategory exists, verifies the author, and if the user is authorized, deletes the requested subcategory.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper.js");
const { CategoryModel } = require("../../../Schema/CategorySchema.js");
const { SubCategoryModel } = require("../../../Schema/SubCategorySchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// Delete subcategory function
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  // Get subcategory ID from params
  const { id } = req.params;

  if (!id) {
    return next(
      new apiError(400, "Please provide a subcategory ID", null, false)
    );
  }

  // Decode the token from cookies
  const DecodedData = await decodeToken(req);

  // Check if the user is authorized (admin)
  const isAuthor = DecodedData?.Data?.userRole === "admin";

  if (!isAuthor) {
    return next(new apiError(401, "Unauthorized operation", false));
  }

  // Find the subcategory by ID
  const requiredSubCategory = await SubCategoryModel.findById(id);

  if (!requiredSubCategory) {
    return next(
      new apiError(404, "Requested subcategory not found", null, false)
    );
  }

  // Delete the subcategory
  const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!deletedSubCategory) {
    return next(
      new apiError(
        500,
        "Could not delete the subcategory at this time",
        null,
        false
      )
    );
  }

  // Find the linked category and remove the subcategory reference
  const linkedCategory = await CategoryModel.findById(
    deletedSubCategory.category
  );

  if (!linkedCategory) {
    return next(new apiError(404, "Linked category not found", null, false));
  }

  linkedCategory.subcategory.pull(deletedSubCategory._id);
  await linkedCategory.save();

  return res
    .status(200)
    .json(new apiSuccess(true, "Successfully deleted subcategory", 200, false));
});

module.exports = { deleteSubCategory };
