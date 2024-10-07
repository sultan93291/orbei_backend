/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the reset pass otp matcher file this file gonna verify the user inputed otp if match then it will set a cookie to user for reseting the pass . if not validated it will throw a error to the user  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken, generateAccessToken } = require("../../../helpers/helper");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");

const options = {
  httpOnly: true,
  secure: true,
};

// reset pass otp verification mechanism
const verifyResetPassOtp = asyncHandler(async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return next(new apiError(400, "Invalid otp ", null, false));
    }

    // get data form cookies
    const DecodedData = await decodeToken(req);

    // is existing user
    const existingUser = await user.findOne({
      emailAddress: DecodedData?.Data?.emailAddress,
    });

    if (!existingUser) {
      return next(new apiError(400, "Invalid  user ", null, false));
    }
    if (existingUser?.resetOtp !== otp) {
      return next(
        new apiError(401, "Invalid  otp , chekc again ", null, false)
      );
    }
    existingUser.resetOtp = null;
    existingUser.isValidatedResetAuth = true;
    await existingUser.save();

    // generate data for cookie
    const data = {
      emailAddress: existingUser?.emailAddress,
      isvalidAuth: existingUser?.isValidatedResetAuth,
      isReset: true,
    };

    const token = await generateAccessToken(data);

    return res
      .status(200)
      .cookie("reset_token", token, options)
      .json(new apiSuccess(true, token, 200, false));
  } catch (error) {
    return next(
      new apiError(500, `Server side problem : ${error.message}`, null, false)
    );
  }
});

module.exports = { verifyResetPassOtp };
