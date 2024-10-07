/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file handles the deletion of a user account. This is a crucial part of the code where both authentication and password validation are required. .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodePassword, decodeToken } = require("../../../helpers/helper");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { passwordChecker } = require("../../../utils/checker");

// delete user account mechanism
const deleteUserAccount = asyncHandler(async (req, res, next) => {
  try {
    // extracting data from request body
    const { password } = req.body;

    if (!password || !passwordChecker(password)) {
      return next(
        new apiError(400, "Please enter a valid password", null, false)
      );
    }

    // get data form cookies
    const DecodedData = await decodeToken(req);

    // checking is user existed
    const isExistedUser = await user.findById(DecodedData?.Data?.userId);

    if (!isExistedUser) {
      return next(new apiError(404, "User not found", null, false));
    }

    const isValidPass = await decodePassword(password, isExistedUser?.password);

    if (!isValidPass) {
      return next(new apiError(400, "Invalid password ", null, false));
    }

    // now delete the user
    const deletedUser = await user.findByIdAndDelete(DecodedData?.Data?.userId);

    if (!deletedUser) {
      return next(
        new apiError(500, "Unable to delete user at this moment", null, false)
      );
    }

    return res
      .status(200)
      .clearCookie("access_token")
      .json(
        new apiSuccess(true, "Successfully deleted user account", 200, false)
      );
  } catch (error) {
    return next(
      new apiError(500, `Server side problem : ${error.message}`, false)
    );
  }
});

module.exports = { deleteUserAccount };
