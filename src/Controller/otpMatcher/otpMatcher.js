/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file gonna the user inputed otp is validated or not if it's true then it's gonna verify the user .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { user } = require("../../Schema/UserSchema");
const { apiError } = require("../../utils/apiError");
const { apiSuccess } = require("../../utils/apiSuccess");
const { asyncHandler } = require("../../utils/asyncaHandler");

const optMatcher = asyncHandler(async (req, res, next) => {
  try {
    const { otp, emailAddress } = req.body;

    if (!otp || !emailAddress) {
      return next(
        new apiError(400, "Invalid otp or email adress", null, false)
      );
    }

    const existingUser = await user.findOne({
      emailAddress: emailAddress,
      otp: otp,
    });

    if (!existingUser) {
      return next(new apiError(400, "Invalid  user ", null, false));
    }
    existingUser.otp = null;
    await existingUser.save();
    return res
      .status(200)
      .json(new apiSuccess(true, "otp verified", 200, false));
  } catch (error) {
    console.log(error);

    return next(
      new apiError(500, "Server-side problem: " + error.message, null, false)
    );
  }
});

module.exports = { optMatcher };
