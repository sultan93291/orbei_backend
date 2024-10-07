/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is gonna  get all user file . this file gonna return all current user.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { user } = require("../../../Schema/UserSchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// get all registered user mechanisms

const getAllRegisteredUser = asyncHandler(async (req, res, next) => {
  try {
    // get all registered user
    const allUsers = await user.find({}).select("-password -otp -refreshToken");

    if (!(allUsers.length > 0)) {
      return next(new apiError(500, "Sorry  no  registered user ", false));
    }

    return res.status(200).json(
      new apiSuccess(
        true,
        {
          allusers: allUsers,
        },
        200,
        false
      )
    );
  } catch (error) {
    return next(
      new apiError(500, "Server side problem " + error.message, false)
    );
  }
});

module.exports = { getAllRegisteredUser };
