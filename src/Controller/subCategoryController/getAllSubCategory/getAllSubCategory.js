/*
 * author: Md. Abib Ahmed Dipto
 * date: 22-10-2024
 * description: This file is gonna  get all  subcategory from db . this file gonna return all current sub category of requsted category.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { CategoryModel } = require("../../../Schema/CategorySchema.js");
const { SubCategoryModel } = require("../../../Schema/SubCategorySchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// get all registered user mechanisms

const getAllRegisteredSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  // get all registered category
  const allSubCategory = await SubCategoryModel.find({
    category: id,
  }).populate("category");

  if (!(allSubCategory.length > 0)) {
    return next(
      new apiError(500, "Sorry no registered sub category ", null, false)
    );
  }

  return res.status(200).json(
    new apiSuccess(
      true,
      {
        allCategory: allSubCategory,
      },
      200,
      false
    )
  );
});

module.exports = { getAllRegisteredSubCategory };
