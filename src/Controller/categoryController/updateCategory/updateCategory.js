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
const { CategoryModel } = require("../../../Schema/CategorySchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// get all registered user mechanisms

const updateCategory = asyncHandler(async (req, res, next) => {
  // get data from params
  const { title } = req.params;

  if (!title) {
    return next(new apiError(400, "Please provide a title", null, false));
  }
  // get data from body
  const { upDatedTitlte, description } = req.body;

  if (!upDatedTitlte) {
    return next(new apiError(400, "Please provide a title", null, false));
  }

  // get single registered category
  const requiredCategory = await CategoryModel.findOne({
    title: title,
  });

  if (!requiredCategory) {
    return next(
      new apiError(500, "Sorry required category not registered ", null, false)
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
    title: upDatedTitlte ?? requiredCategory.tittle,
    description: description ?? requiredCategory.description,
  };

  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { title: title },
    { ...updatedData },
    { new: true }
  );

  return res.status(200).json(
    new apiSuccess(
      true,
      {
        updatedCategory: updatedCategory,
      },
      200,
      false
    )
  );
});

module.exports = { updateCategory };
