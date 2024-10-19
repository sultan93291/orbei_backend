/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is gonna  get signle category from db . this file gonna query is that category is exist or not if exit then it's gonna return to the user.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper.js");
const { CategoryModel } = require("../../../Schema/CategorySchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// get all registered user mechanisms

const deleteCategory = asyncHandler(async (req, res, next) => {
  // get data from params
  const { title } = req.params;

  if (!title) {
    return next(new apiError(400, "Please provide a title", null, false));
  }

  /// get data from cookies
  const DecodedData = await decodeToken(req);

  // checking is user existed
  const isAuthor = DecodedData?.Data?.userRole == "admin";

  if (!isAuthor) {
    return next(new apiError(401, " Unauthorize opperation ", false));
  }

  // get single registered category
  const requiredCategory = await CategoryModel.findOne({
    title: title,
  });

  if (!requiredCategory) {
    return next(
      new apiError(500, "Sorry requsted category not registered ", null, false)
    );
  }

  const deletedCategory = await CategoryModel.findOneAndDelete({
    title: title,
  });

  if (!deletedCategory) {
    return next(
      new apiError(
        500,
        "Sorry can't delete category at the moment ",
        null,
        false
      )
    );
  }

  return res
    .status(200)
    .json(new apiSuccess(true, "Successfully deleted category", 200, false));
});

module.exports = { deleteCategory };
