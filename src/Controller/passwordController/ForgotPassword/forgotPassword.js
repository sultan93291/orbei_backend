/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the forgot password manager file . It will authorized the user inputed email adress if the mail adress is in db then it will send a otp and if the otp match then it let the user set a new password .
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

// forgot password mechanism

const forgotPassword = asyncHandler(async (req, res, next) => {
  // extract data from body
  const { emailAddress } = req.body;

  // check is valid email
  if (!emailAddress || !emailChecker(emailAddress)) {
    return next(new apiError(400, "Invalid email address", null, false));
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
});

module.exports = { forgotPassword };
