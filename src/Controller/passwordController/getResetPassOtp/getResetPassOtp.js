/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file  is the get reset password otp generator file . this file will take the emailaddress from user and check the user exist or not . If exist then it will generate a otp then it will send it to the user mail address .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { generateAccessToken } = require("../../../helpers/helper");
const { otpGenerator } = require("../../../helpers/otpGenerator");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { emailChecker } = require("../../../utils/checker");
const { mailSender } = require("../../../utils/sendMail");

const options = {
  httpOnly: true,
  secure: true,
};

// get reset  password otp   mechanism
const getResetPasswordOtp = asyncHandler(async (req, res, next) => {
  // extract data from request body
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

  // generate otp
  const otp = await otpGenerator();

  // save the otp to the database
  isValidUser.resetOtp = otp;
  await isValidUser.save();

  // sending mail
  const mailInfo = await mailSender({
    name: isValidUser?.firstName,
    emailAddress,
    otp: otp,
    type: "verification",
  });

  if (!mailInfo) {
    return next(new apiError(500, "Failed to send email", null, false));
  }

  // generate data for generating token
  const data = {
    emailAddress,
    isReset: true,
  };

  // generate access token

  const token = await generateAccessToken(data);

  return res
    .status(200)
    .cookie("reset_token", token, options)
    .json(
      new apiSuccess(
        true,
        {
          // " Reset OTP sent to you. Please check your email address. "
          token,
        },
        null,
        false
      )
    );
});

module.exports = { getResetPasswordOtp };
