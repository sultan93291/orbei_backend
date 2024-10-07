/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the reset password manager file . It will authorized the user inputed email adress if the mail adress is in db then it will go for the otp if the otp is valid otp then it will save the user inputed new password else it will return a error obj .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { hashedPassword } = require("../../../helpers/helper");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { emailChecker, passwordChecker } = require("../../../utils/checker");


// reset password mechanism

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    // extract data from body
    const { emailAddress, Otp, newPassword, confirmPassword } = req.body;

    // check is valid email
    if (!emailAddress || !emailChecker(emailAddress)) {
      return next(new apiError(400, "Invalid email address", null, false));
    }
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

    // check is valid user
    const isValidUser = await user.findOne({ emailAddress: emailAddress });

    if (!isValidUser) {
      return next(new apiError(400, "No user registered", null, false));
    }

    // check user inputed otp

    const DbOtp = isValidUser.otp;

    if (DbOtp != Otp) {
      return next(new apiError(400, "Otp invalid", null, false));
    }

    /// if valid user & valid otp then hash the password

    const hashedPass = await hashedPassword(newPassword);


    isValidUser.password = hashedPass;
    isValidUser.otp = null;
    await isValidUser.save();

    return res
      .status(200)
      .json(new apiSuccess(true, "Successfully reseted password", 200, null));
  } catch (error) {
    return next(
      new apiError(500, "server side problem:" + error.message, null, false)
    );
  }
});

module.exports = { resetPassword };
