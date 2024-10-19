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

// create category mechanism

const createCategory = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title) {
    return next(new apiError(400, "Tittle is required", null, false));
  }
  if (!description) {
    return next(new apiError(400, "descreption is required", null, false));
  }

  /// get data from cookies
  const DecodedData = await decodeToken(req);

  // validating author
  const isAuthor =
    DecodedData?.Data?.userRole == "admin" ||
    DecodedData?.Data?.userRole == "merchant";

  if (!isAuthor) {
    return next(new apiError(401, " Unauthorize opperation ", false));
  }

  const isExistedCategory = await CategoryModel.find({ title });

  if (isExistedCategory?.length) {
    return next(
      new apiError(
        400,
        `${isExistedCategory[0].title} already exist`,
        null,
        false
      )
    );
  }

  const newCategory = new CategoryModel({
    title: title,
    description: description,
  });

  const savedCategory = await newCategory.save();

  if (!savedCategory) {
    return next(
      new apiError(
        500,
        " Can't create category right now , try again later. ",
        null,
        false
      )
    );
  }

  // If successfull return a success response
  return res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Successfully registered  category ",
        200,
        savedCategory,
        false
      )
    );
});

module.exports = { createCategory };
