/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is gonna  get all category from db . this file gonna return all current user.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { CategoryModel } = require("../../../Schema/CategorySchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// get all registered user mechanisms

const getAllRegisteredCategory = asyncHandler(async (req, res, next) => {
  // get all registered category
  const allCategory = await CategoryModel.find({});

  if (!(allCategory.length > 0)) {
    return next(new apiError(500, "Sorry no registered category ", false));
  }

  return res.status(200).json(
    new apiSuccess(
      true,
      {
        allCategory: allCategory,
      },
      200,
      false
    )
  );
});

module.exports = { getAllRegisteredCategory };
