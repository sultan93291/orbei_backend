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
const { emailChecker, passwordChecker } = require("../../../utils/checker.js");
const { merchantModel } = require("../../../Schema/MerchantSchema.js");

const {
  generateAccessToken,
  decodePassword,
} = require("../../../helpers/helper.js");

const options = {
  httpOnly: true,
  secure: true,
};

// login function

const loginUser = asyncHandler(async (req, res, next) => {
  const { emailAddress, password } = req.body;

  if (!emailAddress || !emailChecker(emailAddress)) {
    return next(
      new apiError(400, "Please enter a valid email address", null, false)
    );
  }

  if (!password || !passwordChecker(password)) {
    return next(
      new apiError(400, "Please enter a valid password", null, false)
    );
  }

  // Checking if user already exists
  const isExistedUser = await user.findOne({ emailAddress });

  if (!isExistedUser) {
    return next(
      new apiError(400, " Invalid username or password ", null, false)
    );
  }

  const isValidPass = await decodePassword(password, isExistedUser?.password);

  if (!isValidPass) {
    return next(new apiError(400, "Invalid username or password ", false));
  }

  const data = {
    email: isExistedUser.emailAddress,
    telephone: isExistedUser.telephone,
    firstName: isExistedUser.firstName,
    userId: isExistedUser?._id,
    isVerified: isExistedUser?.isVerified,
    userRole: isExistedUser?.role,
  };

  if (isExistedUser.role === "merchant") {
    // cheking is user a merchant
    const isExistedMerchant = await merchantModel.findOne({
      userId: isExistedUser.userId,
    });

    if (isExistedMerchant && isExistedMerchant.isVerifiedMerchant) {
      (data.merchantId = isExistedMerchant._id),
        (data.isVerifiedMerchant = isExistedMerchant.isVerifiedMerchant);
    }
  }

  // generate access token
  const token = await generateAccessToken(data);

  // saving current access token
  isExistedUser.refreshToken = token;
  await isExistedUser.save();
  return res
    .status(200)
    .cookie("access_token", token, options)
    .json(new apiSuccess(true, data, 200, false));
});

module.exports = { loginUser };
