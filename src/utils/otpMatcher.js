/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file gonna be a utils file it will used for mutliple use . Like for verify account  or reset password etc .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../helpers/helper");
const { user } = require("../Schema/UserSchema");
const { apiError } = require("./apiError");
const { apiSuccess } = require("./apiSuccess");
const { asyncHandler } = require("./asyncaHandler");

const otpMatcher = async (otp, emailAddress, req, verifyAcc, resetPassword) => {
  try {
    if (resetPassword) {
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
    }
  } catch (error) {
    console.log(error);

    return next(
      new apiError(500, "Server-side problem: " + error.message, null, false)
    );
  }
};

module.exports = { otpMatcher };
