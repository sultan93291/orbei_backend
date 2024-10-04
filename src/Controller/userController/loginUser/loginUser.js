/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file handles the login functionality . and it's gonna check the password token etc then if everything is okay it's gonna login the user else it's gonna throw a error to user.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { user } = require("../../../Schema/UserSchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");
const { mailSender } = require("../../../utils/sendMail.js");
const { otpGenerator } = require("../../../helpers/otpGenerator.js");
const { generateAccessToken } = require("../../../helpers/helper.js");
const {
  emailChecker,
  passwordChecker,
  numberChecker,
} = require("../../../utils/checker.js");



// login function

const loginUser = asyncHandler(async (req, res, next) => {
  const { emailAdress, password} = await req.body;
}) 