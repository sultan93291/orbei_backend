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
const { emailChecker, passwordChecker } = require("../../../utils/checker.js");

const {
  generateAccessToken,
  decodePassword,
  hashedPassword,
} = require("../../../helpers/helper.js");

const options = {
  httpOnly: true,
  secure: true,
};

// login function

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { emailAddress, password } = await req.body;

    if (!emailChecker(emailAddress)) {
      return next(
        new apiError(400, "Please enter a valid email address", null, false)
      );
    }

    if (!passwordChecker(password)) {
      return next(
        new apiError(400, "Please enter a valid password", null, false)
      );
    }

    // Checking if user already exists
    const isExistedUser = await user.findOne({ emailAddress });

    if (!isExistedUser) {
      return next(
        new apiError(400, "invalid username or password ", null, false)
      );
    }

    const isValidPass = await decodePassword(password, isExistedUser?.password);

    // generate access token
    const token = await generateAccessToken(emailAddress);

    if (isValidPass) {
      return res
        .status(200)
        .cookie("access_token", token, options)
        .json(
          new apiSuccess(
            true,
            { firstName: isExistedUser?.firstName },
            200,
            false
          )
        );
    } else {
      return next(new apiError(400, "invalid username or password ", false));
    }
  } catch (error) {
    return next(
      new apiError(500, "Server-side problem: " + error.message, null, false)
    );
  }
});

module.exports = { loginUser };
