/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file gonna crate product category if a valid admin he can crate or approve it  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper");
const { CategoryModel } = require("../../../Schema/CategorySchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");

// approve categories mechanism

const approveCategoryController = asyncHandler(async (req, res,next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(
        new apiError(
          500,
          "Sorry requsted category not registered ",
          null,
          false
        )
      );
    }
    /// get data from cookies
    const DecodedData = await decodeToken(req);

    // checking is user existed
    const isAuthor = DecodedData?.Data?.userRole == "admin";

    if (!isAuthor) {
      return next(new apiError(401, " Unauthorize opperation ", null, false));
    }

    const isExistedCategory = await CategoryModel.findById(id);
    if (!isExistedCategory) {
      return next(
        new apiError(500, "Requested category does not exist", null, false)
      );
    }

    if (isExistedCategory.isActive === true) {
      return next(
        new apiError(400, "Requested category already approved", null, false)
      );
    }

    isExistedCategory.isActive = true;
    isExistedCategory.save();

    return res
      .status(200)
      .json(new apiSuccess(true, "Successfully approved category", 200, false));
  } catch (error) {
    return next(
      new apiError(500, "Server side problem " + error.message, false)
    );
  }
});

module.exports = { approveCategoryController };
