/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the change password manager . If any user request to change the password . this file will take current password new password and confirm password from user .
 * then it will check the current password is valid or not . if valid then it will check if the new password and confirm password are same or not if it's same then it will hash it afte hashing it will save the new password .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { hashedPassword, decodePassword, decodeToken } = require("../../../helpers/helper");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { emailChecker, passwordChecker } = require("../../../utils/checker");



// change password mechanism

const changePassword = asyncHandler(async (req, res, next) => {
  try {
    // extract data from body
    const {  currentPassword, newPassword, confirmPassword } =
      req.body;

    // check is valid current  password
    if (!newPassword || !passwordChecker(currentPassword)) {
      return next(new apiError(400, "Invalid password signature", null, false));
    }

    // check is valid new password
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

    // decode token data

    const data = await decodeToken(req)



    // check is valid user
    const isValidUser = await user.findById(data?.Data?.userId);
    console.log(isValidUser);
    


    if (!isValidUser) {
      return next(new apiError(400, "No user registered", null, false));
    }

    // const is valid and verified current password
    const isValidPass = await decodePassword(currentPassword , isValidUser?.password);

    if (!isValidPass) {
      return next(
        new apiError(
          400,
          " Password didn't match , please try again",
          null,
          false
        )
      );
    }

    /// if valid user & verified current password  then hash the new password

    const hashedPass = await hashedPassword(newPassword);

    isValidUser.password = hashedPass;
    await isValidUser.save();

    return res
      .status(200)
      .json(new apiSuccess(true, "Successfully changed password", 200, null));
  } catch (error) {
    return next(
      new apiError(500, "server side problem:" + error.message, null, false)
    );
  }
});

module.exports = { changePassword };
