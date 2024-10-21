/*
 * author: Md. Abib Ahmed Dipto
 * date: 22-10-2024
 * description: This file is gonna  get requested   subcategory from db . this file gonna return the inputed id sub category details .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { SubCategoryModel } = require("../../../Schema/SubCategorySchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// get all registered user mechanisms

const getRegisteredSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // get all registered category
  const isExistedSubCategory = await SubCategoryModel.findById(id);

  if (!isExistedSubCategory) {
    return next(
      new apiError(
        500,
        "Sorry requsted sub category is not registered  ",
        null,
        false
      )
    );
  }

  return res.status(200).json(
    new apiSuccess(
      true,
      isExistedSubCategory,
      200,
      false
    )
  );
});

module.exports = { getRegisteredSubCategory };
