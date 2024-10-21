/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file gonna crate product sub category if a valid merchant he can crate it .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper");
const  {CategoryModel}  = require("../../../Schema/CategorySchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { SubCategoryModel } = require("../../../Schema/SubCategorySchema");

// create category mechanism

const createSubCategory = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title) {
    return next(new apiError(400, "Title is required", null, false));
  }
  if (!description) {
    return next(new apiError(400, "Description is required", null, false));
  }

  /// get data from cookies
  const DecodedData = await decodeToken(req);

  // validating author
  const isAuthor =
    DecodedData?.Data?.userRole == "admin" ||
    DecodedData?.Data?.userRole == "merchant";

  if (!isAuthor) {
    return next(new apiError(401, "Unauthorized operation", false));
  }

  const isExistedSubCategory = await SubCategoryModel.find({ title });

  if (isExistedSubCategory?.length) {
    return next(
      new apiError(
        400,
        `${isExistedSubCategory[0].title} already exist`,
        null,
        false
      )
    );
  }

  const isExistedCategory = await CategoryModel.findById(id);

  if (!isExistedCategory) {
    return next(
      new apiError(
        500,
        "Can't create subcategory right now, try again later.",
        null,
        false
      )
    );
  }

  if (isExistedCategory.isActive !== true) {
    return next(
      new apiError(
        500,
        "Category is not  active, try again later.",
        null,
        false
      )
    );
  }

  const newSubCategory = new SubCategoryModel({
    title: title,
    description: description,
    category: id,
  });

  const savedSubCategory = await newSubCategory.save();
  isExistedCategory.subcategory.push(savedSubCategory._id);
  await isExistedCategory.save();

  if (!savedSubCategory) {
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
        "Successfully registered  sub category ",
        200,
        savedSubCategory,
        false
      )
    );
});

module.exports = { createSubCategory };
