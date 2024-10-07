/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the reset password manager file . It will authorized the user inputed email adress if the mail adress is in db then it will go for the otp if the otp is valid otp then it will save the user inputed new password else it will return a error obj .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decode } = require("jsonwebtoken");
const { hashedPassword, decodeToken } = require("../../../helpers/helper");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { emailChecker, passwordChecker } = require("../../../utils/checker");

// reset password mechanism

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    // extract data from body
    const { newPassword, confirmPassword } = req.body;

    // check is valid password
    if (!newPassword || !passwordChecker(newPassword)) {
      return next(new apiError(400, "Invalid password signature", null, false));
    }
    // check is valid confirm password
    if (!confirmPassword || !passwordChecker(confirmPassword)) {
      return next(new apiError(400, "Invalid password signature", null, false));
    }

    // checking is both password and confirm password are same
    if (confirmPassword !== newPassword) {
      return next(new apiError(400, "check your password again", null, false));
    }

    // decode token

    const decodedToken = await decodeToken(req);

    console.log();

    // check is valid user
    const isValidUser = await user.findOne({
      emailAddress: decodedToken?.Data?.emailAddress,
    });

    if (!isValidUser) {
      return next(new apiError(400, "No user registered", null, false));
    }

    // is reset auth verified
    if (
      !isValidUser?.isValidatedResetAuth &&
      !decodedToken?.Data?.isValidatedResetAuth
    ) {
      return next(new apiError(400, " Reset auth invalid", null, false));
    }

    /// if valid user & valid reset auth
    const hashedPass = await hashedPassword(newPassword);

    isValidUser.password = hashedPass;
    isValidUser.isValidatedResetAuth = null;
    await isValidUser.save();

    return res
      .status(200)
      .clearCookie("reset_token")
      .json(new apiSuccess(true, "Successfully reseted password", 200, null));
  } catch (error) {
    return next(
      new apiError(500, "server side problem:" + error.message, null, false)
    );
  }
});

module.exports = { resetPassword };
