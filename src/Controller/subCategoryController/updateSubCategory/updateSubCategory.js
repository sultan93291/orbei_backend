/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is gonna  update a existed title . if that category is existed . and only a admin and a merchant ccan update a category .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper.js");
const { SubCategoryModel } = require("../../../Schema/SubCategorySchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// get all registered user mechanisms

const updateSubCategory = asyncHandler(async (req, res, next) => {
  // get data from params
  const { id } = req.params;
  

  if (!id) {
    return next(new apiError(400, "Please provide a category ID", null, false));
  }
  // get data from body
  const { updatedTitle, description } = req.body;

  if (!updatedTitle && !description) {
    return next(
      new apiError(400, "Please add title or description", null, false)
    );
  }

  // get single registered category
  const requiredSubCategory = await SubCategoryModel.findById(id);

  if (!requiredSubCategory) {
    return next(
      new apiError(404, "Sorry sub category is not registered ", null, false)
    );
  }

  /// get data from cookies
  const DecodedData = await decodeToken(req);

  // checking is user existed
  const isAuthor =
    DecodedData?.Data?.userRole == "admin" ||
    DecodedData?.Data?.userRole == "merchant";

  if (!isAuthor) {
    return next(new apiError(401, " Unauthorize opperation ", false));
  }

  // updated category
  const updatedData = {
    title: updatedTitle ?? requiredSubCategory.title,
    description: description ?? requiredSubCategory.description,
  };

  const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    updatedData,
    { new: true }
  );

  return res
    .status(200)
    .json(new apiSuccess(true, updatedSubCategory, 200, false));
});

module.exports = { updateSubCategory };
