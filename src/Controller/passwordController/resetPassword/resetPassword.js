/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the reset password manager file . It will authorized the user inputed email adress if the mail adress is in db then it will go for the otp if the otp is valid otp then it will save the user inputed new password else it will return a error obj .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { otpGenerator } = require("../../../helpers/otpGenerator");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { emailChecker, passwordChecker } = require("../../../utils/checker");
const { mailSender } = require("../../../utils/sendMail");

// reset password mechanism

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    // extract data from body
    const { emailAddress, Otp, password, confirmPassword } = req.body;

    // check is valid email
    if (!emailAddress || !emailChecker(emailAddress)) {
      return next(new apiError(400, "Invalid email address", null, false));
    }
    // check is valid password
    if (!password || !emailChecker(password)) {
      return next(new apiError(400, "Invalid password signature", null, false));
    }

    // check is valid confirm password
    if (!confirmPassword || !emailChecker(confirmPassword)) {
      return next(new apiError(400, "Invalid password signature", null, false));
    }

    // checking is both password and confirm password are same 
    if (!(password == confirmPassword)) {
      return next(new apiError(400, "check your password again", null, false));
    }

    // check is valid user
    const isValidUser = await user.findOne({ emailAddress: emailAddress });

    if (!isValidUser) {
      return next(new apiError(400, "No user registered", null, false));
    }

    const otp = await otpGenerator();

    await mailSender({
      name: isValidUser.firstName,
      emailAddress,
      otp,
    });

    isValidUser.otp = otp;
    await isValidUser.save();

    return res
      .status(200)
      .json(
        new apiSuccess(
          true,
          "Confirm your indentity , please check your email address",
          200,
          null
        )
      );
  } catch (error) {
    return next(
      new apiError(400, "server side problem:" + error.message, null, false)
    );
  }
});

module.exports = { resetPassword };
